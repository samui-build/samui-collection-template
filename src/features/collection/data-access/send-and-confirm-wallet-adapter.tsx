import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox';
import { TransactionBuilder } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { Connection, SendTransactionError } from '@solana/web3.js';
import { Umi } from '@/features/solana/get-umi';

export async function sendAndConfirmWalletAdapter(
  umi: Umi,
  tx: TransactionBuilder,
  connection: Connection,
  settings?: {
    commitment?: 'processed' | 'confirmed' | 'finalized';
    skipPreflight?: boolean;
  }
) {
  const blockhash = await umi.rpc.getLatestBlockhash({
    commitment: settings?.commitment || 'confirmed',
  });

  const transactions = tx
    .prepend(setComputeUnitPrice(umi, { microLamports: BigInt(100000) }))
    .setBlockhash(blockhash);

  const signedTx = await transactions.buildAndSign(umi);

  const signature = await umi.rpc
    .sendTransaction(signedTx, {
      preflightCommitment: settings?.commitment || 'confirmed',
      commitment: settings?.commitment || 'confirmed',
      skipPreflight: settings?.skipPreflight || false,
    })
    .catch(async (err) => {
      if (err instanceof SendTransactionError) {
        const logs = await (err as SendTransactionError).getLogs(connection);
        console.log('SendTransactionError', logs);
        throw err;
      } else {
        throw new Error(`Transaction failed: ${err}`);
      }
    });

  const confirmation = await umi.rpc.confirmTransaction(signature, {
    strategy: { type: 'blockhash', ...blockhash },
    commitment: settings?.commitment || 'confirmed',
  });
  const [deserialized] = base58.deserialize(signature);

  return {
    signature: deserialized,
    confirmation,
  };
}
