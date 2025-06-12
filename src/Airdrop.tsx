import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React, { useState } from 'react'

function Airdrop() {
  const [airdropedAmount, setairdropedAmount] = useState("")
  const wallet=useWallet()
  const {connection}=useConnection()
  const handleAirdrop=()=>{
    if(airdropedAmount==""){
      alert("backchoddi mt kr laude")
      return
    }
    if(wallet.publicKey==null){
      alert("bhai wallet connect kr le yaar")
      return
    }
    const amt=parseInt(airdropedAmount)
    console.log("the asked  amount is ",amt)
    connection.requestAirdrop(wallet.publicKey,amt*LAMPORTS_PER_SOL)
  }
  return (
    <div>
      <input value={airdropedAmount} onChange={(e)=>setairdropedAmount(e.target.value)}/>
    <label>Enter the amount to be airdropped in your account</label>
    <button onClick={handleAirdrop}>Airdrop</button>
    </div>
  )
}

export default Airdrop