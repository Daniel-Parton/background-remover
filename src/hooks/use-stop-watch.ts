import { useEffect, useState } from "react";
import { useEvent } from "./use-event";
import { useFlag } from "./use-flag";

export const useStopWatch = () => {
  // state to store time
  const [time, setTime] = useState(0);

  // state to check stopwatch running or not
  const [isRunning, isRunningFns] = useFlag(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Hours calculation
  const hours = Math.floor(time / 360000);

  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);

  // Milliseconds calculation
  const milliseconds = time % 100;

  const reset = useEvent(() => {
    isRunningFns.setFalse();
    setTime(0);
  });
  return [
    { hours, minutes, seconds, milliseconds },
    {
      reset,
      start: isRunningFns.setTrue,
      stop: isRunningFns.setFalse,
      toggleStartStop: isRunningFns.toggle,
    },
  ] as const;
};
