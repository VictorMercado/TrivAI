"use client";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "@src/hooks/useLocalStorage";

const ColorPicker = ({ label, colorTheme }: { colorTheme: string, label: string }) => {
  function hexToRgb(hex: string) {
    // Remove the '#' character if present
    hex = hex.replace("#", "");

    // Parse the hexadecimal values for red, green, and blue
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Construct the RGBA string
    return `${r} ${g} ${b}`;
  }
  function rgbToHex(color: string) {
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
  const PRIMARY_COLOR = "59 130 246";
  const [userPrimaryColor, setUserPrimaryColor] = useState(PRIMARY_COLOR);
  const [color, setColor] = useLocalStorage(colorTheme, PRIMARY_COLOR);

  useEffect(() => {
    setUserPrimaryColor(color);
    document.documentElement.style.setProperty(colorTheme, color);
  }, [color, colorTheme]);
  
  const handleChangeColor = (newColor: any) => {
    // newColor is a hexadecimal color value
    const rgbColor = hexToRgb(newColor);
    // Update the user's selected primary color
    setColor(rgbColor);
    setUserPrimaryColor(rgbColor);

    // Apply the new color to the entire document 
    document.documentElement.style.setProperty(colorTheme, rgbColor);
  };

  return (
    <div className="relative">
      <input
        className="h-[100%] bg-background border-background border-2 cursor-pointer"
        type="color"
        value={rgbToHex(userPrimaryColor)}
        onChange={(e) => handleChangeColor(e.target.value)}
      />
      <div className="absolute top-12 inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-sm p-2">{label}</p>
      </div>
    </div>
  );
};

export { ColorPicker };
