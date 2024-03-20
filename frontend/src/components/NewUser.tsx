import { useMutation } from "@tanstack/react-query"
import { storeToLocalStorage } from "../tools";
import { useRef, useEffect } from 'react';
import { NewUserProps } from "../interfaces";
import { User } from "../types";

const url = import.meta.env.VITE_API_URL;

export default function NewUser({setUser}: NewUserProps) {
  const setUserRef = useRef(setUser);

  useEffect(() => {
    setUserRef.current = setUser;
  }, [setUser]);

  const { data, isPending, isSuccess, error, mutate } = useMutation<User>({
    mutationFn: () =>
      fetch(`${url}/new-user`, { method: "POST" }).then((res) => res.json()),
    onSuccess: (data) => {
      storeToLocalStorage('user', data);
      if (setUserRef.current) {
        setUserRef.current(data);
      }
    },
  });

  return (
    <div style={{ minHeight: "350px"}}>
      <h2>New User</h2>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', gap: '10px'}}>
        <button onClick={() => mutate()}>Create New User</button>
        <div style={{ display: "flex", alignItems: 'center'}}>
        {isPending && <div>Loading...</div>}
        {isSuccess && <div>Success!</div>}
        {error && <div>Error: {error.message}</div>}
        </div>
      </div>
      {data && (
        <div>
          <p><b>Alias</b>: {data.alias}</p>
          <p><b>ETH Address</b>: {data.ethAddress}</p>
          <p><b>Public Key</b>: {data.user.publicKey}</p>
          <p><b>Private Key</b>: {data.user.privateKey}</p>
          <p><b>Response</b>: {data.response.data} ({data.response.status})</p>
        </div>
      )}
    </div>
  )
}