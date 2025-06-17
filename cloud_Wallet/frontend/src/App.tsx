import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import axios from 'axios'
// import bs58 from 'bs58';
const connection=new Connection("https://api.devnet.solana.com")

function App() {
  // const [count, setCount] = useState(0)
  const [amount, setamount] = useState("")
  const [Toaddress, setToaddress] = useState("")
  const handleTxs=async ()=>{
    console.log("An endpoint triggered")
    
    console.log(parseFloat(amount))
    const ix=SystemProgram.transfer({
      fromPubkey:new PublicKey("HGeqJmtaZDUButfbMpG2DHSaPetMnCR7izEeQMsQ6Jrq"),
      lamports:parseFloat(amount)*LAMPORTS_PER_SOL,
      toPubkey:new PublicKey("G1sVAASEWwvXGjNVb9ibGhJk8XRGfK7yZWyyV6uUrqmx"),
    }) 
    const txs=new Transaction().add(ix)
    
    txs.feePayer=new PublicKey("HGeqJmtaZDUButfbMpG2DHSaPetMnCR7izEeQMsQ6Jrq")
    txs.recentBlockhash=(await connection.getLatestBlockhash()).blockhash
    const serializedTxs=txs.serialize({
      requireAllSignatures:false,
      verifySignatures:false
    }).toString("base64")
    console.log("control reached here")
    const resp=await axios.post("http://localhost:3000/api/v1/txn/sign",{
      "message":serializedTxs,
      "retry":false
    },{
      withCredentials:true
    })
    console.log("control reached")
    return resp
  }
  return (
    <div>
      <input placeholder='Enter the amount to be transferred' value={amount} onChange={(e)=>setamount(e.target.value)}/>
      <input placeholder='Enter the address to be transfered to'/>
    <button  onClick={handleTxs}></button>
    </div>
  )
}

export default App
