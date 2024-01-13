"use client";
import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type BoxProps = {
  itemsCount: number;
};

const Box = ({ itemsCount }: BoxProps) => {
  const [elements, setElements] = useState<JSX.Element[]>(
    new Array(itemsCount).fill(<div></div>).map((_)=> {
      return (
        <div
          className="h-24 w-24 bg-green-500"
          key={Math.random()}
        >
          element
        </div>
      );
    }),
  );
  const [height, setHeight] = useState<number>();
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!divRef.current) {
      return;
    }
    if (elements.length >= 0) {
      setHeight(divRef.current.offsetHeight);
      console.log(divRef.current.offsetHeight);
    }
  }, [elements]);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: height, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      // exit={{ height: 0 }}
      className="border-y border-blue-500 bg-blue-500/20"
    >
      <div ref={divRef} className="box p-24">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="grid grid-cols-4 gap-2"
        >
          {elements}
        </motion.div>
        {/* <h1>{elements}</h1>

        <button
          className="bg-red-500"
          onClick={() =>
            setElements([
              ...elements,
              <div className="h-24 w-24 bg-green-500" key={Math.random()}>
                element
              </div>,
            ])
          }
        >
          Add Element
        </button>
        <button
          className="bg-red-500"
          onClick={() => setElements([...elements.filter((_, i) => i !== 0)])}
        >
          Delete Element
        </button>
        <button
          className="bg-red-500"
          onClick={() => setElements([])}
        >
          Delete All
        </button> */}
      </div>
    </motion.div>
  );
};


export { Box };