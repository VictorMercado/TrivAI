import { Color } from "three";

type ColorValueHex = `#${string}`;

type FalloutLabelProps = {
  text: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

const FalloutLabel = ({
  text,
  backgroundColor,
  borderColor,
  textColor,
}: FalloutLabelProps) => {
    const SIZE = 500;
  return (
    <svg
      className=""
      width={String(SIZE)}
      height="100"
      viewBox="0 0 514 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="12"
        y="10"
        width="500"
        height="80"
        fill={backgroundColor}
        stroke={borderColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect
        x="4"
        y="2"
        width="500"
        height="80"
        fill={backgroundColor}
        stroke={borderColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text
        x="265"
        y="60"
        fill={textColor}
        textAnchor="middle"
        className="text-6xl tracking-[.5em]"
      >
        {text}
      </text>
    </svg>
  );
};

export { FalloutLabel };
