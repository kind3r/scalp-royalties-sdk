export type Collection = {
  /**
   * Collection ID
   */
  id: number;
  /**
   * Unix timestamp when the collection was first detected
   */
  createdAt: number;
  /**
   * Collection name
   */
  name: string;
  /**
   * Collection description
   */
  description: string;
  /**
   * Collection thumbnail
   */
  logoUrl?: string;
  /**
   * Number of items in the collection
   */
  items: number;
  /**
   * Mint date (Unix timestamp)
   */
  mintDate: number;
  /**
   * Mint price in lamports
   */
  mintPrice: number;
  /**
   * Website URL
   */
  website?: string;
  /**
   * Twitter URL
   */
  twitter?: string;
  /**
   * Discord invite URL
   */
  discord?: string;
  /**
   * MagicEden symbol. Use https://magiceden.io/marketplace/SYMBOL to access the collection on MagicEden
   */
  symbolME?: string;
  /**
   * Floor price in lamports
   */
  floorPrice?: number;
  /**
   * Number of listed items
   */
  listedItems?: number;
  /**
   * Number of distinct wallets holding at least 1 NFT from the collection
   */
  owners?: number;
  /**
   * Unix timestamp of the last date of the full owners update
   */
  lastOwnersUpdate?: number;
}

export type MintCreator = {
  address: string;
  verified: number;
  share: number;
}

export type MintMetadata = {
  // address: string;
  name: string;
  image: string;
  thumbnail?: string;
  creators: MintCreator[];
  royalties: number;
  rank: number;
  isListed: boolean;
  lastActivity?: number;
}

export type MintSale = {
  /**
   * Sale transaction signature
   */
  transaction: string;
  /**
   * Unix timestamp of the block the sale was recorded in
   */
  timestamp: number;
  /**
   * Sale price in lamports
   */
  price: number;
  /**
   * Sales royalties paid in BP (divide by 100 to get percentage value)
   */
  royalties: number;
  /**
   * Royalty payment transaction signature if the payment was done via the API
   */
  proof?: string;
  /**
   * Unix timestamp of the royalty payment transaction
   */
  proofTime?: number;
}

export enum RoyaltyStatus {
  Unknown = "Unknown",
  NotPaid = "NotPaid",
  PaidPartial = "PaidPartial",
  PaidFull = "PaidFull",
  Exempted= "Exempted",
}

export type PaymentInformation = {
  /**
   * Token address to pay royalties for
   */
  mint: string;
  /**
   * Signature of the sale transaction we are referring to. Will be checked agains the last know sale transaction for the mint.
   */
  saleTransaction: string;
  /**
   * Wallet address of the royalties payer
   */
  payer: string;
  /**
   * Amount of royalties to be paid
   */
  royalty?: RoyaltySimple;
  /**
   * Custom percentage of royalties to be paid in BP of the sale value.
   * For example 330 means 3.3%  
   */
  royaltyCustom?: number;
  /**
   * Custom amount of royalties to be paid in lamports
   */
  royaltyAmount?: number;
}

export enum RoyaltyMode {
  SimpleFull,
  SimpleHalf,
  Custom,
  Fixed
}

export enum RoyaltySimple {
  Full = "Full",
  Half = "Half"
}

export type PayTransaction = {
  signedTransaction: string;
}

export type PayProof = {
  /**
   * Royalty payment transaction signature
   */
  transaction: string;
  /**
   * Unix timestamp of the royalty payment transaction time
   */
  transactionTime: number;
  /**
   * Token address for which royalties were paid
   */
  mint: string;
  /**
   * for which royalties were paid
   */
  saleTransaction: string;
  /**
   * Wallet address of the payer
   */
  payer: string;
  /**
   * Paid amount in lamports
   */
  paid: number;
}

export type CheckMintResponse = {
  /**
   * Mint Address
   */
  mint: string;
  /**
   * Information about the mint
   */
  metadata?: MintMetadata;
  /**
   * Last sale, if any
   */
  sale?: MintSale;
  /**
   * Royalty status
   */
  status: RoyaltyStatus;
}

export type CheckMintsResponse = CheckMintResponse[];

export type PayTransactionGenerateResponse = {
  status: PayTransactionGenerateStatus;
  transaction?: string;
  payer?: string;
  amount?: number;
  fee?: number;
}

export enum PayTransactionGenerateStatus {
  Succes = "Succes",
  ErrorInvalidParameters = "ErrorInvalidParameters",
  ErrorSaleMismatch = "ErrorSaleMismatch",
  ErrorTransaction = "ErrorTransaction",
  ErrorRoyaltiesPaid = "ErrorRoyaltiesPaid",
  ErrorCalculatingRoyalties = "ErrorCalculatingRoyalties"
}

export type PayTransactionSubmitResponse = {
  status: PayTransactionSubmitStatus;
  signature: string;
}

export enum PayTransactionSubmitStatus {
  Confirmed = "Confirmed",
  Failed = "Failed",
  Expired = "Expired",
  InsufficientFunds = "InsufficientFunds",
  InvalidSale = "InvalidSale",
  InvalidTransaction = "InvalidTransaction"
}

export type GetCollectionsResponse = Collection[];

export type GetMintsResponse = string[];

export type GetPayProofsResponse = PayProof[];