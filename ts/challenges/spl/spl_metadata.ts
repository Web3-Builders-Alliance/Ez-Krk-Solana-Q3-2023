import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import wallet from "../../../keys/wba-wallet.json";
import {
  DataV2,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Define our Mint address
const mint = new PublicKey("9Nw4cjn6fNcidKgqQoTH3igFuCVsLr2vrRSBrBSbYF23");

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Create PDA for token metadata
const metadata_seeds = [
  Buffer.from("metadata"),
  token_metadata_program_id.toBuffer(),
  mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
  metadata_seeds,
  token_metadata_program_id
);

const ON_CHAIN_METADATA = {
  name: "KRK WL",
  symbol: "KRKWL",
  uri: "https://raw.githubusercontent.com/krk-finance/cdn.krk.finance/main/metadata.json", // this is the uri to the offchain metadata
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
} as DataV2;

(async () => {
  try {
    const tx = new Transaction().add(
      createCreateMetadataAccountV3Instruction(
        {
          metadata: metadata_pda,
          mint: mint,
          mintAuthority: keypair.publicKey,
          payer: keypair.publicKey,
          updateAuthority: keypair.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: ON_CHAIN_METADATA,
            isMutable: true,
            collectionDetails: null,
          },
        }
      )
    );
    const signature = await sendAndConfirmTransaction(connection, tx, [
      keypair,
    ]);
    console.log(
      `Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
