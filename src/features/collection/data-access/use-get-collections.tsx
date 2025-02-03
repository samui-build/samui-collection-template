import { fetchAllCollectionV1 } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';
import { collectionConfigs } from '@/features/collection/data-access/collection-configs';
import { useUmi } from '@/features/solana/umi-provider';

export function useGetCollections() {
  const { umi } = useUmi();
  const mints = collectionConfigs.map((config) => publicKey(config.collectionMint));
  return useQuery({
    queryKey: ['get-collections'],
    queryFn: async () => fetchAllCollectionV1(umi, mints),
  });
}
