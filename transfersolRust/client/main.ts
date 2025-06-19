// generate keypair from the file
//get new keypair of accounts to be transferring sol
//sendsol
import * as path from 'path'
import * as fs from 'mz/fs'
import * as borsh from 'borsh'
import {Connection, Keypair, LAMPORTS_PER_SOL, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction} from '@solana/web3.js'
import { builtinModules } from 'module'
const pathis=path.resolve(__dirname,'../transfersol/target/deploy/transfersol-keypair.json')
let programKeypair:Keypair;
const generateProgramKeypair=async ()=>{
    const secretKeyFile=await fs.readFile(pathis,{encoding:'utf8'})
    // console.log("The secret file is",secretKeyFile);
    const parsedJson=JSON.parse(secretKeyFile);
    // console.log("The parsed json is",parsedJson);
const bufferIs = Uint8Array.from(parsedJson);
    // console.log("The buffer is ",bufferIs);
    const keypair=Keypair.fromSecretKey(bufferIs);

    programKeypair=keypair
}
const payer=Keypair.fromSecretKey(Uint8Array.from(([202,226,58,245,91,39,163,206,172,166,234,149,97,74,103,67,1,84,42,134,64,145,240,180,2,102,81,60,140,91,66,211,98,7,39,253,160,46,3,157,134,25,115,42,248,248,185,158,184,177,124,2,238,99,153,96,2,87,155,238,27,44,191,195])))
const payee=Keypair.generate()
let connection:Connection;
const getConnectedToSolanacluster=()=>{
    connection=new Connection("https://solana-devnet.g.alchemy.com/v2/oa5nvvXzBNYrwp_f8c19H_XsccjRXDqA")
}

class TransferData{
    lamports:bigint;
    constructor(fields:{lamports:bigint}){
        this.lamports=fields.lamports
    }


}
const transferDataSchema=new Map([
    [TransferData,{kind:'struct',fields:[['lamports','u64']]}]
])


const sendSolFunction=async ()=>{
    const transferData=new TransferData({lamports:BigInt(10000)})
    const serializeData=borsh.serialize(transferDataSchema,transferData);

    const Instruction=new TransactionInstruction({
        keys:[{isSigner:true,isWritable:true,pubkey:payer.publicKey},
            {isSigner:false,isWritable:true,pubkey:payee.publicKey},
            {pubkey:SystemProgram.programId,isSigner:false,isWritable:false}
        ],
        programId:programKeypair.publicKey,
        data:Buffer.from(serializeData)
    })
    const transaction=new Transaction().add(Instruction);
    transaction.recentBlockhash=(await connection.getRecentBlockhash()).blockhash
    transaction.feePayer=payer.publicKey
    const signature=await  sendAndConfirmTransaction(connection,transaction,[payer]);
    
    
    console.log("THe signature is ",signature);
    console.log("Sending sol completed");
}

// const airdropSol = async () => {
//   try {
//       const latestBlockhash = await connection.getLatestBlockhash();
//     const signature = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL*2);
//     console.log("Airdrop requested. Signature:", signature);

//     // Get the latest blockhash so we can confirm with correct context

//     // Confirm the transaction using the latest blockhash
//     // const confirmation = await connection.confirmTransaction({
//     //   signature,
//     //   ...latestBlockhash,
//     // }, 'finalized'); // 'confirmed' or 'finalized' is recommended

//     await connection.confirmTransaction(signature)
//     // console.log("Airdrop confirmed:", confirmation);
//   } catch (err) {
//     console.error("Airdrop failed:", err);
//   }
// };

const main=async ()=>{
    await generateProgramKeypair()
    console.log("The programAddress is ",programKeypair)
    getConnectedToSolanacluster()
    console.log("the payer public key is",payer.publicKey)
    console.log("the payer public key is",payee.publicKey)

    // await airdropSol()
    // const data1=await connection.getBalance(payer.publicKey);
    // console.log(data1);
    console.log("The initial amount of lamports in payer's address",(await connection.getAccountInfo(payer.publicKey))?.lamports)
    console.log("The initial amount of lamports in payer's address",(await connection.getAccountInfo(payee.publicKey))?.lamports)

    await sendSolFunction()
    console.log("The final amount of lamports in payer's address",(await connection.getAccountInfo(payer.publicKey))?.lamports)
    console.log("The final amount of lamports in payer's address",(await connection.getAccountInfo(payee.publicKey))?.lamports)

}
main().then(()=>{
    console.log("Function called")
})
.catch((e)=>console.log(e))