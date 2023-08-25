import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import { Commitment, Connection, Keypair } from "@solana/web3.js";
import { readFile } from "fs/promises";
import wallet from "../../keys/wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair))
  .use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000,
    })
  );

(async () => {
  try {
    const image = await readFile("./challenges/4/generug.png");
    const metaplexImage = toMetaplexFile(image, "coolRug.png");
    const imgUri = await metaplex.storage().upload(metaplexImage);
    console.log(
      `You've uploaded your image:\n\n${imgUri}\n\nSave this URI so you can use it to mint an NFT!`
    );
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
