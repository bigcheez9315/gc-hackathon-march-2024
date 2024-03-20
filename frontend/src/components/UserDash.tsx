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
      <h2>Welcome Executor</h2>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', gap: '10px'}}>
       
        <div style={{ display: "flex",flex:1, alignItems: 'center'}}>
            <div>
                {counting ? `Time till next mineral shipment: ${countdown}` : 'Countdown finished'}
            </div>
        </div>
        <div style={{ display: "flex", flex:1, alignItems: 'center'}}>
            <div>
                {`Time till next fragment shipment: `}
                <Tooltip title="Upgrade your rank to unlock fragment shipments">
                <Button >
                Level UP (500 Minerals)
                </Button>
                </Tooltip>
            </div>
        </div>
      
      </div>
      
    </div>
  )
}