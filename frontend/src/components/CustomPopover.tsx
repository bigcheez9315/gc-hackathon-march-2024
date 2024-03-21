import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import ComponentBlock from './ComponentBlock';
import usePopover from '../hooks/use-popover';
import { Balances } from '../providers/CountdownProvider';
import { Button, Paper } from '@mui/material';

export default function PopoverView({balanceKey, balances, handleCraftItem}: {balanceKey: string, balances: Balances, handleCraftItem: (item:string)=>void}) {

  const hoverPopover = usePopover();
  const clickPopover = usePopover();

const handleCraftItemClick = (item:string, popup:any) => {
    handleCraftItem(item);
    popup.onClose();
}

  return (
    <>
    <Paper>
          <ComponentBlock title={balanceKey}>
            <Typography
              aria-owns={hoverPopover.open ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={hoverPopover.onOpen}
              onMouseLeave={hoverPopover.onClose}
            >
              {balanceKey}
            </Typography>
            <Popover
              id="mouse-over-popover"
              open={Boolean(hoverPopover.open)}
              anchorEl={hoverPopover.open}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={hoverPopover.onClose}
              disableRestoreFocus
              sx={{
                pointerEvents: 'none',
              }}
            >
              <Box sx={{ p: 2, maxWidth: 280 }}>
                <Typography variant="subtitle1" gutterBottom>
                {balanceKey}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Number of available {balanceKey}s: {balances[balanceKey]}
                </Typography>
              </Box>
            </Popover>
          </ComponentBlock>
          </Paper>
            <Paper>
          <ComponentBlock title="Click">
            <Button variant="contained" onClick={clickPopover.onOpen}>
              Melt {balanceKey}
            </Button>
            <Popover
              open={Boolean(clickPopover.open)}
              anchorEl={clickPopover.open}
              onClose={clickPopover.onClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Box sx={{ p: 2, maxWidth: 280 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Melt down { balanceKey} to receive 10 Dragon Tears and 20 Dragon Stones
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Melt this item to recieve premium currency in the game.
                </Typography>
                <br/>
                <Button variant="contained" onClick={()=>handleCraftItemClick(balanceKey, clickPopover)} style={{textTransform:'none'}}>
                    sMelt it!
                </Button>
                
              </Box>
            </Popover>
          </ComponentBlock>
          </Paper>
    
    </>
  );
}
