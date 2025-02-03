import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import {
  CandyGuard,
  CandyMachine,
  DefaultGuardSet,
  mintV1,
} from '@metaplex-foundation/mpl-core-candy-machine';
import { generateSigner, none, some } from '@metaplex-foundation/umi';
import { useConnection } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';
import { uiToastLink } from '@/features/account/data-access/account-data-access';
import { useCluster } from '@/features/cluster/data-access/cluster-provider';
import { sendAndConfirmWalletAdapter } from '@/features/collection/data-access/send-and-confirm-wallet-adapter';
import { useUmi } from '@/features/solana/umi-provider';

export function useMintAsset({ collection }: { collection: CollectionV1 }) {
  const { umi } = useUmi();
  const { connection } = useConnection();
  const { getExplorerUrl } = useCluster();

  return useMutation({
    mutationFn: async ({
      cm,
      cg,
      guard,
    }: {
      cm: CandyMachine;
      cg: CandyGuard;
      guard: DefaultGuardSet;
    }) => {
      const asset = generateSigner(umi);
      const group = cg.groups[0];
      const solPayment = guard.solPayment.__option === 'Some' ? guard.solPayment : null;

      const tx = mintV1(umi, {
        candyGuard: cm.mintAuthority,
        candyMachine: cm.publicKey,
        asset,
        collection: collection.publicKey,
        group: group ? some(group.label) : none(),
        mintArgs: {
          solPayment: solPayment ? some({ destination: solPayment?.value.destination }) : null,
        },
      });

      const { signature, confirmation } = await sendAndConfirmWalletAdapter(umi, tx, connection, {
        skipPreflight: true,
      });
      uiToastLink({ link: getExplorerUrl(`tx/${signature}`), label: 'View Transaction' });
      console.log({ signature, confirmation });
      return true;
    },
  });
}
