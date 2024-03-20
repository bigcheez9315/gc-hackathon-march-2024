import { User } from "../types";

export interface NewUserProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  }