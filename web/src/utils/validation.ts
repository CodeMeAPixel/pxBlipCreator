/**
 * Validation Utility Functions for pxBlipCreator
 * Validates blip data and related inputs
 */

// Map bounds for GTA V (approximate)
const MAP_BOUNDS = {
  minX: -3000,
  maxX: 3000,
  minY: -3000,
  maxY: 3000,
  minZ: -100,
  maxZ: 1000,
};

// Valid FiveM blip sprites (0-1000+)
const VALID_SPRITE_MIN = 0;
const VALID_SPRITE_MAX = 1000;

// Valid color range
const VALID_COLOR_MIN = 0;
const VALID_COLOR_MAX = 255;

// Valid alpha (transparency) range
const VALID_ALPHA_MIN = 0;
const VALID_ALPHA_MAX = 255;

// Valid scale range (stored as size * 10)
const VALID_SCALE_MIN = 10;
const VALID_SCALE_MAX = 500;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a blip name
 * @param name - Blip name to validate
 * @returns Validation errors (empty if valid)
 */
export const validateBlipName = (name: string | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!name) {
    errors.push({ field: 'name', message: 'Blip name is required' });
    return errors;
  }

  // Trim and check length
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    errors.push({ field: 'name', message: 'Blip name cannot be empty' });
  } else if (trimmedName.length > 50) {
    errors.push({ field: 'name', message: 'Blip name cannot exceed 50 characters' });
  }

  return errors;
};

/**
 * Validates coordinates
 * @param coords - Object with x, y, z properties
 * @returns Validation errors (empty if valid)
 */
export const validateCoords = (
  coords: { x?: number; y?: number; z?: number } | undefined
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!coords) {
    errors.push({ field: 'coords', message: 'Coordinates are required' });
    return errors;
  }

  // Validate X coordinate
  if (coords.x === undefined || coords.x === null) {
    errors.push({ field: 'coordsX', message: 'X coordinate is required' });
  } else if (typeof coords.x !== 'number') {
    errors.push({ field: 'coordsX', message: 'X must be a number' });
  } else if (coords.x < MAP_BOUNDS.minX || coords.x > MAP_BOUNDS.maxX) {
    errors.push({
      field: 'coordsX',
      message: `X coordinate must be between ${MAP_BOUNDS.minX} and ${MAP_BOUNDS.maxX}`,
    });
  }

  // Validate Y coordinate
  if (coords.y === undefined || coords.y === null) {
    errors.push({ field: 'coordsY', message: 'Y coordinate is required' });
  } else if (typeof coords.y !== 'number') {
    errors.push({ field: 'coordsY', message: 'Y must be a number' });
  } else if (coords.y < MAP_BOUNDS.minY || coords.y > MAP_BOUNDS.maxY) {
    errors.push({
      field: 'coordsY',
      message: `Y coordinate must be between ${MAP_BOUNDS.minY} and ${MAP_BOUNDS.maxY}`,
    });
  }

  // Validate Z coordinate
  if (coords.z === undefined || coords.z === null) {
    errors.push({ field: 'coordsZ', message: 'Z coordinate is required' });
  } else if (typeof coords.z !== 'number') {
    errors.push({ field: 'coordsZ', message: 'Z must be a number' });
  } else if (coords.z < MAP_BOUNDS.minZ || coords.z > MAP_BOUNDS.maxZ) {
    errors.push({
      field: 'coordsZ',
      message: `Z coordinate must be between ${MAP_BOUNDS.minZ} and ${MAP_BOUNDS.maxZ}`,
    });
  }

  return errors;
};

/**
 * Validates sprite ID
 * @param sprite - Sprite ID to validate
 * @returns Validation errors (empty if valid)
 */
export const validateSprite = (sprite: number | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (sprite === undefined || sprite === null) {
    errors.push({ field: 'sprite', message: 'Sprite is required' });
    return errors;
  }

  if (typeof sprite !== 'number' || !Number.isInteger(sprite)) {
    errors.push({ field: 'sprite', message: 'Sprite must be an integer' });
  } else if (sprite < VALID_SPRITE_MIN || sprite > VALID_SPRITE_MAX) {
    errors.push({
      field: 'sprite',
      message: `Sprite must be between ${VALID_SPRITE_MIN} and ${VALID_SPRITE_MAX}`,
    });
  }

  return errors;
};

/**
 * Validates color value
 * @param color - Color value to validate
 * @param fieldName - Field name for error message
 * @returns Validation errors (empty if valid)
 */
export const validateColor = (
  color: number | undefined,
  fieldName: string = 'color'
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (color === undefined || color === null) {
    errors.push({ field: fieldName, message: `${fieldName} is required` });
    return errors;
  }

  if (typeof color !== 'number' || !Number.isInteger(color)) {
    errors.push({ field: fieldName, message: `${fieldName} must be an integer` });
  } else if (color < VALID_COLOR_MIN || color > VALID_COLOR_MAX) {
    errors.push({
      field: fieldName,
      message: `${fieldName} must be between ${VALID_COLOR_MIN} and ${VALID_COLOR_MAX}`,
    });
  }

  return errors;
};

/**
 * Validates alpha (transparency)
 * @param alpha - Alpha value to validate
 * @returns Validation errors (empty if valid)
 */
export const validateAlpha = (alpha: number | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (alpha === undefined || alpha === null) {
    errors.push({ field: 'alpha', message: 'Alpha is required' });
    return errors;
  }

  if (typeof alpha !== 'number' || !Number.isInteger(alpha)) {
    errors.push({ field: 'alpha', message: 'Alpha must be an integer' });
  } else if (alpha < VALID_ALPHA_MIN || alpha > VALID_ALPHA_MAX) {
    errors.push({
      field: 'alpha',
      message: `Alpha must be between ${VALID_ALPHA_MIN} and ${VALID_ALPHA_MAX}`,
    });
  }

  return errors;
};

/**
 * Validates scale
 * @param scale - Scale value to validate
 * @returns Validation errors (empty if valid)
 */
export const validateScale = (scale: number | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (scale === undefined || scale === null) {
    errors.push({ field: 'scale', message: 'Scale is required' });
    return errors;
  }

  if (typeof scale !== 'number') {
    errors.push({ field: 'scale', message: 'Scale must be a number' });
  } else if (scale < VALID_SCALE_MIN || scale > VALID_SCALE_MAX) {
    errors.push({
      field: 'scale',
      message: `Scale must be between ${VALID_SCALE_MIN} and ${VALID_SCALE_MAX}`,
    });
  }

  return errors;
};

/**
 * Sanitizes string for safe display and storage
 * Removes potentially dangerous characters but keeps most input
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (str: string | undefined): string => {
  if (!str) return '';

  // Trim whitespace
  let sanitized = str.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Limit length to database field max
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }

  return sanitized;
};

/**
 * Validates a complete blip object
 * @param blip - Blip object to validate
 * @returns ValidationResult with all errors
 */
export const validateBlipData = (blip: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!blip) {
    errors.push({ field: 'blip', message: 'Blip data is required' });
    return { isValid: false, errors };
  }

  // Validate each field
  errors.push(...validateBlipName(blip.name));
  errors.push(...validateCoords(blip.coords));
  errors.push(...validateSprite(blip.Sprite));
  errors.push(...validateColor(blip.sColor, 'sColor'));
  errors.push(...validateAlpha(blip.alpha));
  errors.push(...validateScale(blip.scale));

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates all RGB color values in an array
 * @param colors - Array with [R, G, B] values
 * @returns Validation errors (empty if valid)
 */
export const validateRGBArray = (colors: number[] | undefined): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!colors) {
    errors.push({ field: 'colors', message: 'Colors array is required' });
    return errors;
  }

  if (!Array.isArray(colors) || colors.length !== 3) {
    errors.push({ field: 'colors', message: 'Colors must be an array of [R, G, B]' });
    return errors;
  }

  // Validate each color component
  colors.forEach((color, index) => {
    if (typeof color !== 'number' || !Number.isInteger(color)) {
      errors.push({
        field: `colors[${index}]`,
        message: `Color component at index ${index} must be an integer`,
      });
    } else if (color < VALID_COLOR_MIN || color > VALID_COLOR_MAX) {
      errors.push({
        field: `colors[${index}]`,
        message: `Color component must be between ${VALID_COLOR_MIN} and ${VALID_COLOR_MAX}`,
      });
    }
  });

  return errors;
};

export default {
  validateBlipName,
  validateCoords,
  validateSprite,
  validateColor,
  validateAlpha,
  validateScale,
  sanitizeString,
  validateBlipData,
  validateRGBArray,
};
