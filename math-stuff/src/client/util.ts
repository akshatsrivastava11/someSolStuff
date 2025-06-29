import { Keypair } from "@solana/web3.js";
import * as fs from 'mz/fs';
// import yaml from "yaml";

export async function createKeypairFromFile(
    filePath: string,
): Promise<Keypair> {
    console.log("the asked path is ",filePath);
    const secretKeyString = await fs.readFile(filePath, {encoding: 'utf8'});
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
}