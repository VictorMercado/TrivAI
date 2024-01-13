import { useRef, useState, useCallback, useMemo, useEffect } from "react";

export const Clock = ({text}: {text: string}) => {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<string>("00");
  let timeRef = useRef();
  let buttonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    timeRef.current = setInterval(() => {
      setSeconds((seconds) => {
        // debugger;
        if (parseInt(seconds) === 59) {
          setMinutes((minutes) => minutes + 1);
          return "00";
        }
        let secondsInt = parseInt(seconds);
        return secondsInt < 9 ? "0" + String((secondsInt + 1)) : String((secondsInt + 1));
      });
    }, 1000) as any;
  }, []);
  const stopTimer = () => {
    buttonRef.current ? (buttonRef.current.className = "bg-green-500") : null;
    buttonRef.current
      ? (buttonRef.current.innerText = "Start")
      : null;
    clearInterval(timeRef.current);
  }
  // startTimer();
  return (
    <div className="flex gap-4">
      <p>
        timer: {minutes}:{seconds} {text}
      </p>
      <button
        className="bg-red-500 px-4 py-2 text-black"
        ref={buttonRef}
        onClick={stopTimer}
      >
        Stop
      </button>
    </div>
  );
}