import { useUmi } from '@/features/solana/umi-provider'
import { fetchCollectionV1 } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi'
import { useQuery } from '@tanstack/react-query'

export function useGetCollection({ collection }: { collection: string }) {
  const { umi } = useUmi()

  return useQuery({
    queryKey: ['GetCollection', umi.rpc.getEndpoint(), collection],
    queryFn: async () => {
      return fetchCollectionV1(umi, publicKey(collection))
    },
  })
}
