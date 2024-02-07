export const hexToRgb = (hex: string) => {
  // Remove the '#' character if present
  hex = hex.replace("#", "");

  // Parse the hexadecimal values for red, green, and blue
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Construct the RGBA string
  return `${r} ${g} ${b}`;
}