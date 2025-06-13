

import { createInitializeInstruction, createInitializeMetadataPointerInstruction, createInitializeMint2Instruction, createMint, createMintToCheckedInstruction, ExtensionType, getMinimumBalanceForRentExemptAccount, getMinimumBalanceForRentExemptMint, getMint, getMintLen, LENGTH_SIZE, MetadataPointerInstruction, MINT_SIZE, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, tokenMetadataInitialize, transfer, TYPE_SIZE } from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction ,} from "@solana/web3.js"
import { useState } from "react"
import {pack} from '@solana/spl-token-metadata'
function CreateMint() {
    const [formData, setformData] = useState({
        name:"",
        symbol:"",
        uri:""
    })
    const {sendTransaction,publicKey}=useWallet()
    const {connection}=useConnection()
    const handleMintCreation=async (e:any)=>{
        
        e.preventDefault()
        const name=formData.name
        const symbol=formData.symbol
        const uri=formData.uri
        const MintAccKey=Keypair.generate()
        const metaData={
            mint: MintAccKey.publicKey,
            name: 'ASkI',
            symbol: 'Ask    ',
            uri: 'https://cdn.100xdevs.com/metadata.json',
            additionalMetadata: [],
        }
        // console.log("the wallet's public key is",publicKey?.toBase58)
        // const pubkey=Uint8Array.from("AkZeYmwGNGUm1YVFsNabZSrobFjZqfmu4tRMsAYMhtopLRoMaAjzrHSgTM93CTWBhBNPiNYbGVckSqrVBiaDqyf")
        // console.log(pubkey)
        console.log("this func triggeredd")
        const lamports_for_metadata=getMintLen([ExtensionType.MetadataPointer])
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metaData).length;

        const lamports=await connection.getMinimumBalanceForRentExemption(metadataLen+lamports_for_metadata)
        console.log(MintAccKey)
        if(publicKey==null) return

        const transaction=new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey:publicKey,
                lamports:lamports,
                newAccountPubkey:MintAccKey.publicKey,
                space:lamports_for_metadata,
                programId:TOKEN_2022_PROGRAM_ID
            
            }),
            createInitializeMetadataPointerInstruction(MintAccKey.publicKey,publicKey,MintAccKey.publicKey,TOKEN_2022_PROGRAM_ID),
            createInitializeMint2Instruction(MintAccKey.publicKey,8,publicKey,null,TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                  programId: TOKEN_2022_PROGRAM_ID,
    metadata: MintAccKey.publicKey,
    updateAuthority:publicKey ,
    mint: MintAccKey.publicKey,
    mintAuthority:publicKey,
    name: metaData.name,
    symbol: metaData.symbol,
    uri: metaData.uri
            })
        )
        // tokenMetadataInitialize(connection,publicKey,MintAccKey.publicKey,)
        const recentBLockHAsh=(await connection.getLatestBlockhash()).blockhash
        transaction.feePayer=publicKey
        transaction.recentBlockhash=recentBLockHAsh
        transaction.partialSign(MintAccKey)
        
        console.log(MintAccKey.publicKey.toBase58())
        // wallet.signTransaction(transaction)
            console.log(transaction)
            await sendTransaction(transaction,connection)
            console.log(transaction)
            // const txid=await connection.sendRawTransaction(transaction.serialize())
            // const confirm=await connection.confirmTransaction(txid)
            // console.log(confirm)
            alert("Account generated successfully")
            
        
        console.log("control reached here")
        const mintinfo=await getMint(connection,MintAccKey.publicKey)
        console.log("mintoff is",mintinfo)
    }
  return (
    <form onSubmit={handleMintCreation}>
        <input value={formData.name} onChange={(e) => setformData(prev => ({ ...prev, name: e.target.value }))} />
        <input value={formData.symbol} onChange={(e) => setformData(prev => ({ ...prev, symbol: e.target.value }))}/>
        <input value={formData.uri} onChange={(e) => setformData(prev => ({ ...prev, uri: e.target.value }))}/>
        <button type="submit">Submit</button>
</form>
  )
} 

export default CreateMint