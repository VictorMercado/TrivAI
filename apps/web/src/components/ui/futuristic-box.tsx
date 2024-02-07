"use client";
import { useState, useLayoutEffect, useRef, } from "react";
import { motion } from "framer-motion";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@ui/hover-card";
import { cn } from "@src/utils";

type FuturisticBoxProps = {
  titleLabel: string;
  rightSubLabel: string;
  detailLabel: string;
  className?: string;

};

const FuturisticBox = ({
  titleLabel,
  rightSubLabel,
  detailLabel,
  className,

}: FuturisticBoxProps) => {
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (!divRef.current) {
        return;
      }
      setHeight(divRef.current.offsetHeight);
      setWidth(divRef.current.offsetWidth);
    };
    // 50ms delay to allow for the dom to update, this is a hacky solution cause Im bad
    setTimeout(() => {
      updateDimensions();
    }, 75);
    window.addEventListener("resize", updateDimensions);
    if (!divRef.current) {
      return;
    }
    if (height === undefined && width === undefined) {
      updateDimensions();
    }
    updateDimensions();
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [height, width]);

  return (
    <div
      ref={divRef}
      className={cn(
        "@container group pointer-events-none absolute z-0 flex h-full w-full",
        className,
      )}
    >
      {divRef.current && width !== undefined && height !== undefined && (
        // width: 572 height: 310 is the original size of the svg which came from figma then ratios were used to scale it
        <motion.svg
          width={width}
          height={height}
          fill="none"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0 z-0"
        >
          {/* bottom left triangle that is for small detail */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
            d={`M${(98.5 / 572) * width} ${height - 0.4}
                L${0 * width + 1} ${(244 / 310) * height}
                V${height - 1}
                L${(98.5 / 572) * width} ${height - 1}Z`}
            className="stroke-primary stroke-2 group-hover:fill-primary group-hover:stroke-primary"
          />
          {/* main rectangle  */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            className="z-10 stroke-primary stroke-2"
            // d="M571 127.5V308.5L131 309L1 222V33M571 127.5V25L542 1H409M571 127.5L542.5 97.5317V45.5L526.5 31.5H448.5L409 1M1 33V1H332M1 33H262L332 1M332 1H409"
            d={`M${width - 1} ${(127.5 / 310) * height}
                V${height - 1}
                H${(131 / 572) * width}
                L${1} ${(222 / 310) * height}
                V${0.5} 
                H${(409 / 572) * width}`}
          />
          {/* polygon that is top right */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            d={`M${width - 1} ${(127.5 / 310) * height}
                V${(25 / 310) * height} 
                L${(538 / 572) * width} ${0.5}
                H${(400 / 572) * width}
                L${(442 / 572) * width} ${(31.5 / 310) * height}
                H${(512.5 / 572) * width}
                L${(532.5 / 572) * width} ${(45.5 / 310) * height}
                V${(97.5317 / 310) * height}
                L${(571 / 572) * width - 1} ${(127.5 / 310) * height}Z
                `}
            className="stroke-primary stroke-2 group-hover:fill-primary group-hover:stroke-primary"
          />
          {/* top left polygon for label */}
          <path
            className="z-10 fill-primary stroke-primary"
            d={`M${1} ${0}
              V${(30 / 310) * height}
              H${(262 / 572) * width}
              L${(335 / 572) * width} ${0}Z`}
          />
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={`${((572 - 562) / 572) * width}`}
            y={`${(23 / 310) * height}`}
            className="fill-black text-2xl"
          >
            {titleLabel}
          </motion.text>
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={`${((572 - 35) / 572) * width}`}
            y={`${(34 / 310) * height}`}
            className="@md:text-xl animate-pulse fill-primary text-sm group-hover:fill-black dark:fill-yellow-400"
          >
            {rightSubLabel}
          </motion.text>
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={`${((572 - 557) / 572) * width}`}
            // x={`${(560 / 572) * width}`}
            y={`${((310 - 10) / 310) * height}`}
            className="@md:text-xl animate-pulse fill-primary text-sm group-hover:fill-black"
          >
            {detailLabel}
          </motion.text>
        </motion.svg>
      )}
    </div>
  );
};


export { FuturisticBox };

{/* <svg
  width="572"
  height="310"
  viewBox="0 0 572 310"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M331 1.99994H263L263 32.9999L331 1.99994Z"
    fill="#0094FF"
    stroke="#0094FF"
  />
  <rect x="1" y="1" width="262" height="32" fill="#0094FF" />
  <path d="M98.5 309L1 244V308L98.5 309Z" stroke="#0094FF" />
  <path
    d="M571 127.5V308.5L131 309L1 222V33M571 127.5V25L542 1H409M571 127.5L542.5 97.5317V45.5L526.5 31.5H448.5L409 1M1 33V1H332M1 33H262L332 1M332 1H409"
    stroke="#0094FF"
  />
</svg>; */}
