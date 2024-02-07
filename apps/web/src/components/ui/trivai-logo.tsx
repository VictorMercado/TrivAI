"use client";
import { motion } from "framer-motion";

const TrivaiLogo = () => {
  return (
    <svg
      viewBox="0 0 160 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-32"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
        d="M14.5043 38V8.048H6.87225V4.4H26.3123V8.048H18.6803V38H14.5043ZM37.8821 34.4V17.6H34.3781V14H41.7221V15.296C42.7781 14.432 44.0581 14 45.5621 14H50.5061V17.84H45.0821C44.0581 17.84 43.2901 18.176 42.7781 18.848C42.2661 19.488 41.9941 20.144 41.9621 20.816V34.4H47.1941V38H34.3781V34.4H37.8821ZM70.716 4.4V8.72H66.156V4.4H70.716ZM59.34 17.6V14H70.476V34.4H77.58V38H66.396V17.6H59.34ZM84.4939 14H88.9099L94.5259 34.688L99.9979 14H104.27L97.3579 38H91.4539L84.4939 14Z"
        className="fill-[rgb(var(--color-text-base))]"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
        d="M115.382 29.504L113.51 38H109.238L117.35 4.4H122.87L130.838 38H126.566L124.742 29.504H115.382ZM123.974 25.904L120.038 7.568L116.15 25.904H123.974ZM143.848 34.496V7.904H139.528V4.4H152.344V7.904H148.024V34.496H152.344V38H139.528V34.496H143.848Z"
        fill="url(#paint0_linear_62_10)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_62_10"
          x1="127.971"
          y1="17.5882"
          x2="134.212"
          y2="34.2681"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B349CD" />
          <stop offset="0.364583" stopColor="#46DEFF" />
          <stop offset="0.682292" stopColor="#84FF86" />
          <stop offset="1" stopColor="#FFAD32" stopOpacity="0.71" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export { TrivaiLogo };