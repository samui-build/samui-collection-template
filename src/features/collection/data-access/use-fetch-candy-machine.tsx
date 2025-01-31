import { fetchCandyGuard, fetchCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import { PublicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';
import { useUmi } from '@/features/solana/umi-provider';

export function useFetchCandyMachine(candyMachine: PublicKey) {
  const { umi } = useUmi();
  return useQuery({
    queryKey: ['get-candy-machine', { candyMachine: candyMachine.toString() }],
    queryFn: async () => {
      return fetchCandyMachine(umi, candyMachine, { commitment: 'confirmed' });
    },
  });
}

export function useFetchCandyGuard(candyGuard: PublicKey) {
  const { umi } = useUmi();
  return useQuery({
    queryKey: ['get-candy-guard', { candyGuard: candyGuard.toString() }],
    queryFn: async () => {
      return fetchCandyGuard(umi, candyGuard, { commitment: 'confirmed' });
    },
  });
}
