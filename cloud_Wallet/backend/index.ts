import express from 'express'
const app=express()
import jwt from 'jsonwebtoken'
import { Keypair, PublicKey, sendAndConfirmTransaction, Transaction } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import cors from 'cors'
import bs58 from 'bs58'
const connection=new Connection("https://api.devnet.solana.com")
app.use(cors(
    {
          origin: 'http://localhost:5173', // your frontend's origin
  credentials: true,    
    }
))
interface user{
    username :string,
    password:string
    keypair:Keypair
    txs:string[]
}
let users:user[]=[
    {username:"akshat",password:"andhe ne movie dekhi",keypair:Keypair.generate(),txs:[]}
]
// app.options('*', cors());
const jwt_Key="HEHEE"
app.use(express.json())
// app.use("/api/v1/signup",(req,res) => {
//     console.log("Route triggeredd")

//     const username=req.body.username
//     const password=req.body.password
//     const userFound=(users.find((x)=>x.username==username)) 
//     if (userFound!=undefined){
//         if (userFound.password==password)
//         return res.json({
//             "message":"User already exists dawwg"
//         })
//     }

//     const generatedKeypair=generateRandomKeypair()
//     users.push({username,password,keypair:generatedKeypair,txs:[]})
//     return res.json({
//         "publicKey":generatedKeypair.publicKey
//     })
// })


// app.use("/api/v1/signin",(req,res)=>{
//     console.log("Route triggeredd")

//      const username=req.body.username
//     const password=req.body.password
//     const userFound=(users.find((x)=>x.username==username)) 
//    if (userFound!=undefined){
//         if (userFound.password!=password)
//         return res.json({
//             "message":"wrong pass dawwg"
//         })
//         else{
//             const jwt_string=jwt.sign(username,jwt_Key)
//             return res.json({
//                 "jwt":jwt_string
//             })
//         }
//     }
//     else{
//         return res.json({
//             "message":"account does  not exist neegga"
//         })
//     }


// })
const func=()=>{}

app.post("/api/v1/txn/sign",async (req,res):Promise<void> =>{
    console.log("Route triggeredd")
    const serializedTxs=req.body.message
const txBytes = Buffer.from(serializedTxs, 'base64');
    const txs=Transaction.from(txBytes)
    
    console.log("control reached here")

    const bs588=bs58.decode("YOUR PVT KEY")
    
    const keypair=Keypair.fromSecretKey(bs588)
    const txid=await sendAndConfirmTransaction(connection,txs,[keypair])
    console.log(txid)
      res.json({
        "txid":txid
    })

    console.log("reached here")
    return
    
}
)

app.use("/api/v1/txn/",(req,res)=>{
    const txid=req.query.id


})



app.listen(3000,()=>{
    console.log("app is listening on port 3000")
})