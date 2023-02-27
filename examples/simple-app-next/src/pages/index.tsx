import { WalletButton } from '@/components/WalletButton';
import { getWalletNFTs, priceFormat, shortAddress } from '@/lib/utils';
import { CheckMintResponse, PaymentInformation, PayTransaction, PayTransactionGenerateStatus, PayTransactionSubmitStatus, RoyaltySimple, RoyaltyStatus, ScalpRoyaltiesSDK } from '@scalp/royalties';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  // will hold NFT addresses
  const [assets, setAssets] = useState<string[]>([]);
  const [loadingAssets, setLoadingAssets] = useState<boolean>(false);

  // will hold the responses from the royalties API
  const [checkedMints, setCheckedMints] = useState<CheckMintResponse[]>();
  const [checkingHoldings, setCheckingHoldings] = useState<boolean>(false);

  const [busy, setBusy] = useState<boolean>(false);

  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  /**
   * Load NFT addresses the wallet holds
   */
  const refreshAssets = useCallback(async (wallet: PublicKey) => {
    setLoadingAssets(true);
    const mints = await getWalletNFTs(connection, wallet);
    setAssets(mints);
    setLoadingAssets(false);
  }, [connection]);

  /**
   * Check the NFT list against the royalties API
   */
  const checkHoldings = useCallback(async (mints: string[]) => {
    setCheckingHoldings(true);
    const mintRoyalties = await ScalpRoyaltiesSDK.checkMints(mints);
    if (typeof mintRoyalties !== "undefined") {
      mintRoyalties.sort((a, b) => {
        if (typeof a.metadata !== "undefined" && typeof b.metadata !== "undefined") {
          return a.metadata.name.localeCompare(b.metadata.name);
        } else {
          return 0;
        }
      });
      setCheckedMints(mintRoyalties);
    } else {
      setCheckedMints(undefined);
    }
    setCheckingHoldings(false);
  }, []);

  /**
   * Fetch the royalty payment transaction from the API
   * Ask the user to sign it
   * Send it back to the API and wait for confirmation
   */
  const payRoyalties = useCallback(async (royaltyInfo: CheckMintResponse, royaltyAmount: RoyaltySimple) => {
    if (busy === true) {
      return;
    }
    setBusy(true);
    if (typeof wallet !== "undefined" && typeof royaltyInfo.sale !== "undefined") {
      toast.success("Generating royalty payment transaction");
      // Generate payment transaction request
      const paymentInfo: PaymentInformation = {
        mint: royaltyInfo.mint,
        payer: wallet.publicKey.toBase58(),
        saleTransaction: royaltyInfo.sale.transaction,
        royalty: royaltyAmount
      }
      // Fetch server generated royalty payment transaction, this also checks that the information we have
      // about the mint and last sale is up-to-date
      const generatedTransaction = await ScalpRoyaltiesSDK.payTransaction(paymentInfo);
      if (typeof generatedTransaction !== "undefined") {
        if (generatedTransaction.status === PayTransactionGenerateStatus.Succes && typeof generatedTransaction.transaction !== "undefined") {
          const transaction = Transaction.from(Buffer.from(generatedTransaction.transaction, "hex"));
          try {
            toast.success("Signing royalty payment transaction");
            // Ask the user to sign the royalty payment transaction
            const signedTransaction = await wallet.signTransaction(transaction);
            const payTransaction: PayTransaction = {
              signedTransaction: signedTransaction.serialize().toString("hex")
            }
            toast.success("Waiting for network confirmation");
            // Send transaction on-chain and wait for confirmation
            const submitedTransaction = await ScalpRoyaltiesSDK.submitPayTransaction(payTransaction);
            if (typeof submitedTransaction !== "undefined") {
              // console.log(submitedTransaction);
              if (submitedTransaction.status === PayTransactionSubmitStatus.Confirmed) {
                toast.success("Success !");
                // all good, thank the user and refresh assets
                await refreshAssets(wallet.publicKey);
              } else {
                // display error based on status
                toast.error("Something went wrong, please try again [5]");
              }
            } else {
              // display error could not send tx
              toast.error("Something went wrong, please try again [4]");
            }
          } catch (error) {
            // display signature error
            toast.error("Something went wrong, please try again [3]");
          }
        } else {
          // display error depending on status
          toast.error("Something went wrong, please try again [2]");
        }
      } else {
        // display error
        toast.error("Something went wrong, please try again [1]");
      }
    }

    setBusy(false);
  }, [wallet, busy, refreshAssets]);

  /**
   * Trigger NFT address load when wallet is connected
   */
  useEffect(() => {
    if (connected === true && publicKey !== null) {
      refreshAssets(publicKey);
    } else {
      setAssets([]);
    }
  }, [connected, publicKey, refreshAssets]);

  /**
   * Trigger NFT royalties check when the NFT list changes
   */
  useEffect(() => {
    if (assets.length > 0) {
      checkHoldings(assets);
    } else {
      setCheckedMints(undefined);
    }
  }, [assets, checkHoldings]);

  return (
    <>
      <Head>
        <title>Sample royalties payment app</title>
        <meta name="description" content="Sample royalties payment app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div><Toaster position="bottom-left" /></div>
      <div className="container">
        <h1 className="text-center">Sample royalties payment app</h1>
        <div className="row mt-3">
          <div className="col-12 col-lg-4">
            <div className="d-flex justify-content-center m-1 p-1 my-5 py-5">
              <WalletButton />
            </div>
          </div>
          <div className="col-12 col-lg-8">
            {loadingAssets || checkingHoldings ? (
              <>
                <div className="d-flex justify-content-center m-1 p-1 my-5 py-5">
                  <span className="spinner-border" role="status" aria-hidden="true"></span>
                </div>
              </>
            ) : (
              <>
                {typeof checkedMints === "undefined" || checkedMints.length === 0 ? (
                  <>
                    <div className="d-flex justify-content-center m-1 p-1 my-5 py-5">
                      No eligible mints found
                    </div>
                  </>
                ) : (
                  <>
                    {checkedMints.map((checkedMint) => {
                      return (
                        <div key={checkedMint.mint} className="row my-2">
                          <div className="col-2"><img src={checkedMint.metadata?.thumbnail || checkedMint.metadata?.image} style={{ width: "64px" }} /></div>
                          <div className="col-4">
                            <small>{checkedMint.metadata?.name}</small><br />
                            <small className="text-muted">{shortAddress(checkedMint.mint)}</small>
                          </div>
                          <div className="col-4">
                            {checkedMint.sale ? (
                              <>
                                <div>{priceFormat(checkedMint.sale.price / LAMPORTS_PER_SOL)}</div>
                                <div>
                                  <a className="me-1" href={"https://solana.fm/tx/" + checkedMint.sale.transaction} target={"_blank"} rel="noreferrer" title="Solana.FM">
                                    {checkedMint.sale.transaction.substring(0, 10)}...
                                  </a>
                                </div>
                              </>
                            ) : ""}
                          </div>
                          <div className="col-2">
                            {checkedMint.status === RoyaltyStatus.NotPaid ? (
                              <>
                                <button className="btn btn-success btn-sm my-2"
                                  disabled={busy}
                                  onClick={() => {
                                    payRoyalties(checkedMint, RoyaltySimple.Full);
                                  }}>
                                  {busy === true ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  ) : ""}
                                  Pay now
                                </button>
                              </>
                            ) : (
                              <>
                                {checkedMint.status}
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
