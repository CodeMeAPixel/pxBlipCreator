local Logger = require('shared.logger')

if not LoadResourceFile(GetCurrentResourceName(), 'web/build/index.html') then
	Logger.error('Unable to load UI. Build pxBlipCreator or download the latest release.')
	Logger.info('https://github.com/CodeMeAPixel/pxBlipCreator/releases/latest/download/pxBlipCreator.zip')
end


if not GetResourceState('oxmysql'):find('start') then
	Logger.error('oxmysql not found - pxBlipCreator will not work')
	Logger.info('Make sure oxmysql is listed BEFORE pxBlipCreator in server.cfg')
	return
end

-- Load modules
local Validation = require('server.validation')
local RateLimiter = require('server.ratelimiter')
local Permissions = require('server.permissions')

local blips = {}

local function encodeData(blip)

	return json.encode({
		coords = blip.coords,
		groups = blip.groups,
		items = blip.items,
		hideUi = blip.hideUi,
		ftimer = blip.ftimer,
		sColor= blip.sColor,
		scImg= blip.scImg,
		Sprite= blip.Sprite,
		SpriteImg= blip.SpriteImg,
		scale= blip.scale,
		alpha= blip.alpha,
		colors= blip.colors,
		hideb= blip.hideb,
		tickb= blip.tickb,
		bflash= blip.bflash,
		sRange= blip.sRange,
		outline= blip.outline,
	})
end

local function createBlip(id, blip, name)
	blip.id = id
	blip.name = name
	blip.ftimer = tonumber(blip.ftimer)
	blip.coords = vector3(blip.coords.x, blip.coords.y, blip.coords.z)

	MySQL.update('UPDATE pxBlipCreator SET data = ? WHERE id = ?', { encodeData(blip), id })

	blips[id] = blip
	return blip
end

local isLoaded = false

MySQL.ready(function()
	local success, result = pcall(MySQL.query.await, 'SELECT id, name, data FROM pxBlipCreator') --[[@as any]]

	if not success then
		-- because some people can't run sql files
		success, result = pcall(MySQL.query, [[CREATE TABLE IF NOT EXISTS `pxBlipCreator` (
			`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
			`name` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_unicode_ci',
			`data` LONGTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
			PRIMARY KEY (`id`) USING BTREE,
			INDEX `idx_name` (`name`)
		) COLLATE='utf8mb4_unicode_ci' ENGINE=InnoDB; ]])

		if not success then
			Logger.error('Failed to create pxBlipCreator table: %s', tostring(result))
			return
		end

		Logger.success('Created table pxBlipCreator in MySQL database')
	elseif result then
		for i = 1, #result do
			local blip = result[i]
			local decodedData = json.decode(blip.data)
			if decodedData then
				createBlip(blip.id, decodedData, blip.name)
			else
				Logger.warn('Failed to decode blip data for ID %d', blip.id)
			end
		end
		Logger.success('Loaded %d blips from database', #result)
	end

	isLoaded = true
end)

RegisterNetEvent('pxBlipCreator:getBlips', function()
	local source = source
	while not isLoaded do Wait(100) end

	if not source or source == 0 then
		Logger.error('Invalid source in pxBlipCreator:getBlips')
		return
	end

	if RateLimiter.isLimited(source, 'getBlips') then
		Logger.debug('Rate limited getBlips from player %d', source)
		return
	end

	TriggerClientEvent('pxBlipCreator:setBlips', source, blips)
end)

RegisterNetEvent('pxBlipCreator:editBlip', function(id, data)
	local source = source
	
	-- Validate source
	if not source or source == 0 then
		Logger.error('Invalid source in pxBlipCreator:editBlip')
		return
	end

	-- Rate limit check
	if RateLimiter.isLimited(source, 'editBlip') then
		Logger.debug('Rate limited editBlip from player %d', source)
		return
	end

	-- Check permission
	if not Permissions.check(source, data and (id and 'edit' or 'create') or 'delete') then
		return
	end

	-- Handle deletion
	if not data then
		if id then
			local deleteSuccess, deleteResult = pcall(MySQL.update, 'DELETE FROM pxBlipCreator WHERE id = ?', { id })
			if not deleteSuccess then
			Logger.error('Failed to delete blip %d: %s', id, deleteResult)
				TriggerClientEvent('chat:addMessage', source, {
					args = { '^1[pxBlipCreator]^7', 'Failed to delete blip' }
				})
				return
			end

			blips[id] = nil
			TriggerClientEvent('pxBlipCreator:editBlip', -1, id, nil)
		end
		return
	end

	-- Validate blip data
	local validData
	local isValid, validatedDataOrError = Validation.validateBlip(data)
	
	if not isValid then
		Logger.warn('Player %d submitted invalid blip data: %s', source, validatedDataOrError)
		TriggerClientEvent('chat:addMessage', source, {
			args = { '^1[pxBlipCreator]^7', 'Invalid blip data: ' .. tostring(validatedDataOrError) }
		})
		return
	end

	validData = validatedDataOrError

	-- Auto-detect coordinates if not provided
	if not validData.coords then
		local ped = GetPlayerPed(source)
		local coords = GetEntityCoords(ped)
		validData.coords = { x = coords.x, y = coords.y, z = coords.z }
	end

	-- Auto-generate name if not provided
	if not validData.name or validData.name == "" then
		validData.name = string.format("Blip (%.1f, %.1f, %.1f)", 
			validData.coords.x, validData.coords.y, validData.coords.z)
	end

	-- Handle update
	if id then
		local updateSuccess, updateResult = pcall(MySQL.update, 
			'UPDATE pxBlipCreator SET name = ?, data = ? WHERE id = ?', 
			{ validData.name, encodeData(validData), id })
		
		if not updateSuccess then
			Logger.error('Failed to update blip %d: %s', id, updateResult)
			TriggerClientEvent('chat:addMessage', source, {
				args = { '^1[pxBlipCreator]^7', 'Failed to update blip' }
			})
			return
		end

		blips[id] = validData
		TriggerClientEvent('pxBlipCreator:editBlip', -1, id, validData)
	else
		-- Handle insert
		local insertSuccess, insertId = pcall(MySQL.insert.await, 
			'INSERT INTO pxBlipCreator (name, data) VALUES (?, ?)', 
			{ validData.name, encodeData(validData) })
		
		if not insertSuccess then
			Logger.error('Failed to insert blip: %s', insertId)
			TriggerClientEvent('chat:addMessage', source, {
				args = { '^1[pxBlipCreator]^7', 'Failed to create blip' }
			})
			return
		end

		local blip = createBlip(insertId, validData, validData.name)
		TriggerClientEvent('pxBlipCreator:setBlip', -1, blip.id, false, blip)
	end
end)

-- ─── Export/Import ──────────────────────────────────────────────────────────

RegisterNetEvent('pxBlipCreator:exportBlips', function()
	local source = source

	if not source or source == 0 then return end

	if not Permissions.check(source, 'export') then return end

	if RateLimiter.isLimited(source, 'getBlips') then return end

	-- Build clean export data (strip runtime-only fields)
	local exportData = {}
	for id, blip in pairs(blips) do
		exportData[#exportData + 1] = {
			name = blip.name,
			coords = blip.coords and { x = blip.coords.x, y = blip.coords.y, z = blip.coords.z } or nil,
			Sprite = blip.Sprite,
			SpriteImg = blip.SpriteImg,
			sColor = blip.sColor,
			scImg = blip.scImg,
			scale = blip.scale,
			alpha = blip.alpha,
			colors = blip.colors,
			groups = blip.groups,
			items = blip.items,
			hideb = blip.hideb,
			tickb = blip.tickb,
			hideUi = blip.hideUi,
			bflash = blip.bflash,
			ftimer = blip.ftimer,
			sRange = blip.sRange,
			outline = blip.outline,
		}
	end

	TriggerClientEvent('pxBlipCreator:exportData', source, json.encode({
		version = '0.0.1',
		exportedAt = os.date('!%Y-%m-%dT%H:%M:%SZ'),
		count = #exportData,
		blips = exportData,
	}))

	Logger.info('Player %d exported %d blips', source, #exportData)
end)

RegisterNetEvent('pxBlipCreator:importBlips', function(importJson)
	local source = source

	if not source or source == 0 then return end

	if not Permissions.check(source, 'import') then return end

	if RateLimiter.isLimited(source, 'editBlip') then return end

	-- Parse JSON
	local success, importData = pcall(json.decode, importJson)
	if not success or not importData or not importData.blips then
		Logger.warn('Player %d submitted invalid import data', source)
		TriggerClientEvent('chat:addMessage', source, {
			args = { '^1[pxBlipCreator]^7', 'Invalid import data format' }
		})
		return
	end

	local imported = 0
	local failed = 0

	for _, blipData in ipairs(importData.blips) do
		-- Validate each blip
		local isValid, validatedOrError = Validation.validateBlip(blipData)
		if not isValid then
			failed = failed + 1
			Logger.debug('Skipped invalid blip during import: %s', validatedOrError)
		else
			-- Insert into database
			local insertSuccess, insertId = pcall(MySQL.insert.await,
				'INSERT INTO pxBlipCreator (name, data) VALUES (?, ?)',
				{ validatedOrError.name or 'Imported Blip', encodeData(validatedOrError) })

			if insertSuccess then
				local blip = createBlip(insertId, validatedOrError, validatedOrError.name or 'Imported Blip')
				TriggerClientEvent('pxBlipCreator:setBlip', -1, blip.id, false, blip)
				imported = imported + 1
			else
				failed = failed + 1
				Logger.error('Failed to insert imported blip: %s', insertId)
			end
		end
	end

	TriggerClientEvent('pxBlipCreator:importResult', source, imported, failed)
	Logger.success('Player %d imported %d blips (%d failed)', source, imported, failed)
end)

-- ─── Commands ───────────────────────────────────────────────────────────────

RegisterCommand("blipcreator", function(source)
    if Permissions.can(source, 'access') then
		TriggerClientEvent('pxBlipCreator:triggeredCommand', source)
	else
		TriggerClientEvent('chat:addMessage', source, {
			args = { '^1[pxBlipCreator]^7', 'You do not have permission to use this command' }
		})
	end
end, true)
