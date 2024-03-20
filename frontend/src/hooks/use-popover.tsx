import {useCallback, useEffect, useState} from 'react';

type ReturnType = {
  onClose: VoidFunction;
  open: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  setOpen: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
};

export default function usePopover(initialAnchorEl?: HTMLElement | null): ReturnType {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const onOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setOpen(null);
  }, []);

  useEffect(()=>{
    if(initialAnchorEl){
      setOpen(initialAnchorEl)
    }
  }, [initialAnchorEl])
  return {
    open,
    onOpen,
    onClose,
    setOpen,
  };
}
