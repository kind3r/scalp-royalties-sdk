import {
  CheckMintsResponse,
  GetCollectionsResponse,
  GetMintsResponse,
  GetPayProofsResponse,
  PaymentInformation,
  PaymentOverrideInformation,
  PayTransaction,
  PayTransactionGenerateResponse,
  PayTransactionSubmitResponse
} from "./models";

class ScalpRoyaltiesSDKClass {
  private endpoint: string;
  private apiKey: string;

  constructor() {
    this.endpoint = process.env.NEXT_PUBLIC_SR_API || process.env.REACT_APP_SR_API || "https://royalties.scalp-empire.com/v1";
    this.apiKey = process.env.NEXT_PUBLIC_SR_APIKEY || process.env.REACT_APP_SR_APIKEY || "";
  }

  /**
   * Set a new API endpoint url
   * @param newEndpoint Royalties API endpoint URL
   */
  setEndpoint(newEndpoint: string) {
    this.endpoint = newEndpoint;
  }

  /**
   * Set the API key
   * @param newApiKey Royalties API key
   */
  setApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
  }

  /**
   * Get the list of collections the API key has access to
   * @returns 
   */
  async getCollections(): Promise<GetCollectionsResponse | void> {
    try {
      const res = await fetch(this.endpoint + "/collections", {
        method: "GET",
        headers: {
          "x-api-key": this.apiKey
        },
      });
      if (res.ok) {
        const body: GetCollectionsResponse = await res.json();
        return body;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Get the list of mints (NFT token addresses) of a collection
   * @param collectionId Id of the collection (@see getCollections)
   * @returns 
   */
  async getCollectionMints(collectionId: number): Promise<GetMintsResponse | void> {
    try {
      const res = await fetch(this.endpoint + "/mints/" + encodeURIComponent(collectionId), {
        method: "GET",
        headers: {
          "x-api-key": this.apiKey
        },
      });
      if (res.ok) {
        const body: GetMintsResponse = await res.json();
        return body;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Check a list of mints
   * @param mints List of mint (NFT) addresses
   * @returns 
   */
  async checkMints(mints: string[]): Promise<CheckMintsResponse | void> {
    try {
      const res = await fetch(this.endpoint + "/check", {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey
        },
        body: JSON.stringify(mints)
      });
      if (res.ok) {
        const body: CheckMintsResponse = await res.json();
        return body;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Get a list of the latest royalty payment transactions ordered by newest first
   * @param since Unix timestamp of the oldest transaction
   * @param limit Number of payment transactions to return. Max 1000. Default 100.
   * @returns 
   */
  async getPayProofs(since: number | undefined, limit: number = 100): Promise<GetPayProofsResponse | void> {
    try {
      const params: string[] = [];
      if (typeof since !== "undefined") {
        params.push(`since=${encodeURIComponent(since)}`);
      }
      params.push(`limit=${encodeURIComponent(limit)}`);
      const res = await fetch(this.endpoint + "/pay-proofs?" + params.join("&"), {
        method: "GET",
        headers: {
          "x-api-key": this.apiKey
        },
      });
      if (res.ok) {
        const body: GetPayProofsResponse = await res.json();
        return body;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Generate a royalties payment transaction.
   * Must include one of the following optional fields:
   * - royalty
   * - royaltyCustom
   * - royaltyAmount
   * @param paymentInfo 
   * @returns 
   */
  async payTransaction(paymentInfo: PaymentInformation): Promise<PayTransactionGenerateResponse | void> {
    try {
      const res = await fetch(this.endpoint + "/pay-transaction", {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey
        },
        body: JSON.stringify(paymentInfo)
      });
      if (res.ok) {
        const body: PayTransactionGenerateResponse = await res.json();
        return body;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Submit a signed royalty payment transaction
   * @param payTransaction 
   * @returns 
   */
  async submitPayTransaction(payTransaction: PayTransaction): Promise<PayTransactionSubmitResponse | void> {
    try {
      const res = await fetch(this.endpoint + "/pay-submit", {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey
        },
        body: JSON.stringify(payTransaction)
      });
      if (res.ok) {
        const body: PayTransactionSubmitResponse = await res.json();
        return body;
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Override last sale royalties
   * @param paymentInfo 
   * @returns 
   */
  async overrideRoyalties(paymentInfo: PaymentOverrideInformation): Promise<PayTransactionSubmitResponse | void> {
    try {
      const res = await fetch(this.endpoint + "/pay-override", {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey
        },
        body: JSON.stringify(paymentInfo)
      });
      if (res.ok) {
        const body: PayTransactionSubmitResponse = await res.json();
        return body;
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export const ScalpRoyaltiesSDK = new ScalpRoyaltiesSDKClass();
