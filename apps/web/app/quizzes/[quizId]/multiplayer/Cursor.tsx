import React from "react";

type Props = {
  color: string;
  x: number;
  y: number;
};

const Cursor = ({ color, x, y }: Props) => {
  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
      width="21"
      height="26"
      viewBox="0 0 21 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.00223 17.4355L2 22.0549L2 3L17.1521 12.9969L10.975 14.5133"
        stroke="black"
      />
      <path
        d="M7 17.5L1 24L0.999756 1.5L18.9996 13.4999L11 15.5"
        stroke={color}
      />
    </svg>
  );
};

export { Cursor };
