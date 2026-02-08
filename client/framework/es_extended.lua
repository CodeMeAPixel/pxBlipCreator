local Logger = require('shared.logger')
local resourceName = 'es_extended'

if not GetResourceState(resourceName):find('start') then return end

Logger.info('Detected ESX framework')

local ESX = nil
local retries = 0
local maxRetries = 10

-- Safely get the shared object with retries
CreateThread(function()
	while not ESX and retries < maxRetries do
		local success, result = pcall(function()
			return exports[resourceName]:getSharedObject()
		end)

		if success and result then
			ESX = result
			Logger.success('ESX shared object loaded')
			return
		end

		retries = retries + 1
		Logger.debug('Waiting for ESX shared object (attempt %d/%d)', retries, maxRetries)
		Wait(1000)
	end

	if not ESX then
		Logger.error('Failed to load ESX shared object after %d attempts', maxRetries)
	end
end)

function GetPlayer()
	if not ESX then return nil end

	local success, result = pcall(function()
		return ESX.PlayerData
	end)

	if success then
		return result
	end

	Logger.warn('Failed to get ESX player data')
	return nil
end

RegisterNetEvent('esx:setJob')
AddEventHandler('esx:setJob', function()
	if blips then
		TriggerEvent('pxBlipCreator:setBlips', blips)
	end
end)

RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function()
	TriggerServerEvent('pxBlipCreator:getBlips')
end)

function IsPlayerInGroup(filter)
	local type = type(filter)
	local player = GetPlayer()

	if not player or not player.job then
		return nil
	end

	if type == 'string' then
		if player.job.name == filter then
			return player.job.name, player.job.grade
		end
	else
		local tabletype = table.type(filter)

		if tabletype == 'hash' then
			local grade = filter[player.job.name]

			if grade and grade <= player.job.grade then
				return player.job.name, player.job.grade
			end
		elseif tabletype == 'array' then
			for i = 1, #filter do
				if player.job.name == filter[i] then
					return player.job.name, player.job.grade
				end
			end
		end
	end
end

