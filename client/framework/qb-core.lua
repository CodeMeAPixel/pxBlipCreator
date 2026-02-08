local Logger = require('shared.logger')
local resourceName = 'qb-core'

if not GetResourceState(resourceName):find('start') then return end

Logger.info('Detected QBCore framework')

local QB = nil
local retries = 0
local maxRetries = 10

-- Safely get the core object with retries
CreateThread(function()
	while not QB and retries < maxRetries do
		local success, result = pcall(function()
			return exports[resourceName]:GetCoreObject()
		end)

		if success and result then
			QB = result
			Logger.success('QBCore object loaded')
			return
		end

		retries = retries + 1
		Logger.debug('Waiting for QBCore object (attempt %d/%d)', retries, maxRetries)
		Wait(1000)
	end

	if not QB then
		Logger.error('Failed to load QBCore object after %d attempts', maxRetries)
	end
end)

function GetPlayer()
	if not QB then return nil end

	local success, result = pcall(function()
		return QB.Functions.GetPlayerData()
	end)

	if success then
		return result
	end

	Logger.warn('Failed to get QBCore player data')
	return nil
end

RegisterNetEvent('QBCore:Client:OnJobUpdate', function()
	if blips then
		TriggerEvent('pxBlipCreator:setBlips', blips)
	end
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
	TriggerServerEvent('pxBlipCreator:getBlips')
end)

-- QBCore also has gang support
RegisterNetEvent('QBCore:Client:OnGangUpdate', function()
	if blips then
		TriggerEvent('pxBlipCreator:setBlips', blips)
	end
end)

local groups = { 'job', 'gang' }

function IsPlayerInGroup(filter)
	local type = type(filter)
	local player = GetPlayer()

	if not player then
		return nil
	end

	if type == 'string' then
		for i = 1, #groups do
			local data = player[groups[i]]

			if data and data.name == filter then
				return data.name, data.grade and data.grade.level or 0
			end
		end
	else
		local tabletype = table.type(filter)

		if tabletype == 'hash' then
			for i = 1, #groups do
				local data = player[groups[i]]
				if data then
					local grade = filter[data.name]

					if grade and data.grade and grade <= data.grade.level then
						return data.name, data.grade.level
					end
				end
			end
		elseif tabletype == 'array' then
			for i = 1, #filter do
				local group = filter[i]

				for j = 1, #groups do
					local data = player[groups[j]]

					if data and data.name == group then
						return data.name, data.grade and data.grade.level or 0
					end
				end
			end
		end
	end
end
end
