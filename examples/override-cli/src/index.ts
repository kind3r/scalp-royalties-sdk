import { Option, program } from "commander";
import pkg from "../package.json";
import { PayTransactionSubmitStatus, RoyaltySimple, ScalpRoyaltiesSDK } from "@scalp/royalties";
import fetch from "node-fetch";

// @ts-ignore We need to cover for the missing fetch in node
global.fetch = fetch;

program.name("override-cli")
  .description("Override transaction royalty payment")
  .version(pkg.version)
  .addOption(new Option("-a, --api-key <string>", "ScalpEmpire royalties API key").env("SE_API_KEY").makeOptionMandatory(true))
  .addOption(new Option("-s, --secret-key <string>", "ScalpeEmpire royalties secret key").default("").env("SE_SECRET_KEY"))
  .addOption(new Option("-m, --mints <string...>", "Mints to override royalties payments").default([]));

async function doWork() {
  program.parse();
  const options = program.opts();
  if (options.mints.length === 0) {
    console.log(`Must specify at least one mint`);
    return;
  }

  ScalpRoyaltiesSDK.setApiKey(options.apiKey);

  const mintsResponse = await ScalpRoyaltiesSDK.checkMints(options.mints);
  if (typeof mintsResponse !== "undefined") {
    if (mintsResponse.length > 0) {
      if (mintsResponse.length !== options.mints.length) {
        console.warn(`The number of requested mints (${options.mints.length}) differs from the number of found mints (${mintsResponse.length})`);
      }

      for (const mint of mintsResponse) {
        if (mint.sale) {
          const paymentParams = {
            mint: mint.mint,
            saleTransaction: mint.sale.transaction,
            secretKey: options.secretKey,
            royalty: RoyaltySimple.Full
          };
          const response = await ScalpRoyaltiesSDK.overrideRoyalties(paymentParams);
          if (typeof response === "undefined" || response.status !== PayTransactionSubmitStatus.Confirmed) {
            console.error(`Could not override royalties for ${mint.mint}`);
            console.log(response);
          } else {
            console.log(`Override successful for ${mint.mint}`);
          }
        }
      }
    } else {
      console.error(`No mints found`);
    }
  } else {
    console.error(`Checking mints failed`);
  }
}

doWork();