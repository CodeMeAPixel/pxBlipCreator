local Logger = require('shared.logger')

RegisterNUICallback('createBlip', function(data, cb)
	cb(1)

	-- Validate data
	if not data or type(data) ~= "table" then
		Logger.warn('Invalid blip data received from NUI')
		return
	end

	-- Error handling for UI focus
	pcall(function()
		SetNuiFocus(false, false)
	end)

	-- Clean up empty groups
	if data.groups and not next(data.groups) then
		data.groups = nil
	end

	-- Safely trigger server event
	local triggerSuccess, triggerErr = pcall(function()
		TriggerServerEvent('pxBlipCreator:editBlip', data.id or false, data)
	end)

	if not triggerSuccess then
		Logger.error('Failed to trigger createBlip event: %s', triggerErr)
	end
end)

RegisterNUICallback('deleteblip', function(id, cb)
	cb(1)

	-- Validate ID
	if not id or type(id) ~= "number" then
		Logger.warn('Invalid blip ID for deletion')
		return
	end

	-- Error handling for UI focus
	pcall(function()
		SetNuiFocus(false, false)
	end)

	-- Safely trigger server event
	local triggerSuccess, triggerErr = pcall(function()
		TriggerServerEvent('pxBlipCreator:editBlip', id)
	end)

	if not triggerSuccess then
		Logger.error('Failed to trigger deleteblip event: %s', triggerErr)
	end
end)

RegisterNUICallback('teleportToBlip', function(id, cb)
    cb(1)

    -- Validate ID and blip exists
    if not id or not blips or not blips[id] then
		Logger.warn('Blip %s not found for teleport', tostring(id))
		return
	end

	local blipCoords = blips[id].coords
	if not blipCoords then
		Logger.warn('Blip %d has no coordinates', id)
		return
	end

	-- Error handling for UI focus
	pcall(function()
		SetNuiFocus(false, false)
	end)

	-- Safely teleport player
	local teleportSuccess, teleportErr = pcall(function()
		SetEntityCoords(PlayerPedId(), blipCoords.x, blipCoords.y, blipCoords.z)
	end)

	if not teleportSuccess then
		Logger.error('Failed to teleport player: %s', teleportErr)
	else
		Logger.debug('Teleported to blip %d (%.1f, %.1f, %.1f)', id, blipCoords.x, blipCoords.y, blipCoords.z)
	end
end)

RegisterNUICallback('exit', function(_, cb)
	cb(1)
	pcall(function()
		SetNuiFocus(false, false)
	end)
end)

-- ─── Export/Import ──────────────────────────────────────────────────────────

RegisterNUICallback('exportBlips', function(_, cb)
	cb(1)
	TriggerServerEvent('pxBlipCreator:exportBlips')
end)

RegisterNetEvent('pxBlipCreator:exportData', function(jsonData)
	if NuiHasLoaded then
		SendNuiMessage(json.encode({
			action = 'exportData',
			data = jsonData
		}))
	end
end)

RegisterNUICallback('importBlips', function(data, cb)
	cb(1)
	if not data or type(data) ~= "string" then
		Logger.warn('Invalid import data from NUI')
		return
	end
	TriggerServerEvent('pxBlipCreator:importBlips', data)
end)

RegisterNetEvent('pxBlipCreator:importResult', function(imported, failed)
	if NuiHasLoaded then
		SendNuiMessage(json.encode({
			action = 'importResult',
			data = { imported = imported, failed = failed }
		}))
	end

	-- Refresh blips after import
	if imported > 0 then
		TriggerServerEvent('pxBlipCreator:getBlips')
	end
end)

local function openUi(id)
	if not NuiHasLoaded then
		NuiHasLoaded = true

		local msgSuccess, msgErr = pcall(function()
			SendNuiMessage(json.encode({
				action = 'updateBlipData',
				data = blips
			}, { with_hole = false }))
		end)

		if not msgSuccess then
			Logger.error('Failed to send initial blips data: %s', msgErr)
			return
		end

		Wait(100)
	end

	local focusSuccess, focusErr = pcall(function()
		SetNuiFocus(true, true)
	end)

	if not focusSuccess then
		Logger.error('Failed to set NUI focus: %s', focusErr)
		return
	end

	local visibleSuccess, visibleErr = pcall(function()
		SendNuiMessage(json.encode({
			action = 'setVisible',
			data = id
		}))
	end)

	if not visibleSuccess then
		Logger.error('Failed to show UI: %s', visibleErr)
	end
end

RegisterNetEvent('pxBlipCreator:triggeredCommand', function()
	local cmdSuccess, cmdErr = pcall(function()
		openUi(nil)
	end)

	if not cmdSuccess then
		Logger.error('Failed to open UI: %s', cmdErr)
	end
end)
