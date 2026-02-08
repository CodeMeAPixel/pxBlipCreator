--[[
    pxBlipCreator - Shared Logger Module
    Provides structured, leveled logging for both client and server.
    
    Usage:
        local Logger = require('shared.logger')
        Logger.info('Loaded %d blips', count)
        Logger.warn('Invalid blip data for ID %d', id)
        Logger.error('Database connection failed: %s', err)
        Logger.debug('Processing blip: %s', json.encode(blip))
    
    Configuration (via ConVar):
        setr pxblip:debug "true"   -- Enable debug-level output (default: false)
        setr pxblip:prefix "true"  -- Show [pxBlipCreator] prefix (default: true)
]]

local Logger = {}

local RESOURCE_NAME = 'pxBlipCreator'

Logger.LEVELS = {
    DEBUG = 0,
    INFO  = 1,
    WARN  = 2,
    ERROR = 3,
    NONE  = 4,
}

local COLORS = {
    RESET  = '^7',
    RED    = '^1',
    GREEN  = '^2',
    YELLOW = '^3',
    BLUE   = '^5',
    CYAN   = '^6',
    WHITE  = '^7',
    GREY   = '^9',
}

local LEVEL_LABELS = {
    [Logger.LEVELS.DEBUG] = COLORS.GREY   .. '[DEBUG]' .. COLORS.RESET,
    [Logger.LEVELS.INFO]  = COLORS.BLUE   .. '[INFO]'  .. COLORS.RESET,
    [Logger.LEVELS.WARN]  = COLORS.YELLOW .. '[WARN]'  .. COLORS.RESET,
    [Logger.LEVELS.ERROR] = COLORS.RED    .. '[ERROR]' .. COLORS.RESET,
}

local function isDebugEnabled()
    local val = GetConvar('pxblip:debug', 'false')
    return val == 'true' or val == '1'
end

local function showPrefix()
    local val = GetConvar('pxblip:prefix', 'true')
    return val ~= 'false' and val ~= '0'
end

local function getMinLevel()
    if isDebugEnabled() then
        return Logger.LEVELS.DEBUG
    end
    return Logger.LEVELS.INFO
end

local CONTEXT = IsDuplicityVersion() and 'SVR' or 'CLT'

local function log(level, msg, ...)
    if level < getMinLevel() then return end

    local label = LEVEL_LABELS[level] or '[???]'
    local prefix = ''

    if showPrefix() then
        prefix = string.format('%s[%s]%s ', COLORS.CYAN, RESOURCE_NAME, COLORS.RESET)
    end

    local formatted
    local argCount = select('#', ...)
    if argCount > 0 then
        local success, result = pcall(string.format, msg, ...)
        formatted = success and result or (msg .. ' (format error)')
    else
        formatted = msg
    end

    print(string.format('%s%s %s[%s]%s %s',
        prefix,
        label,
        COLORS.GREY, CONTEXT, COLORS.RESET,
        formatted
    ))
end

function Logger.debug(msg, ...)
    log(Logger.LEVELS.DEBUG, msg, ...)
end

function Logger.info(msg, ...)
    log(Logger.LEVELS.INFO, msg, ...)
end

function Logger.warn(msg, ...)
    log(Logger.LEVELS.WARN, msg, ...)
end

function Logger.error(msg, ...)
    log(Logger.LEVELS.ERROR, msg, ...)
end

function Logger.success(msg, ...)
    local prefix = ''
    if showPrefix() then
        prefix = string.format('%s[%s]%s ', COLORS.CYAN, RESOURCE_NAME, COLORS.RESET)
    end

    local formatted
    local argCount = select('#', ...)
    if argCount > 0 then
        local success, result = pcall(string.format, msg, ...)
        formatted = success and result or (msg .. ' (format error)')
    else
        formatted = msg
    end

    print(string.format('%s%s[OK]%s %s[%s]%s %s',
        prefix,
        COLORS.GREEN, COLORS.RESET,
        COLORS.GREY, CONTEXT, COLORS.RESET,
        formatted
    ))
end

function Logger.assert(condition, msg, ...)
    if not condition then
        Logger.error(msg, ...)
    end
    return condition
end

return Logger
