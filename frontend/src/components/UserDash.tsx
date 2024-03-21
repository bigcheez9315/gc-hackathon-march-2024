import { useEffect, useRef, useState } from 'react';
import { useCountdownSeconds } from '../hooks/use-countdown';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

export default function UserDash() {
const initialCountdownValue = 3;
  const [reset, setReset] = useState(false); // Add a reset state
  const { counting, countdown } = useCountdownSeconds(initialCountdownValue, reset);

  useEffect(() => {
    if (countdown === 0) {
      setReset(reset =>!reset); // Toggle the reset state to trigger a countdown reset
    }
  }, [countdown]);

  return (
    <div style={{ minHeight: "350px"}}>
      <h2>Exchange NFTs for premium in-game currency</h2> 
    </div>
  )
}