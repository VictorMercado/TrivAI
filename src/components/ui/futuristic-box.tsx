"use client";
import { useState, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@ui/hover-card";

type FuturisticBoxProps = {
  titleLabel: string;
  rightSubLabel: string;
  rightSubLabelDescription: string;
  detailLabel: string;
  detailLabelDescription: string;
  children: React.ReactNode;
};

const FuturisticBox = ({
  titleLabel,
  rightSubLabel,
  rightSubLabelDescription,
  detailLabel,
  detailLabelDescription,
  children,
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
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    if (!divRef.current) {
      return;
    }
    if (height === undefined && width === undefined) {
      updateDimensions();
    }
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [height, width]);

  return (
    <div
      ref={divRef}
      className="group relative z-0 flex h-full max-h-[400px] min-h-[300px] w-full md:min-h-[400px]"
    >
      <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
        <HoverCardTrigger
          className="absolute right-3 top-0 z-20 h-[50px] w-[50px]"
          asChild
        >
          <div className="flex"></div>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="h-full w-full">{rightSubLabelDescription}</div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard defaultOpen={false} openDelay={200} closeDelay={200}>
        <HoverCardTrigger
          className="absolute bottom-0 left-3 z-20 h-[50px] w-[50px]"
          asChild
        >
          <div className="flex"></div>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="h-full w-full">{detailLabelDescription}</div>
        </HoverCardContent>
      </HoverCard>
      <div className="group z-10 h-full w-full">{children}</div>
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
          {/* triangle that is for small detail */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
            d={`M${(98.5 / 572) * width} ${(309 / 310) * height}
                L${(1 / 572) * width} ${(244 / 310) * height}
                V${(308 / 310) * height + 2}
                L${(98.5 / 572) * width} ${(309 / 310) * height}Z`}
            className="stroke-primary group-hover:fill-primary group-hover:stroke-primary"
          />
          {/* main rectangle  */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            className="z-10 stroke-primary"
            // d="M571 127.5V308.5L131 309L1 222V33M571 127.5V25L542 1H409M571 127.5L542.5 97.5317V45.5L526.5 31.5H448.5L409 1M1 33V1H332M1 33H262L332 1M332 1H409"
            d={`M${(571 / 572) * width} ${(127.5 / 310) * height}
                V${(308.5 / 310) * height - 1}
                L${(131 / 572) * width} ${(309 / 310) * height - 1}
                L${0 * width} ${(222 / 310) * height}
                V${(1 / 310) * height} 
                H${(409 / 572) * width}`}
          />
          {/* polygon that is top right */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            d={`M${(571 / 572) * width} ${(127.5 / 310) * height}
                V${(25 / 310) * height} 
                L${(542 / 572) * width} ${(1 / 310) * height}
                H${(409 / 572) * width}
                L${(448.5 / 572) * width} ${(31.5 / 310) * height}
                H${(526.5 / 572) * width}
                L${(542.5 / 572) * width} ${(45.5 / 310) * height}
                V${(97.5317 / 310) * height}
                L${(571 / 572) * width} ${(127.5 / 310) * height}Z
                `}
            className="stroke-primary group-hover:fill-primary group-hover:stroke-primary"
          />
          {/*d={`M${(571 / 572) * width} ${(127.5 / 310) * height}
                V${(25 / 310) * height} 
                L${(542 / 572) * width} ${(1 / 310) * height}
                H${(409 / 572) * width}
                
                M${(571 / 572) * width} ${(127.5 / 310) * height}
                L${(542.5 / 572) * width} ${(97.5317 / 310) * height}
                V${(45.5 / 310) * height}
                L${(526.5 / 572) * width} ${(31.5 / 310) * height} 
                H${(448.5 / 572) * width}
                L${(409 / 572) * width} ${(1 / 310) * height}
                `} */}
          {/* triangle that is right to the rectangle */}
          <path
            className="z-20 fill-primary stroke-primary"
            // d="M331 1.99994 H263 L263 32.9999 L331 1.99994Z"
            d={`M${(335 / 572) * width} ${(1.99994 / 310) * height - 2}
              H${(263 / 572) * width} 
              L${(263 / 572) * width} ${(32.9999 / 310) * height + 2.7}
              L${(331 / 572) * width} ${(1.99994 / 310) * height}Z`}
          />
          {/* rectangle for title label */}
          <rect
            x="1"
            y=".5"
            width={`${(263 / 572) * width}`}
            height={`${(33 / 310) * height + 2}`}
            className="fill-primary stroke-primary"
          />
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={`${((572 - 560) / 572) * width}`}
            y={`${(30 / 310) * height}`}
            fontSize="1.5rem"
            className="fill-black"
          >
            {titleLabel}
          </motion.text>
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={`${((572 - 35) / 572) * width}`}
            y={`${(34 / 310) * height}`}
            fontSize="1.5rem"
            className="fill-yellow-400 group-hover:fill-black"
          >
            {rightSubLabel}
          </motion.text>
          <motion.text
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={`${((572 - 560) / 572) * width}`}
            // x={`${(560 / 572) * width}`}
            y={`${((310 - 12.5) / 310) * height}`}
            fontSize="1.5rem"
            className="fill-primary group-hover:fill-black"
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
