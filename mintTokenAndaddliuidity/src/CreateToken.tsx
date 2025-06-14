import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { createInitializeMetadataPointerInstruction, createInitializeMintInstruction, ExtensionType, getMinimumBalanceForRentExemptAccount, getMinimumBalanceForRentExemptMint, getMintLen, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token"
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata"
import MintToken from "./MintToken"
function CreateToken() {
    const wallet=useWallet()
    const {connection}=useConnection()

     const [name, setname] = useState("")
    const [uri, seturi] = useState("")
    const [symbol, setsymbol] = useState("")
    const [id, setid] = useState<Keypair>()
    const handleTokenCreation=async (e:any)=>{
        // e.preventDefault()
       try{ if(wallet.publicKey==null) return 
        const keypair=Keypair.generate() //keypair for the token created
        const metaData={
            mint:keypair.publicKey,
            additionalMetadata:[],
            name,uri,symbol
        }
        console.log(keypair.publicKey.toBase58())
        const spaceForMetaData=TYPE_SIZE+LENGTH_SIZE+pack(metaData).length
        console.log("space for metadata is",spaceForMetaData)
        const spaceForToken=getMintLen([ExtensionType.MetadataPointer])
        console.log("space for token is",spaceForToken)
        
        console.log("control reached")
        const lamports=await  connection.getMinimumBalanceForRentExemption(spaceForMetaData+spaceForToken)
        const transaction=new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey:wallet.publicKey,
                newAccountPubkey:keypair.publicKey,
                lamports:lamports,
                space:spaceForToken,
                programId:TOKEN_2022_PROGRAM_ID
            }),
            createInitializeMetadataPointerInstruction(keypair.publicKey,wallet.publicKey,keypair.publicKey,TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(keypair.publicKey,8,wallet.publicKey,null,TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                metadata:keypair.publicKey,
                mint:keypair.publicKey,
                mintAuthority:wallet.publicKey,
                name:metaData.name,
                programId:TOKEN_2022_PROGRAM_ID,
                symbol:metaData.symbol,
                updateAuthority:wallet.publicKey,
                uri:metaData.uri
            })
        )
         console.log("control rached here")
        transaction.recentBlockhash=(await connection.getLatestBlockhash()).blockhash
        transaction.feePayer=wallet.publicKey
        transaction.partialSign(keypair)
        const txid= await wallet.sendTransaction(transaction,connection)
        setid(keypair)}
        catch(e){
            console.log(e);
            
        }

    }
  return (
    <div>
        <h1>
            MINT_TOKEN
        </h1>
        <div >
            <input value={name} onChange={(e)=>setname(e.target.value)}/>
            <input value={uri} onChange={(e)=>seturi(e.target.value)}/>
            <input value={symbol} onChange={(e)=>setsymbol(e.target.value)}/>
            <button type='submit' onClick={handleTokenCreation}>Submit</button>
        </div>

        {id==undefined?<p>create token first</p> : 
        <MintToken MintKeypair={id}/>
        }


    </div>
  )
}

export default CreateToken