--[[
    pxBlipCreator - Rate Limiter Module
    Protects server events from abuse/spam.

    Usage:
        local RateLimiter = require('server.ratelimiter')
        
        -- In an event handler:
        if RateLimiter.isLimited(source, 'editBlip') then
            return  -- Player is rate-limited
        end
]]

local Logger = require('shared.logger')

local RateLimiter = {}

--- Configuration
local CONFIG = {
    -- Max actions per window (per player per action)
    limits = {
        editBlip   = { max = 10, windowMs = 10000 },  -- 10 edits per 10s
        getBlips   = { max = 5,  windowMs = 5000  },   -- 5 fetches per 5s
        default    = { max = 15, windowMs = 10000 },   -- fallback
    },
    -- How long to keep tracking data for inactive players (ms)
    cleanupInterval = 60000,
    -- Ban threshold: consecutive limit hits before temporary ban
    banThreshold = 5,
    -- Temp ban duration (ms)
    banDuration = 30000,
}

--- Internal state: { [source] = { [action] = { timestamps = {}, strikes = 0 } } }
local playerActions = {}

--- Track temp bans: { [source] = banExpiry }
local playerBans = {}

--- Get limit config for an action
--- @param action string
--- @return table { max: number, windowMs: number }
local function getLimit(action)
    return CONFIG.limits[action] or CONFIG.limits.default
end

--- Get current time in milliseconds
--- @return number
local function now()
    return GetGameTimer()
end

--- Clean old timestamps from a player's action record
--- @param record table { timestamps: table, strikes: number }
--- @param windowMs number
local function pruneTimestamps(record, windowMs)
    local cutoff = now() - windowMs
    local timestamps = record.timestamps
    local newTimestamps = {}

    for i = 1, #timestamps do
        if timestamps[i] > cutoff then
            newTimestamps[#newTimestamps + 1] = timestamps[i]
        end
    end

    record.timestamps = newTimestamps
end

--- Check if a player is currently rate-limited for an action.
--- Records the attempt and returns true if they should be blocked.
--- @param source number Player server ID
--- @param action string Action identifier (e.g. 'editBlip')
--- @return boolean isLimited
function RateLimiter.isLimited(source, action)
    if not source or source <= 0 then return true end

    -- Check temp ban
    local banExpiry = playerBans[source]
    if banExpiry and now() < banExpiry then
        Logger.debug('Player %d is temp-banned (expires in %dms)', source, banExpiry - now())
        return true
    elseif banExpiry then
        playerBans[source] = nil -- Ban expired
    end

    -- Initialize tracking
    if not playerActions[source] then
        playerActions[source] = {}
    end
    if not playerActions[source][action] then
        playerActions[source][action] = { timestamps = {}, strikes = 0 }
    end

    local record = playerActions[source][action]
    local limit = getLimit(action)

    -- Prune old entries
    pruneTimestamps(record, limit.windowMs)

    -- Check limit
    if #record.timestamps >= limit.max then
        record.strikes = record.strikes + 1
        Logger.warn('Player %d rate-limited on "%s" (strike %d/%d)',
            source, action, record.strikes, CONFIG.banThreshold)

        -- Apply temp ban if too many strikes
        if record.strikes >= CONFIG.banThreshold then
            playerBans[source] = now() + CONFIG.banDuration
            record.strikes = 0
            Logger.warn('Player %d temp-banned for %ds due to repeated rate limit violations',
                source, CONFIG.banDuration / 1000)
        end

        return true
    end

    -- Record this attempt
    record.timestamps[#record.timestamps + 1] = now()
    return false
end

--- Clean up tracking data for a player (call on disconnect)
--- @param source number Player server ID
function RateLimiter.cleanup(source)
    playerActions[source] = nil
    playerBans[source] = nil
end

--- Get stats for a player (for debugging)
--- @param source number Player server ID
--- @return table|nil
function RateLimiter.getStats(source)
    if not playerActions[source] then return nil end

    local stats = {}
    for action, record in pairs(playerActions[source]) do
        local limit = getLimit(action)
        pruneTimestamps(record, limit.windowMs)
        stats[action] = {
            recent = #record.timestamps,
            max = limit.max,
            strikes = record.strikes,
            banned = playerBans[source] and now() < playerBans[source] or false,
        }
    end
    return stats
end

-- Periodic cleanup of stale data
CreateThread(function()
    while true do
        Wait(CONFIG.cleanupInterval)

        local cleaned = 0
        for source, _ in pairs(playerActions) do
            -- Check if player is still connected
            if not GetPlayerName(source) then
                playerActions[source] = nil
                playerBans[source] = nil
                cleaned = cleaned + 1
            end
        end

        if cleaned > 0 then
            Logger.debug('Rate limiter: cleaned %d disconnected player records', cleaned)
        end
    end
end)

-- Clean up on player drop
AddEventHandler('playerDropped', function()
    local source = source
    RateLimiter.cleanup(source)
end)

return RateLimiter
