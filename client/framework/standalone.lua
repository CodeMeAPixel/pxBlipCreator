--[[
    pxBlipCreator - Standalone Framework Fallback
    Provides basic functionality when no supported framework is detected.
    This file loads LAST so it only defines functions if ESX/QB didn't.
]]

local Logger = require('shared.logger')

-- Only activate if no framework loaded the GetPlayer/IsPlayerInGroup functions
if GetPlayer then return end

Logger.info('No framework detected, running in standalone mode')

function GetPlayer()
    return { identifier = 'standalone' }
end

-- In standalone mode, groups are not supported
function IsPlayerInGroup(_filter)
    return nil
end

-- Load blips on resource start since there's no framework "playerLoaded" event
CreateThread(function()
    Wait(2000) -- Wait for server to be ready
    TriggerServerEvent('pxBlipCreator:getBlips')
end)
