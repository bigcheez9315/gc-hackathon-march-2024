export type User = {
    publicKey: Key | null | undefined;
    alias: string;
    ethAddress: string;
    user: {
      publicKey: string;
      privateKey: string;
    };
    response: {
      data: string;
      status: number;
    };
  };
  

  export type ReturnSecondsType = {
    counting: boolean;
    countdown: number;
    startCountdown: VoidFunction;
    setCountdown: React.Dispatch<React.SetStateAction<number>>;
  };