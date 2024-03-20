import { CountdownContext } from '../providers/CountdownProvider';
import { useContext, useEffect, useState } from 'react';

export function useCountdownSeconds(seconds: number, reset: boolean) {
  const [countdown, setCountdown] = useState(seconds);
  const [counting, setCounting] = useState(false);
  const [hasCountdownEnded, setHasCountdownEnded] = useState(false); // Add a hasCountdownEnded state
  const { incrementCountdownEnds } = useContext(CountdownContext);

  useEffect(() => {
    setCountdown(seconds);
    setCounting(true);
    const intervalId = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          clearInterval(intervalId);
          setCounting(false);
          setHasCountdownEnded(true); // Set hasCountdownEnded to true when countdown reaches 0
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [reset, seconds]);

  useEffect(() => {
    if (hasCountdownEnded) {
      incrementCountdownEnds(); // Only call incrementCountdownEnds when hasCountdownEnded is true
      setHasCountdownEnded(false); // Reset hasCountdownEnded after incrementing CountdownEnds
    }
  }, [hasCountdownEnded, incrementCountdownEnds]);

  const startCountdown = () => {
    setCounting(true);
    setCountdown(seconds);
  };

  return { counting, countdown, startCountdown };
}