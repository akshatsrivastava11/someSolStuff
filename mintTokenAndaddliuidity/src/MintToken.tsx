import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { Connection, Transaction, type Keypair } from '@solana/web3.js'
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, createMintToInstruction, getAssociatedTokenAddress, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

interface MintKeypairProp {
    MintKeypair:Keypair
}
function MintToken({MintKeypair}:MintKeypairProp) {
    const {connection}=useConnection()
    const [amt, setamt] = useState("")
    const wallet=useWallet()
    const handleMinting=async ()=>{
        if(wallet.publicKey==null) return
        // we first have to create a associated mint account
        // we then have to mint account for the token
        const associatedTokenAddress=getAssociatedTokenAddressSync(MintKeypair.publicKey,wallet.publicKey,false,TOKEN_2022_PROGRAM_ID)
        const txs1=new Transaction().add(
            createAssociatedTokenAccountInstruction(wallet.publicKey,associatedTokenAddress,wallet.publicKey,MintKeypair.publicKey,TOKEN_2022_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID)

        )
        await wallet.sendTransaction(txs1,connection)
        const tx2=new Transaction().add(createMintToInstruction(MintKeypair.publicKey,associatedTokenAddress,wallet.publicKey,1000000000,[],TOKEN_2022_PROGRAM_ID))
        await wallet.sendTransaction(tx2,connection)
        alert("Minting done!!")
    }   
  return (
    <div>
        <h1>Mint token</h1>
        <input placeholder='Enter amount'/>
        <button onClick={handleMinting}>Mint_token</button>
    </div>
  )
}

export default MintToken