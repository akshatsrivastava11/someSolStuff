import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import React, { use, useState } from 'react'

function Sendsol() {
    const [walletAddres, setwalletAddres] = useState("")
    const [amt,setamt]=useState("")
    const wallet=useWallet()
    const connection=useConnection()
    const handleSubmit=async ()=>{
        if(wallet.publicKey==null) return
        const txs=new Transaction().add(
            SystemProgram.transfer(
                {
                fromPubkey:wallet.publicKey,
                toPubkey:new PublicKey(walletAddres),
                lamports:parseInt(amt)*LAMPORTS_PER_SOL
                }
            )
        )
      await   wallet.sendTransaction(txs,cornnection.connection)
      alert("Send sol")
    }
  return (
    <div>
        <input value={walletAddres} onChange={(e)=>setwalletAddres(e.target.value)}/>
        <label>Enter wallet to address</label>
        <input value={amt} onChange={(e)=>setamt(e.target.value)}/>
        <label>Enter amt</label>
        <button onClick={handleSubmit}>Send</button>
    </div>
  )
}

export default Sendsolr