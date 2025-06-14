const { Wallet } = require("@project-serum/anchor")
// const { bs58 } = require("@project-serum/anchor/dist/cjs/utils/bytes")
const bs58=require("bs58")
const {Connection, Keypair, VersionedTransaction}=require("@solana/web3.js")
const  axios  = require("axios")
const connection=new Connection("https://solana-devnet.g.alchemy.com/v2/oa5nvvXzBNYrwp_f8c19H_XsccjRXDqA")

const wallet=new Wallet(Keypair.fromSecretKey(bs58.default.decode("your private key")))
async function SwapSol(){
  try { const response=await axios.get('https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50')
    // console.log(response.data)
    const quoteResponse=response.data
    // console.log(quoteResponse)
    const {data:{swapTransaction}}=await axios.post("https://quote-api.jup.ag/v6/swap",{
        "quoteResponse":quoteResponse,
        "userPublicKey":wallet.publicKey.toString()
    })
    const swapTxsBuffer=Buffer.from(swapTransaction,'base64')
    var txs=VersionedTransaction.deserialize(swapTxsBuffer)
    txs.sign([wallet.payer])
    const latestBlockHash=connection.getLatestBlockhash()
    txs=txs.serialize()
    const txid=await connection.sendRawTransaction(txs)
    console.log(`https://solscan.io/tx/${txid}`);
    // console.log(txs.data.swapTransaction)}-
}
catch(e){
    console.log(e)
}
}
SwapSol()