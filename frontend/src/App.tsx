import { useEffect, useState } from 'react'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NewUser from './components/NewUser'
import { getFromLocalStorage } from './tools'
import { User } from './types';
import UserDash from './components/UserDash'
import { CountdownProvider } from './providers/CountdownProvider'
import UserStats from './components/UserStats'
const queryClient = new QueryClient()


function App() {
  

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const userData = getFromLocalStorage('user');
    if (userData) {
      setUser(userData);
    }
  },[]);

  if(user) { 
    return ( 
      <CountdownProvider>
      <QueryClientProvider client={queryClient} key={user?.publicKey}>
      
        <UserStats />
        <h1>Dash</h1>
        <div className="card">
          <br />
          <UserDash />
        </div>
        
      </QueryClientProvider>
      </CountdownProvider>
  
    )
  }
  return (
    <CountdownProvider>
    <QueryClientProvider client={queryClient}>
      <div className="card">
        <NewUser setUser={setUser as React.Dispatch<React.SetStateAction<User | null>>} />
      </div>
    </QueryClientProvider>
    </CountdownProvider>
  )


}

export default App
