"use client";
import { cn } from "@src/utils";
import { motion } from "framer-motion";

export const SVGAdd = ({ size }: { size: number }) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 18H86V86H18V18Z" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 18C16 16.8954 16.8954 16 18 16H86C87.1046 16 88 16.8954 88 18V86C88 87.1046 87.1046 88 86 88H18C16.8954 88 16 87.1046 16 86V18ZM20 20V84H84V20H20Z"
        fill="black"
      />
      <path d="M10 10H78V78H10V10Z" fill="#3b82f6" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10C8 8.89543 8.89543 8 10 8H78C79.1046 8 80 8.89543 80 10V78C80 79.1046 79.1046 80 78 80H10C8.89543 80 8 79.1046 8 78V10ZM12 12V76H76V12H12Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40 24L40 64L48 64L48 24L40 24Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 48H64V40H24V48Z"
        fill="black"
      />
    </svg>
  );
};

export const SVGCancel = ({ size }: { size: number }) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 18H86V86H18V18Z" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 18C16 16.8954 16.8954 16 18 16H86C87.1046 16 88 16.8954 88 18V86C88 87.1046 87.1046 88 86 88H18C16.8954 88 16 87.1046 16 86V18ZM20 20V84H84V20H20Z"
        fill="black"
      />
      <path d="M10 10H78V78H10V10Z" fill="#FF5E5E" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10C8 8.89543 8.89543 8 10 8H78C79.1046 8 80 8.89543 80 10V78C80 79.1046 79.1046 80 78 80H10C8.89543 80 8 79.1046 8 78V10ZM12 12V76H76V12H12Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.8578 63.7989L63.799 29.8578L58.1421 24.2009L24.201 58.1421L29.8578 63.7989Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M63.7991 58.1419L29.858 24.2008L24.2011 29.8577L58.1423 63.7988L63.7991 58.1419Z"
        fill="black"
      />
    </svg>
  );
};

export const SVGDelete = ({ size }: { size: number }) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 18H86V86H18V18Z" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 18C16 16.8954 16.8954 16 18 16H86C87.1046 16 88 16.8954 88 18V86C88 87.1046 87.1046 88 86 88H18C16.8954 88 16 87.1046 16 86V18ZM20 20V84H84V20H20Z"
        fill="black"
      />
      <path d="M10 10H78V78H10V10Z" fill="#FF5E5E" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10C8 8.89543 8.89543 8 10 8H78C79.1046 8 80 8.89543 80 10V78C80 79.1046 79.1046 80 78 80H10C8.89543 80 8 79.1046 8 78V10ZM12 12V76H76V12H12Z"
        fill="black"
      />
      <path d="M64 58V30H36L24 44L36 58H64Z" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.1603 26H68V62H34.1603L18.7317 44L34.1603 26ZM37.8397 34L29.2683 44L37.8397 54H60V34H37.8397Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38.1005 51.0709L55.071 34.1003L57.8995 36.9288L40.9289 53.8993L38.1005 51.0709Z"
        fill="#FF5E5E"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M55.0711 53.8995L38.1006 36.929L40.929 34.1005L57.8996 51.0711L55.0711 53.8995Z"
        fill="#FF5E5E"
      />
    </svg>
  );
};

export const SVGError = ({ size }: { size: number }) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 18H86V86H18V18Z" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 18C16 16.8954 16.8954 16 18 16H86C87.1046 16 88 16.8954 88 18V86C88 87.1046 87.1046 88 86 88H18C16.8954 88 16 87.1046 16 86V18ZM20 20V84H84V20H20Z"
        fill="black"
      />
      <path d="M10 10H78V78H10V10Z" fill="#FF5E5E" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10C8 8.89543 8.89543 8 10 8H78C79.1046 8 80 8.89543 80 10V78C80 79.1046 79.1046 80 78 80H10C8.89543 80 8 79.1046 8 78V10ZM12 12V76H76V12H12Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.8578 63.7989L63.799 29.8578L58.1421 24.2009L24.201 58.1421L29.8578 63.7989Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M63.7991 58.1419L29.858 24.2008L24.2011 29.8577L58.1423 63.7988L63.7991 58.1419Z"
        fill="black"
      />
    </svg>
  );
};

export const SVGGoodCheck = ({ size }: { size: number }) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 18H86V86H18V18Z" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 18C16 16.8954 16.8954 16 18 16H86C87.1046 16 88 16.8954 88 18V86C88 87.1046 87.1046 88 86 88H18C16.8954 88 16 87.1046 16 86V18ZM20 20V84H84V20H20Z"
        fill="black"
      />
      <path d="M10 10H78V78H10V10Z" fill="#00FF75" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10C8 8.89543 8.89543 8 10 8H78C79.1046 8 80 8.89543 80 10V78C80 79.1046 79.1046 80 78 80H10C8.89543 80 8 79.1046 8 78V10ZM12 12V76H76V12H12Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42 50.343L63.1716 29.1715L68.8284 34.8283L42 61.6567L23.1716 42.8283L28.8284 37.1715L42 50.343Z"
        fill="black"
      />
    </svg>
  );
};

export const SVGSave2 = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 1222 1171"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("stroke-primary", className)}
    >
      <g clipPath="url(#clip0_604_74)">
        <path
          d="M866 883H259C224.758 883 197 855.242 197 821V226C197 191.758 224.758 164 259 164H740.823C757.741 164 773.925 170.914 785.621 183.139L850.252 250.691L912.429 320.949C922.462 332.285 928 346.9 928 362.038V523.5V821C928 855.242 900.242 883 866 883Z"
          strokeWidth="36"
        />
        <path
          d="M418 160H678C703.405 160 724 180.595 724 206V296.5V387C724 412.405 703.405 433 678 433H418C392.595 433 372 412.405 372 387V296.5V206C372 180.595 392.595 160 418 160Z"
          strokeWidth="28"
        />
        <path
          d="M370 579H563H756C780.385 579 801 599.583 801 626.037V836.963C801 863.417 780.385 884 756 884H563H370C345.615 884 325 863.417 325 836.963V626.037C325 599.583 345.615 579 370 579Z"
          strokeWidth="30"
        />
        <path
          d="M603.516 295.784L602.931 223.999C602.796 207.431 589.255 194.109 572.687 194.245L521.999 194.658C505.431 194.793 492.11 208.333 492.245 224.901L492.83 296.687L493.415 368.472C493.55 385.04 507.091 398.362 523.659 398.227L574.347 397.813C590.915 397.678 604.236 384.138 604.101 367.57L603.516 295.784Z"
          strokeWidth="50"
        />
      </g>
    </svg>
  );
};
export const SVGSettings = ({ size }: { size: number }) => {
  <svg
    width={String(size)}
    height={String(size)}
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="18"
      y="18"
      width="68"
      height="68"
      fill="black"
      stroke="black"
      strokeWidth="4"
      stroke-linejoin="round"
    />
    <rect
      x="10"
      y="10"
      width="68"
      height="68"
      fill="#FFB443"
      stroke="black"
      strokeWidth="4"
      stroke-linejoin="round"
    />
    <path d="M33 64L33 24" stroke="black" strokeWidth="6" />
    <path d="M55 64L55 24" stroke="black" strokeWidth="6" />
    <rect x="48" y="24" width="14" height="14" fill="black" />
    <rect x="26" y="42" width="14" height="14" fill="black" />
  </svg>;
};

export const SVGPercentage = ({
  size,
  percentage,
}: {
  size: number;
  percentage: number;
}) => {
  let percentColor;
  const COLORS = {
    0: "#64748b",
    25: "#ef4444",
    50: "#f59e0b",
    70: "#a5cb00",
    80: "#72c527",
    90: "#5db838",
    100: "#22c55e",
  };
  if (percentage == 0) {
    percentColor = COLORS[0];
  } else if (percentage <= 50) {
    percentColor = COLORS[25];
  } else if (percentage < 70) {
    percentColor = COLORS[50];
  } else if (percentage < 80) {
    percentColor = COLORS[70];
  } else if (percentage < 90) {
    percentColor = COLORS[80];
  } else if (percentage < 100) {
    percentColor = COLORS[90];
  } else {
    percentColor = COLORS[100];
  }
  return (
    <motion.svg
      width={String(size)}
      height={String(size)}
      viewBox={`0 0 ${size - 14} ${size - 14}`}
      className="block"
      animate="visible"
    >
      <circle
        cx="18"
        cy="18"
        r="15.91549430918954"
        strokeWidth="3"
        className="group-hover:fill-black"
      />
      <circle
        cx="18"
        cy="18"
        r="15.91549430918954"
        stroke="black"
        strokeWidth="3"
        fill={percentColor + "55"}
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: percentage / 100 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
        fill={"none"}
        stroke={percentColor}
        strokeWidth={3.0}
        strokeLinecap="round"
        strokeDasharray="0 1"
        // strokeDasharray={`${percentage}, 100`}
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        // variants={draw}
      />
      <text
        x="18"
        y="23.35"
        fill={percentColor}
        textAnchor="middle"
        className="text-sm"
      >
        {percentage}
      </text>
    </motion.svg>
  );
};

export const SVGBurger = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 12 12"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <rect
          fill="rgb(var(--color-primary))"
          height="1"
          width="11"
          x="0.5"
          y="5.5"
        />
        <rect
          fill="rgb(var(--color-primary))"
          height="1"
          width="11"
          x="0.5"
          y="2.5"
        />
        <rect
          fill="rgb(var(--color-primary))"
          height="1"
          width="11"
          x="0.5"
          y="8.5"
        />
      </g>
    </svg>
  );
};

export const SVGClose = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 12 12"
      className={className}
    >
      <polygon
        fill="rgb(var(--color-primary))"
        points="12,0.7070313 11.2929688,0 6,5.2929688 0.7070313,0 0,0.7070313 5.2929688,6 0,11.2929688   0.7070313,12 6,6.7070313 11.2929688,12 12,11.2929688 6.7070313,6 "
      />
    </svg>
  );
};

export const SVGFilter = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 12 12"
      className={className}
    >
      <path
        fill="rgb(var(--color-primary))"
        d="M12,0.7070313 11.2929688,0 6,5.2929688 0.7070313,0 0,0.7070313 5.2929688,6 0,11.2929688   0.7070313,12 6,6.7070313 11.2929688,12 12,11.2929688 6.7070313,6 "
      />
    </svg>
  );
};

export const SquareUserRound = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={String(size)}
      height={String(size)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 21a6 6 0 0 0-12 0" />
      <circle cx="12" cy="11" r="4" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
};

export const SVGCoin = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => {
  return (
    <svg
      width={String(size)}
      height={String(size)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 6.61803L12 1.11803L23 6.61803V17.382L12 22.882L1 17.382V6.61803Z"
        strokeWidth="2"
        className="stroke-current"
      />
      <rect x="10" y="7" width="6" height="3" className="fill-current" />
      <rect x="10" y="14" width="6" height="3" className="fill-current" />
      <rect x="8" y="7" width="3" height="10" className="fill-current" />
    </svg>
  );
};
