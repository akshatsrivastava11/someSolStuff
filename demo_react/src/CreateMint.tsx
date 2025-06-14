import { 
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccount,
    createAssociatedTokenAccountInstruction,
    createInitializeInstruction, 
    createInitializeMetadataPointerInstruction, 
    createInitializeMint2Instruction, 
    createInitializeMintInstruction, 
    createMintToInstruction, 
    ExtensionType, 
    getAssociatedTokenAddress, 
    getAssociatedTokenAddressSync, 
    getMintLen, 
    LENGTH_SIZE, 
    TOKEN_2022_PROGRAM_ID, 
    TYPE_SIZE 
} from "@solana/spl-token"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js"
import { useState } from "react"
import { pack } from '@solana/spl-token-metadata'

function CreateMint() {
    const [formData, setFormData] = useState({
        name: "",
        symbol: "",
        uri: ""
    })
    
    const { sendTransaction, publicKey } = useWallet()
    const { connection } = useConnection()
    
    const handleMintCreation = async (e: any) => {
        e.preventDefault()
        
        if (!publicKey) {
            alert("Please connect your wallet first")
            return
        }
        
      
        try {
            const mintKeypair = Keypair.generate()
            
            // Use form data instead of hardcoded values
            const metadata = {
                mint: mintKeypair.publicKey,
                name: "akshat",
                symbol: "ASK",
                uri: "https://metadata.com",
                additionalMetadata: [],
            }
            
            // Calculate space needed for the mint with metadata pointer extension
            const mintLen = getMintLen([ExtensionType.MetadataPointer])
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length
            
            // Total space needed
            const totalSpace = mintLen + metadataLen
            
            // Get minimum lamports for rent exemption
            const lamports = await connection.getMinimumBalanceForRentExemption(totalSpace)
            
            console.log("Creating mint with metadata:", metadata)
            console.log("Mint address:", mintKeypair.publicKey.toBase58())
            
            const transaction = new Transaction().add(
                // Create the mint account
                SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    lamports: lamports,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen, // Use total space here
                    programId: TOKEN_2022_PROGRAM_ID
                }),
                
                // Initialize metadata pointer
                createInitializeMetadataPointerInstruction(
                    mintKeypair.publicKey,
                    publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                ),
                
                // Initialize mint
                createInitializeMintInstruction(mintKeypair.publicKey,8,publicKey,null,TOKEN_2022_PROGRAM_ID)
                ,
                // Initialize metadata
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    metadata: mintKeypair.publicKey,
                    updateAuthority: publicKey,
                    mint: mintKeypair.publicKey,
                    mintAuthority: publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri
                })
            )
            
            // Set transaction properties
            const { blockhash } = await connection.getLatestBlockhash()
            transaction.feePayer = publicKey
            transaction.recentBlockhash = blockhash
            
            // Sign with mint keypair
            transaction.partialSign(mintKeypair)
            
            console.log("Sending transaction...")
            const signature = await sendTransaction(transaction, connection)
            
            console.log("Transaction sent:", signature)
            console.log("Mint created at:", mintKeypair.publicKey.toBase58())
            
            alert(`Token created successfully! Mint address: ${mintKeypair.publicKey.toBase58()}`)
            
            // Reset form
            setFormData({ name: "", symbol: "", uri: "" })

            // now creating  an ata
            const associatedTokenAddress=getAssociatedTokenAddressSync(mintKeypair.publicKey,publicKey,false,TOKEN_2022_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID)
            console.log("the ata is  ",associatedTokenAddress.toBase58())
            const transaction2=new Transaction().add(
                createAssociatedTokenAccountInstruction(publicKey,
                    associatedTokenAddress,
                    publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                )
            )
            await sendTransaction(transaction2,connection)
            const transaction3=new Transaction().add(
                createMintToInstruction(mintKeypair.publicKey,associatedTokenAddress,publicKey,100000000,[],TOKEN_2022_PROGRAM_ID)
            )
            await sendTransaction(transaction3,connection)
            console.log("minted ")
            
        } catch (error) {
            console.error("Error creating mint:", error)
            alert(`Error creating mint: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
    
    return (
        <div>
            <h2>Create SPL Token with Metadata</h2>
            <form onSubmit={handleMintCreation}>
                <div>
                    <label>Token Name:</label>
                    <input 
                        type="text"
                        placeholder="Enter token name"
                        value={formData.name} 
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                        
                    />
                </div>
                <div>
                    <label>Token Symbol:</label>
                    <input 
                        type="text"
                        placeholder="Enter token symbol"
                        value={formData.symbol} 
                        onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                        
                    />
                </div>
                <div>
                    <label>Metadata URI:</label>
                    <input 
                        type="url"
                        placeholder="Enter metadata URI"
                        value={formData.uri} 
                        onChange={(e) => setFormData(prev => ({ ...prev, uri: e.target.value }))}
                        
                    />
                </div>
                <button type="submit">Create Token</button>
            </form>
        </div>
    )
}

export default CreateMint