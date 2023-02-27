import { WalletName } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ExodusWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter, SolletExtensionWalletAdapter,
  LedgerWalletAdapter, getDerivationPath,
  CoinbaseWalletAdapter,
  BraveWalletAdapter,
  BackpackWalletAdapter,
  GlowWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { FC, ReactNode, useMemo } from "react";

type SolanaWalletProviderProps = {
  children: ReactNode,
  endpoint: string
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children, endpoint }) => {
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(() => {
    const ledger0 = new LedgerWalletAdapter({ derivationPath: getDerivationPath(0) });
    ledger0.name = "Ledger 44'/501'/0'" as WalletName<"Ledger">;
    const ledger00 = new LedgerWalletAdapter({ derivationPath: getDerivationPath(0, 0) });
    ledger00.name = "Ledger 44'/501'/0'/0'" as WalletName<"Ledger">;

    return [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new ExodusWalletAdapter(),
      ledger0,
      ledger00,
      new CoinbaseWalletAdapter(),
      new BraveWalletAdapter(),
      new BackpackWalletAdapter(),
      new GlowWalletAdapter()
    ]
  }, []);

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};