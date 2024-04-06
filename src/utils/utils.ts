// Returns a corresponding color in hex after being shaded by shading factor
export const applyShading = (
  hexColor: string | undefined,
  shadingFactor: number = 0.75
): string | undefined => {
  if (!hexColor || !/^#[0-9A-F]{6}$/i.test(hexColor)) {
    throw new Error(
      "Invalid hex color format of `hexColor` input " +
        hexColor +
        '. Provide a valid color in the format "#RRGGBB".'
    );
  }

  // Convert hexadecimal color to RGB
  const red = parseInt(hexColor.substring(1, 3), 16);
  const green = parseInt(hexColor.substring(3, 5), 16);
  const blue = parseInt(hexColor.substring(5, 7), 16);

  // Apply shading formula to each RGB component
  const shadedRed = Math.round(red * shadingFactor);
  const shadedGreen = Math.round(green * shadingFactor);
  const shadedBlue = Math.round(blue * shadingFactor);

  // Convert shaded RGB back to hexadecimal
  const shadedHexColor = `#${shadedRed
    .toString(16)
    .padStart(2, "0")}${shadedGreen.toString(16).padStart(2, "0")}${shadedBlue
    .toString(16)
    .padStart(2, "0")}`;

  return shadedHexColor;
};

// Determines whether a color has a high luminance based on threshold
export const hasHighLuminance = (
  hexColor: string | undefined,
  threshold: number = 0.8
): boolean => {
  if (!hexColor || !/^#[0-9A-F]{6}$/i.test(hexColor)) {
    throw new Error(
      "Invalid hex color format of `hexColor` input " +
        hexColor +
        '. Provide a valid color in the format "#RRGGBB".'
    );
  }

  // Convert hexadecimal color to RGB
  const red = parseInt(hexColor.substring(1, 3), 16) / 255;
  const green = parseInt(hexColor.substring(3, 5), 16) / 255;
  const blue = parseInt(hexColor.substring(5, 7), 16) / 255;

  // Calculate luminance using the formula
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  // Check if the calculated luminance is considered high based on the threshold
  return luminance >= threshold;
};
