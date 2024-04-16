"use client";
import { SVGCoin } from "./SVG";
import { useStore } from "@src/store";

const CreditsDetail = () => {
  const credits = useStore((state) => state.credits);
  return (
    <div className="flex items-center gap-x-1 text-yellow-600 dark:text-yellow-400">
      <SVGCoin size={24} className="inline-block" />
      <span className="">{credits}</span>
    </div>
  );
}

export { CreditsDetail };