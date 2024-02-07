"use client";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "@src/hooks/useLocalStorage";
import { rgbToHex, hexToRgb } from "@trivai/lib/color";


const ColorPicker = ({ label, colorTheme }: { colorTheme: string, label: string }) => {
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
        className="h-full cursor-pointer bg-background"
        type="color"
        value={rgbToHex(userPrimaryColor)}
        onChange={(e) => handleChangeColor(e.target.value)}
      />
      <p className="pointer-events-none absolute inset-x-0 -bottom-6 text-sm">
        {label}
      </p>
    </div>
  );
};

export { ColorPicker };
