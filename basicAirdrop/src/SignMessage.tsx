import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import { useState } from "react"
// import React,useState from 'react'
import { Ed25519Program } from "@solana/web3.js"
import { ed25519 } from "@noble/curves/ed25519"
function SignMessage() {
    const [message, setmessage] = useState("")
    const {publicKey,signMessage}=useWallet()
    // const {connection}=useConnection()
    const handleSign=async ()=>{
        console.log("sigin triggered")
        const encodedText=new TextEncoder().encode(message)
        // const txs=new Transaction().add(

        // )
        // if(encodedText==undefined){
        //     return
        // }
        const signedMessg=await signMessage?.(encodedText)
        console.log(signedMessg)
        if(signedMessg==undefined || publicKey==null)return 
        if (!ed25519.verify(signedMessg,encodedText,publicKey.toBytes()))throw new Error("wrong sign")
        alert("sucees") 
        

    }
  return (
    <div>
        <h1>Sign Message</h1>
        <input value={message} onChange={(e)=>setmessage(e.target.value)}/>
        <label>Enter your message to be signed</label>
        <button onClick={handleSign}>Sign</button>
    </div>
  )
}

export default SignMessage