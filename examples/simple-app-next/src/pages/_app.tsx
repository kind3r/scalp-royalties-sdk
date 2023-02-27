import "@solana/wallet-adapter-react-ui/styles.css"
import 'bootstrap/dist/css/bootstrap.css';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SolanaWalletProvider } from '@/context/SolanaWalletContext';

const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || "";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SolanaWalletProvider endpoint={endpoint}>
        <Component {...pageProps} />
      </SolanaWalletProvider>
    </>
  )
}
