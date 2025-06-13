import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import './App.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import '@solana/wallet-adapter-react-ui/styles.css'
import CreateMint from './CreateMint'
import Airdrop from './Airdrop'

function App() {

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={[]}>
        <WalletModalProvider>
          <WalletMultiButton/>
          <WalletDisconnectButton/>
          <CreateMint/>
          <Airdrop/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App
