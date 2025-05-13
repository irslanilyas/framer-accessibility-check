interface RGBA {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * Converts hex color string to RGBA object
 * @param hex Hex color string (e.g., "#FF0000")
 * @returns RGBA object
 */
export function hexToRGBA(hex: string): RGBA {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  let r, g, b;
  if (hex.length === 3) {
    // Short notation (e.g., #F00)
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;
  } else {
    // Full notation (e.g., #FF0000)
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  }
  
  return { r, g, b, a: 1 };
}

/**
 * Gets RGBA object from various color formats
 * @param color Color in any supported format
 * @returns RGBA object
 */
export function getColorFromRGBA(color: string | RGBA): RGBA {
  if (typeof color === 'object') {
    return color;
  }
  
  if (color.startsWith('#')) {
    return hexToRGBA(color);
  }
  
  // Default to black if color format is not recognized
  return { r: 0, g: 0, b: 0, a: 1 };
}

/**
 * Calculates relative luminance of a color
 * @param color RGBA color object
 * @returns Relative luminance (0-1)
 */
export function calculateLuminance(color: RGBA): number {
  // Convert RGB to linear values
  const linearR = color.r <= 0.03928 ? color.r / 12.92 : Math.pow((color.r + 0.055) / 1.055, 2.4);
  const linearG = color.g <= 0.03928 ? color.g / 12.92 : Math.pow((color.g + 0.055) / 1.055, 2.4);
  const linearB = color.b <= 0.03928 ? color.b / 12.92 : Math.pow((color.b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
}

/**
 * Calculates contrast ratio between two colors
 * @param color1 First color (RGBA object or hex string)
 * @param color2 Second color (RGBA object or hex string)
 * @returns Contrast ratio (1-21)
 */
export function calculateContrastRatio(color1: RGBA | string, color2: RGBA | string): number {
  const rgba1 = getColorFromRGBA(color1);
  const rgba2 = getColorFromRGBA(color2);
  
  const luminance1 = calculateLuminance(rgba1);
  const luminance2 = calculateLuminance(rgba2);
  
  // Ensure lighter color is always divided by darker color
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Simulates protanopia (red-blind) color vision
 * @param color Color to transform (hex string)
 * @returns Simulated color (hex string)
 */
export function simulateProtanopia(color: string): string {
  const rgb = hexToRGBA(color);
  
  // Protanopia simulation matrix transformation
  const r = 0.567 * rgb.r + 0.433 * rgb.g + 0 * rgb.b;
  const g = 0.558 * rgb.r + 0.442 * rgb.g + 0 * rgb.b;
  const b = 0 * rgb.r + 0.242 * rgb.g + 0.758 * rgb.b;
  
  return rgbToHex({ r, g, b });
}

/**
 * Simulates deuteranopia (green-blind) color vision
 * @param color Color to transform (hex string)
 * @returns Simulated color (hex string)
 */
export function simulateDeuteranopia(color: string): string {
  const rgb = hexToRGBA(color);
  
  // Deuteranopia simulation matrix transformation
  const r = 0.625 * rgb.r + 0.375 * rgb.g + 0 * rgb.b;
  const g = 0.7 * rgb.r + 0.3 * rgb.g + 0 * rgb.b;
  const b = 0 * rgb.r + 0.3 * rgb.g + 0.7 * rgb.b;
  
  return rgbToHex({ r, g, b });
}

/**
 * Simulates tritanopia (blue-blind) color vision
 * @param color Color to transform (hex string)
 * @returns Simulated color (hex string)
 */
export function simulateTritanopia(color: string): string {
  const rgb = hexToRGBA(color);
  
  // Tritanopia simulation matrix transformation
  const r = 0.95 * rgb.r + 0.05 * rgb.g + 0 * rgb.b;
  const g = 0 * rgb.r + 0.433 * rgb.g + 0.567 * rgb.b;
  const b = 0 * rgb.r + 0.475 * rgb.g + 0.525 * rgb.b;
  
  return rgbToHex({ r, g, b });
}

/**
 * Calculates color difference (Euclidean distance in RGB space)
 * @param color1 First color (hex string)
 * @param color2 Second color (hex string)
 * @returns Difference score (0-255)
 */
export function calculateColorDifference(color1: string, color2: string): number {
  const rgb1 = hexToRGBA(color1);
  const rgb2 = hexToRGBA(color2);
  
  // Convert 0-1 range to 0-255 range
  const r1 = rgb1.r * 255;
  const g1 = rgb1.g * 255;
  const b1 = rgb1.b * 255;
  
  const r2 = rgb2.r * 255;
  const g2 = rgb2.g * 255;
  const b2 = rgb2.b * 255;
  
  // Calculate Euclidean distance
  return Math.sqrt(
    Math.pow(r2 - r1, 2) +
    Math.pow(g2 - g1, 2) +
    Math.pow(b2 - b1, 2)
  );
}

/**
 * Converts RGBA object to hex color string
 * @param rgba RGBA object
 * @returns Hex color string
 */
function rgbToHex(rgba: RGBA): string {
  // Convert 0-1 range to 0-255 range
  const r = Math.round(rgba.r * 255);
  const g = Math.round(rgba.g * 255);
  const b = Math.round(rgba.b * 255);
  
  // Convert to hex
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}