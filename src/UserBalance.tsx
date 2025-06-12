import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

function UserBalance() {
    const wallet=useWallet()
    const {connection}=useConnection()
    // let balance=0.0
    const [balance,setbalance]=useState(0)
    useEffect(()=>{
        (async function(){if(wallet.publicKey==null){
            alert("wallet nhi connect h")
            return 
        }
        setbalance((await connection.getBalance(wallet.publicKey))/1e9)})()
    },[wallet.publicKey,connection])

  return (
    <div>
        <h1>User-Balance</h1>
        {balance===0.0?<p>not connected</p>:balance}

    </div>
  )
}

export default UserBalance
