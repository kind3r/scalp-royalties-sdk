import dynamic from 'next/dynamic';
import React from 'react';

// const WalletDisconnectButtonDynamic = dynamic(
//   async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
//   { ssr: false }
// );

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function WalletButton() {
  return (
    <>
      <WalletMultiButtonDynamic className="wallet-adapter-button wallet-adapter-button-trigger" />
    </>
  )
}