import { AssetV1 } from '@metaplex-foundation/mpl-core';
import { useQuery } from '@tanstack/react-query';

export function useGetAsset(asset: Pick<AssetV1, 'publicKey' | 'uri'>) {
  return useQuery({
    queryKey: ['fetch-asset-json', asset.publicKey],
    queryFn: async () => {
      // FIXME: Figure out proper typing instead of 'as AssetInfo'
      return (await (await fetch(asset.uri)).json()) as AssetInfo;
    },
  });
}

export interface AssetInfo {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  attributes: [];
  properties: {
    files: [{ uri: string; type: string }];
    creators: [{ address: string; share: number }];
    category: string;
  };
}
