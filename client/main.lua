local Logger = require('shared.logger')

if not LoadResourceFile(GetCurrentResourceName(), 'web/build/index.html') then
	Logger.error('Unable to load UI. Build pxBlipCreator or download the latest release.')
	Logger.info('https://github.com/CodeMeAPixel/pxBlipCreator/releases/latest/download/pxBlipCreator.zip')
end

local blips = {}
local NuiHasLoaded = false

local function createblip(blip)
	-- Validate blip object
	if not blip or type(blip) ~= "table" then
		Logger.warn('Invalid blip object: %s', type(blip))
		return false
	end

	-- Validate required fields
	if not blip.id or not blip.coords then
		Logger.warn('Blip missing required fields (id, coords)')
		return false
	end

	-- Safely get zone name
	local zoneSuccess, zone = pcall(function()
		return GetLabelText(GetNameOfZone(blip.coords.x, blip.coords.y, blip.coords.z))
	end)

	if zoneSuccess then
		blip.zone = zone
	else
		blip.zone = "Unknown"
		Logger.warn('Failed to get zone for blip %d', blip.id)
	end

	-- Check visibility conditions
	if not blip.hideUi and (blip.groups == nil or IsPlayerInGroup(blip.groups)) then

		if blips[blip.id] and blips[blip.id].blipObj ~= nil then
			RemoveBlip(blips[blip.id].blipObj)
		end

		-- Safely create blip
		local blipSuccess, newBlip = pcall(function()
			return AddBlipForCoord(blip.coords.x, blip.coords.y, blip.coords.z)
		end)

		if not blipSuccess then
			Logger.error('Failed to create blip at coords: %.1f, %.1f, %.1f',
				blip.coords.x, blip.coords.y, blip.coords.z)
			return false
		end

		blips[blip.id].blipObj = newBlip

		-- Apply blip properties with error handling
		pcall(function()
			SetBlipSprite(newBlip, blip.Sprite or 227)
			SetBlipScale(newBlip, (blip.scale or 100) / 10)
			SetBlipColour(newBlip, blip.sColor or 0)
			SetBlipAsShortRange(newBlip, blip.sRange or false)
			ShowTickOnBlip(newBlip, blip.tickb or false)
			ShowOutlineIndicatorOnBlip(newBlip, blip.outline or false)
			SetBlipAlpha(newBlip, blip.alpha or 255)

			if blip.bflash then
				SetBlipFlashes(newBlip, true)
				SetBlipFlashInterval(newBlip, tonumber(blip.ftimer) or 500)
			end

			if blip.hideb then
				SetBlipDisplay(newBlip, 3)
			else
				SetBlipDisplay(newBlip, 2)
			end

			BeginTextCommandSetBlipName("STRING")
			AddTextComponentString(blip.name or "Blip")
			EndTextCommandSetBlipName(newBlip)
		end)

		Logger.debug('Created blip %d (%s) at %.1f, %.1f, %.1f',
			blip.id, blip.name or 'unnamed',
			blip.coords.x, blip.coords.y, blip.coords.z)

		return true
	else
		-- Hide blip if conditions not met
		if blips[blip.id] and blips[blip.id].blipObj ~= nil then
			pcall(function()
				RemoveBlip(blips[blip.id].blipObj)
			end)
			blips[blip.id].blipObj = nil
		end
		return false
	end
end



RegisterNetEvent('pxBlipCreator:setBlips', function(data)
	if not data or type(data) ~= "table" then
		Logger.warn('Invalid blips data received from server')
		return
	end

	blips = data

	for _, blip in pairs(data) do
		pcall(function()
			createblip(blip)
		end)
	end

	Logger.success('Loaded %d blips', #data)
end)

RegisterNetEvent('pxBlipCreator:setBlip', function(id, source, data)
	if not blips then
		Logger.warn('Blips table not initialized')
		return
	end

	if data then
		blips[id] = data
		pcall(function()
			createblip(data)
		end)

		if NuiHasLoaded then
			local msgSuccess, msgErr = pcall(function()
				SendNuiMessage(json.encode({
					action = 'updateBlipData',
					data = data
				}))
			end)

			if not msgSuccess then
				Logger.warn('Failed to send NUI message: %s', msgErr)
			end
		end
	end
end)



RegisterNetEvent('pxBlipCreator:editBlip', function(id, data)
	if source == '' then return end

	if not blips or not blips[id] then
		Logger.warn('Blip %d not found', id or -1)
		return
	end

	local blip = blips[id]

	if data then
		pcall(function()
			if not data.zone then
				data.zone = blip.zone or GetLabelText(GetNameOfZone(blip.coords.x, blip.coords.y, blip.coords.z))
			end
		end)
	end

	blips[id] = data

	if data then
		pcall(function()
			createblip(data)
		end)
	end

	if NuiHasLoaded then
		local msgSuccess, msgErr = pcall(function()
			SendNuiMessage(json.encode({
				action = 'updateBlipData',
				data = data or id
			}))
		end)

		if not msgSuccess then
			Logger.warn('Failed to send NUI message: %s', msgErr)
		end
	end
end)