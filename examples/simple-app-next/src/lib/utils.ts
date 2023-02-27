import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export async function getWalletNFTs(connection: Connection, wallet: PublicKey): Promise<string[]> {
  const mints: string[] = [];
  const response = await connection.getParsedTokenAccountsByOwner(wallet, { programId: TOKEN_PROGRAM_ID }, "confirmed");
  if (typeof response !== "undefined" && response !== null) {
    for (const { account } of response.value) {
      if (account.data && account.data.parsed) {
        const data = account.data;
        try {
          const decimals = data.parsed.info.tokenAmount.decimals;
          const amount = data.parsed.info.tokenAmount.uiAmount;
          if (decimals === 0 && amount === 1) {
            mints.push(data.parsed.info.mint);
          }
        } catch (error) {
          console.warn("Error parsing token:", data.parsed);
          console.error(error);
        }
      }
    }
  }
  return mints;
}

export function getLocale() {
  return (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
}

export function numberFormat(items: number | void, decimals: number = 0) {
  if (typeof items !== "undefined") {
    const formatter = new Intl.NumberFormat(getLocale(), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return formatter.format(items);
  }
  return "";
}

export function priceFormat(price?: number | null, decimals: number = 2): string {
  if (typeof price !== "undefined" && price !== null) {
    const formatter = new Intl.NumberFormat(getLocale(), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    let formatedPrice = "";
    formatedPrice = formatter.format(price);

    return formatedPrice + " ◎";
  } else {
    return "--.-- ◎";
  }
}

export function shortAddress(address: string): string {
  return address.substring(0, 4) + "..." + address.substring(address.length - 4);
}