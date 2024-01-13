"use client";
import React, { useEffect, useState } from "react";

const ClientDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-black border border-primary p-2 fixed top-1/2 left-1/2">
      {dimensions.width} x {dimensions.height}
    </div>
  );
}

export { ClientDimensions };