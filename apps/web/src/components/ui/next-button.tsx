"use client";
import React from "react";
import { useEffect, useLayoutEffect } from "react";

interface NextButtonProps {
    nextAction: () => void;
}
const NextButton = ({nextAction}: NextButtonProps) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if(ref?.current) {
      ref.current?.focus();
    }
  });
  return (
    <button
      className="coolBorder py-2 px-2 focus:shadow-[0px_0px_15px_.5px_#0ff] hover:shadow-[0px_0px_15px_.5px_#0ff]"
      onClick={nextAction}
      ref={ref}
    >
      <b className="coolText"> NEXT &#9002;&#9002;</b>
    </button>
  );
};

export { NextButton };