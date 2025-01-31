import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { CandyMachine, mintV1 } from '@metaplex-foundation/mpl-core-candy-machine';
import { generateSigner } from '@metaplex-foundation/umi';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { sendAndConfirmWalletAdapter } from '@/features/collection/data-access/send-and-confirm-wallet-adapter';
import { useUmi } from '@/features/solana/umi-provider';

export function useMintAsset({ collection }: { collection: CollectionV1 }) {
  const { umi } = useUmi();
  const { connection } = useConnection();

  return useMutation({
    mutationFn: async (cm: CandyMachine) => {
      const asset = generateSigner(umi);

      const tx = mintV1(umi, {
        candyGuard: cm.mintAuthority,
        candyMachine: cm.publicKey,
        asset,
        collection: collection.publicKey,
        // mintArgs: {
        //  solPayment: { value: 1, destination: candyGuard },
        // },
      });

      const { signature, confirmation } = await sendAndConfirmWalletAdapter(umi, tx, connection, {
        skipPreflight: true,
      });

      console.log({ signature, confirmation });
      return true;
    },
  });
}
