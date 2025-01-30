import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import type { Commitment } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { WalletAdapter, walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'

export function getUmi({
  commitment = 'confirmed',
  endpoint,
  wallet,
}: {
  commitment?: Commitment
  endpoint: string
  wallet: WalletAdapter | null
}) {
  const umi = createUmi(endpoint, { commitment })

  umi.use(mplCandyMachine())

  if (!wallet) {
    return umi
  }

  umi.use(walletAdapterIdentity(wallet))

  return umi
}

export type Umi = ReturnType<typeof getUmi>
