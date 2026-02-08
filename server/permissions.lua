--[[
    pxBlipCreator - Permissions Module
    Provides granular permission checks beyond simple ACE.
    
    ACE Permissions (add to server.cfg):
        add_ace group.admin command.blipcreator allow       # Full access
        add_ace group.admin pxblip.create allow              # Create blips
        add_ace group.admin pxblip.edit allow                # Edit blips 
        add_ace group.admin pxblip.delete allow              # Delete blips
        add_ace group.admin pxblip.export allow              # Export blips
        add_ace group.admin pxblip.import allow              # Import blips
    
    Usage:
        local Permissions = require('server.permissions')
        if not Permissions.can(source, 'create') then return end
]]

local Logger = require('shared.logger')

local Permissions = {}

--- Permission definitions
--- 'command.blipcreator' grants ALL permissions (legacy/master permission)
local PERMS = {
    access  = 'command.blipcreator',   -- Open the UI
    create  = 'pxblip.create',         -- Create new blips
    edit    = 'pxblip.edit',           -- Edit existing blips
    delete  = 'pxblip.delete',        -- Delete blips
    export  = 'pxblip.export',        -- Export blips
    import  = 'pxblip.import',        -- Import blips
}

--- Check if a player has a specific permission
--- The master ACE 'command.blipcreator' always grants access
--- @param source number Player server ID
--- @param action string Permission key ('create', 'edit', 'delete', 'export', 'import')
--- @return boolean
function Permissions.can(source, action)
    if not source or source <= 0 then return false end

    -- Master permission grants everything
    if IsPlayerAceAllowed(source, PERMS.access) then
        return true
    end

    -- Check granular permission
    local ace = PERMS[action]
    if not ace then
        Logger.warn('Unknown permission check: %s', tostring(action))
        return false
    end

    return IsPlayerAceAllowed(source, ace) == true
end

--- Check permission and log + notify on failure
--- @param source number Player server ID
--- @param action string Permission key
--- @return boolean
function Permissions.check(source, action)
    if Permissions.can(source, action) then
        return true
    end

    Logger.warn('Player %d denied permission: %s', source, action)
    TriggerClientEvent('chat:addMessage', source, {
        args = { '^1[pxBlipCreator]^7', 'You do not have permission to ' .. action .. ' blips' }
    })
    return false
end

--- Get all permissions for a player (for debugging)
--- @param source number Player server ID
--- @return table<string, boolean>
function Permissions.getAll(source)
    local perms = {}
    for key, ace in pairs(PERMS) do
        perms[key] = IsPlayerAceAllowed(source, ace) == true
    end
    return perms
end

return Permissions
