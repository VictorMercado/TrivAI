import React from "react";

type SelectionProps = {
  name?: string;
  color?: string;
  order: number;
};

const Selection = ({
  name,
  color,
  order
}: SelectionProps) => {
  const pixelsToMoveLeft = order * 30;
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0">
      <div
        className="absolute bottom-[-5px] left-[-5px] right-[-5px] top-[-5px] border-2"
        style={{
          borderColor: color,
        }}
      />
      <div
        className={`absolute h-8 p-2 text-black`}
        style={{ background: color, top: -38, right: pixelsToMoveLeft}}
      >
        {name}
      </div>
    </div>
  );
}

export { Selection };