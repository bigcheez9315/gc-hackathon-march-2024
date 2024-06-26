import { useContext, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { Balances, CountdownContext } from "../providers/CountdownProvider"
import { getFromLocalStorage } from "../tools";
import PopoverView from "./CustomPopover";

const url = import.meta.env.VITE_API_URL;


export default function UserStats() {

    const { countdownEnds, resetCountdownEnds, updateBalances, balances, updateNftBalances, nftBalances } = useContext(CountdownContext);
    const [loading, setLoading] = useState(false);

    const rehydrateBalances = () => {
        const userData = getFromLocalStorage('user');
        fetch(`${url}/balances`, {
            method: "POST",
            body: JSON.stringify({
                identityKey: userData.user.identityKey,
                privateKey: userData.user.privateKey,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => data.data)
        .then((balancesData) => {
            if (balancesData.length > 0) {
                console.log('Balancesss', balancesData);
                const swords = balancesData.find((balance: any) => balance?.type === 'TurboSword');
                updateNftBalances(swords);
                const b = balancesData.reduce((acc: any, balance: any) => {
                    if(!balance) return acc
                    acc[balance.type] = Number(balance.quantity);
                    return acc;
                }, {});
                console.log('Balances', b);
                updateBalances(b);
            }
        })
        .catch((error) => {
            console.error(error, 'bro');
        });
        
    }
    const craftToken = (tokenKey:string, quantity:number ) => {
        const userData = getFromLocalStorage('user');
        const b = {
            tokenKey,
            quantity,
            identityKey: userData.user.identityKey,
            privateKey: userData.user.privateKey,
        }
        fetch(`${url}/mint-tokens`, {
            method: "POST",
            body: JSON.stringify(b),
            headers: {
                "Content-Type": "application/json",
            }, 
        }).then((res) => res.json())
        .then(()=>rehydrateBalances())
    }

    const burnToken = (tokenKey:string, quantity:number ) => {
        const userData = getFromLocalStorage('user');
        console.log('burning--', nftBalances)
        fetch(`${url}/burn`, {
            method: "POST",
            body: JSON.stringify({
                tokenKey,
                instanceNumber: nftBalances.instanceIds.pop(),
                identityKey: userData.user.identityKey,
                privateKey: userData.user.privateKey,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        // .then(()=>rehydrateBalances())
        .catch((error) => {
            console.error(error, 'bro');
        });
    }

    const userData = getFromLocalStorage('user');
    const b = {
        tokenKey: "LEMIN",
        quantity: countdownEnds,
        identityKey: userData.user.identityKey,
        privateKey: userData.user.privateKey,
    }
    const { mutate } = useMutation({
        mutationFn: () =>
            fetch(`${url}/mint-tokens`, {
                method: "POST",
                body: JSON.stringify(b),
                headers: {
                    "Content-Type": "application/json",
                }, 
            }).then((res) => res.json()),
            onSuccess: (data) => {
                resetCountdownEnds();
                setLoading(true);
                rehydrateBalances();
            },
            onError: (error) => {
                console.error(error);
            }
    });

    useEffect(() => {
        rehydrateBalances();
    }, []);

    const handleCraftItem = async () => {
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        if (randomNumber < 3) {
            await burnToken('TBSW', 1);
            await craftToken('DRST', 100);
            await craftToken('DRTR', 50);
        } else {
            await burnToken('TBSW', 1);
            await craftToken('DRST', 20);
            await craftToken('DRTR', 10);
        }
        rehydrateBalances();
        setLoading(false)
    }
    
  return (
    <div style={{ width:300,  position:'fixed', top:20, left:20}}>
        {loading ? <div style={{ width:300,  position:'fixed', top:120, left:120, background:'white', color:'black', zIndex:3000}}><h1>sMelting items...</h1></div> : null}
      
        {/* <div style={{ display: "flex", alignItems: 'flex-start', flexDirection:'column'}}>
            <div style={{ display: "flex", alignItems: 'flex-start'}}>
               <div style={{fontSize:18, flex:1}}>Acquiring minerals from hunters: 
                <p style={{color:'#fff600'}}>{countdownEnds}</p> 
                <button style={{marginLeft:20}}disabled={countdownEnds<5} onClick={() => mutate()}>Mint Minerals</button>
                </div> 
            </div>
            
        </div> */}
        <div style={{ display: "flex", alignItems: 'flex-start', flexDirection:'column'}}>
            <div style={{ flex:1}}>
               <h2>Game Inventory</h2>
            </div> 
            <div style={{ display:'flex', flex:1, alignItems: 'flex-start'}}>
            {
                Object.keys(balances).map((key) => {
                    const balanceKey = key as keyof Balances;
                    if (balanceKey === 'TurboSword' || balanceKey === 'UltraSword') return null; 
                    return <div key={key} style={{flex:1, padding:10}}><b>{key}<br/> {balances[balanceKey]}</b></div>
                })
            }
            </div>
        </div>
        <div style={{ display: "flex", alignItems: 'flex-start', flexDirection:'column'}}>
            <div style={{ flex:1}}>
               <h2>Available NFTs</h2>
            </div> 
            <div style={{ display:'flex', flex:1, alignItems: 'flex-start'}}>
            {
                Object.keys(balances).map((key) => {
                    const balanceKey = key as keyof Balances;
                    if (balanceKey === 'DragonStone' || balanceKey === 'DragonTears' || balanceKey === 'UltraSword') return null; 
                    if (balanceKey === 'TurboSword' && balances[balanceKey] === 0) return <div key={key} style={{flex:1, padding:10, minWidth:100}}>
                    No NFTs available for exchange
                    {/* <b>{key}<br/> {balances[balanceKey]}</b> */}
                </div>
                    return <div key={key} style={{flex:1, padding:10, minWidth:100}}>
                        <PopoverView balanceKey={balanceKey} balances={balances} handleCraftItem={handleCraftItem}/>
                        {/* <b>{key}<br/> {balances[balanceKey]}</b> */}
                    </div>
                })
            }
            </div>
        </div>
    </div>
  )
}