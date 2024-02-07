export const rgbToHex = (color: string) => {
  let r = parseInt(color.split(" ")[0]);
  let g = parseInt(color.split(" ")[1]);
  let b = parseInt(color.split(" ")[2]);
  // Ensure that the RGB values are within the valid range (0-255)
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // Convert each decimal component to a hexadecimal value and pad with zeros if needed
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  // Combine the hexadecimal components to form the final hex color
  const hexColor = `#${hexR}${hexG}${hexB}`;

  return hexColor;
}