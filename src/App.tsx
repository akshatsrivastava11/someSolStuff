import { WalletDisconnectButton, WalletModalProvider,WalletModalButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react"
import "@solana/wallet-adapter-react-ui/styles.css"
import Airdrop from "./Airdrop"
import UserBalance from "./UserBalance"
import SignMessage from "./SignMessage"
import Sendsol from "./Sendsol"
function App() {
    return (

   <ConnectionProvider endpoint="https://api.devnet.solana.com">
    <WalletProvider wallets={[]}>
      <WalletModalProvider>
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <WalletMultiButton/>
        <WalletDisconnectButton/>
      </div>
      <Airdrop/>
      <UserBalance/>
      <SignMessage/>
      <Sendsol/>
      </WalletModalProvider>
    </WalletProvider>
   </ConnectionProvider>
   
  )
}

export default App
