local MAP_BOUNDS = {
	minX = -3000,
	maxX = 3000,
	minY = -3000,
	maxY = 3000,
	minZ = -100,
	maxZ = 1000,
}

-- Valid FiveM blip sprites range
local VALID_SPRITE_MIN = 0
local VALID_SPRITE_MAX = 1000

-- Valid color range
local VALID_COLOR_MIN = 0
local VALID_COLOR_MAX = 255

-- Valid alpha (transparency) range
local VALID_ALPHA_MIN = 0
local VALID_ALPHA_MAX = 255

-- Maximum blip name length
local MAX_NAME_LENGTH = 50

--- Trims whitespace from a string
local function trim(str)
	return str:match("^%s*(.-)%s*$")
end

--- Checks if a value is a valid number
local function isValidNumber(value)
	return type(value) == "number" and not (value ~= value) -- NaN check
end

--- Validates a blip name
-- @param name The blip name to validate
-- @return Boolean indicating validity, error message if invalid
local function validateName(name)
	if not name or type(name) ~= "string" then
		return false, "Blip name must be a string"
	end

	local trimmed = trim(name)
	if #trimmed == 0 then
		return false, "Blip name cannot be empty"
	end

	if #trimmed > MAX_NAME_LENGTH then
		return false, string.format("Blip name cannot exceed %d characters", MAX_NAME_LENGTH)
	end

	return true, trimmed
end

--- Validates coordinates
-- @param coords Table with x, y, z properties
-- @return Boolean indicating validity, coords if valid or error message if invalid
local function validateCoords(coords)
	if not coords or type(coords) ~= "table" then
		return false, "Coordinates must be a table"
	end

	local x, y, z = coords.x, coords.y, coords.z

	-- Validate X
	if not isValidNumber(x) then
		return false, "X coordinate must be a valid number"
	end
	if x < MAP_BOUNDS.minX or x > MAP_BOUNDS.maxX then
		return false, string.format("X coordinate must be between %.0f and %.0f", 
			MAP_BOUNDS.minX, MAP_BOUNDS.maxX)
	end

	-- Validate Y
	if not isValidNumber(y) then
		return false, "Y coordinate must be a valid number"
	end
	if y < MAP_BOUNDS.minY or y > MAP_BOUNDS.maxY then
		return false, string.format("Y coordinate must be between %.0f and %.0f",
			MAP_BOUNDS.minY, MAP_BOUNDS.maxY)
	end

	-- Validate Z
	if not isValidNumber(z) then
		return false, "Z coordinate must be a valid number"
	end
	if z < MAP_BOUNDS.minZ or z > MAP_BOUNDS.maxZ then
		return false, string.format("Z coordinate must be between %.0f and %.0f",
			MAP_BOUNDS.minZ, MAP_BOUNDS.maxZ)
	end

	return true, { x = x, y = y, z = z }
end

--- Validates sprite ID
-- @param sprite The sprite ID to validate
-- @return Boolean indicating validity, sprite if valid or error message if invalid
local function validateSprite(sprite)
	if not isValidNumber(sprite) then
		return false, "Sprite must be a valid number"
	end

	if sprite ~= math.floor(sprite) then
		return false, "Sprite must be an integer"
	end

	if sprite < VALID_SPRITE_MIN or sprite > VALID_SPRITE_MAX then
		return false, string.format("Sprite must be between %d and %d",
			VALID_SPRITE_MIN, VALID_SPRITE_MAX)
	end

	return true, sprite
end

--- Validates a color value
-- @param color The color value to validate
-- @param fieldName Optional field name for error message
-- @return Boolean indicating validity, color if valid or error message if invalid
local function validateColor(color, fieldName)
	fieldName = fieldName or "color"

	if not isValidNumber(color) then
		return false, string.format("%s must be a valid number", fieldName)
	end

	if color ~= math.floor(color) then
		return false, string.format("%s must be an integer", fieldName)
	end

	if color < VALID_COLOR_MIN or color > VALID_COLOR_MAX then
		return false, string.format("%s must be between %d and %d",
			fieldName, VALID_COLOR_MIN, VALID_COLOR_MAX)
	end

	return true, color
end

--- Validates alpha (transparency) value
-- @param alpha The alpha value to validate
-- @return Boolean indicating validity, alpha if valid or error message if invalid
local function validateAlpha(alpha)
	if not isValidNumber(alpha) then
		return false, "Alpha must be a valid number"
	end

	if alpha ~= math.floor(alpha) then
		return false, "Alpha must be an integer"
	end

	if alpha < VALID_ALPHA_MIN or alpha > VALID_ALPHA_MAX then
		return false, string.format("Alpha must be between %d and %d",
			VALID_ALPHA_MIN, VALID_ALPHA_MAX)
	end

	return true, alpha
end

--- Validates scale value
-- @param scale The scale value to validate
-- @return Boolean indicating validity, scale if valid or error message if invalid
local function validateScale(scale)
	if not isValidNumber(scale) then
		return false, "Scale must be a valid number"
	end

	-- Allow reasonable scale values (stored as size * 10)
	if scale < 10 or scale > 500 then
		return false, "Scale must be between 10 and 500"
	end

	return true, scale
end

--- Sanitizes a string for safe storage
-- @param str The string to sanitize
-- @return Sanitized string
local function sanitizeString(str)
	if not str or type(str) ~= "string" then
		return ""
	end

	-- Trim whitespace
	local sanitized = trim(str)

	-- Remove null bytes
	sanitized = sanitized:gsub("%z", "")

	-- Limit to database field max
	if #sanitized > MAX_NAME_LENGTH then
		sanitized = sanitized:sub(1, MAX_NAME_LENGTH)
	end

	return sanitized
end

--- Validates RGB color array
-- @param colors Array with [R, G, B] values
-- @return Boolean indicating validity, colors if valid or error message if invalid
local function validateRGBArray(colors)
	if not colors or type(colors) ~= "table" then
		return false, "Colors must be a table"
	end

	if #colors ~= 3 then
		return false, "Colors must have exactly 3 values [R, G, B]"
	end

	-- Validate each color component
	for i = 1, 3 do
		local valid, color = validateColor(colors[i], string.format("Color[%d]", i))
		if not valid then
			return false, color
		end
	end

	return true, colors
end

--- Validates an entire blip object
-- @param blip The blip table to validate
-- @return Boolean indicating validity, error message if invalid, or sanitized blip if valid
local function validateBlip(blip)
	if not blip or type(blip) ~= "table" then
		return false, "Blip must be a table"
	end

	-- Validate name
	local nameValid, name = validateName(blip.name)
	if not nameValid then
		return false, name
	end

	-- Validate coordinates if provided
	if blip.coords then
		local coordsValid, coords = validateCoords(blip.coords)
		if not coordsValid then
			return false, coords
		end
		blip.coords = coords
	end

	-- Validate sprite if provided
	if blip.Sprite then
		local spriteValid, sprite = validateSprite(blip.Sprite)
		if not spriteValid then
			return false, sprite
		end
		blip.Sprite = sprite
	end

	-- Validate colors if provided
	if blip.sColor then
		local colorValid, color = validateColor(blip.sColor, "sColor")
		if not colorValid then
			return false, color
		end
		blip.sColor = color
	end

	-- Validate alpha if provided
	if blip.alpha then
		local alphaValid, alpha = validateAlpha(blip.alpha)
		if not alphaValid then
			return false, alpha
		end
		blip.alpha = alpha
	end

	-- Validate scale if provided
	if blip.scale then
		local scaleValid, scale = validateScale(blip.scale)
		if not scaleValid then
			return false, scale
		end
		blip.scale = scale
	end

	-- Sanitize string fields
	if blip.name then
		blip.name = sanitizeString(blip.name)
	end

	return true, blip
end

return {
	validateName = validateName,
	validateCoords = validateCoords,
	validateSprite = validateSprite,
	validateColor = validateColor,
	validateAlpha = validateAlpha,
	validateScale = validateScale,
	sanitizeString = sanitizeString,
	validateRGBArray = validateRGBArray,
	validateBlip = validateBlip,
	MAP_BOUNDS = MAP_BOUNDS,
	MAX_NAME_LENGTH = MAX_NAME_LENGTH,
}
