import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemInstruction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

// import fs from "mz/fs";
import * as path from "path";
import * as os from "os";
import * as yaml from "yaml";
import { createKeypairFromFile } from "./util";
const CONFIG_FILE_PATH = path.resolve(
    os.homedir(),
    '.config',
    'solana',
    'id.json',
);

let connection:Connection
async function connect(){
     connection = new Connection("https://api.devnet.solana.com");
    console.log("Connection to the cluster established");
}

let localKeypair:Keypair=Keypair.fromSecretKey(Uint8Array.from([202,226,58,245,91,39,163,206,172,166,234,149,97,74,103,67,1,84,42,134,64,145,240,180,2,102,81,60,140,91,66,211,98,7,39,253,160,46,3,157,134,25,115,42,248,248,185,158,184,177,124,2,238,99,153,96,2,87,155,238,27,44,191,195]))

console.log(CONFIG_FILE_PATH);
// const getLocalAccount = async () => {
//     const config = await fs.readFile(CONFIG_FILE_PATH,{encoding:'utf-8'});
//     // const keypairPath=yaml.parse(config).keypair_path;
//     const keypairPath=JSON.parse(config)a
//     localKeypair = await createKeypairFromFile(keypairPath);
//     console.log("Local account loaded");
//     console.log(localKeypair.publicKey.toBase58());
// }
console.log(localKeypair.publicKey);
const PROGRAM_PATH = path.resolve(__dirname, '../sqaure/target/deploy/sqaure');

let programKeyPair:Keypair
let programId:PublicKey
const getProgram=async()=>{
    console.log(PROGRAM_PATH);
    programKeyPair=await createKeypairFromFile(PROGRAM_PATH+'-keypair.json');
    programId=programKeyPair.publicKey;
    console.log("Program account loaded");
    console.log(programId.toBase58());

}

let clientPubKey:PublicKey
const configureClient=async(account_space:number)=>{
    const seed="Test1"
    clientPubKey=await PublicKey.createWithSeed(localKeypair.publicKey,seed,programId)
    console.log(`For simplicity's sake, we've created an address using a seed.`);
    console.log(`That seed is just the string "test(num)".`);
    console.log(`The generated address is:`);
    console.log(`   ${clientPubKey.toBase58()}`);
    // await sendAndConfirmTransaction(Connection,)
    const newTxs=new Transaction().add(
        SystemProgram.createAccountWithSeed({
            fromPubkey:localKeypair.publicKey,
            basePubkey:localKeypair.publicKey,
            seed:seed,
            newAccountPubkey:clientPubKey,
            lamports:LAMPORTS_PER_SOL,
            space:account_space,
            programId:programId
        }
        )

    )
    await sendAndConfirmTransaction(connection,newTxs,[localKeypair]);
}

export const pingProgram=async()=>{
    // console.log("Pinging program",programName);
    const instruction=new TransactionInstruction({
        keys:[{isSigner:false,pubkey:clientPubKey,isWritable:true}],
        programId,
        data:Buffer.alloc(0),
    })
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [localKeypair],
    )
    console.log("Ping suuceessfull")


}

export async function example(accountSpaceSize: number) {
    await connect();
    // await getLocalAccount();
    await getProgram();
    await configureClient(accountSpaceSize);
    await pingProgram();
}
example(10);