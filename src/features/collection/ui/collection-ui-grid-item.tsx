import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { Skeleton, Text } from '@mantine/core';
import { useGetAsset } from '@/features/collection/data-access';
import { CollectionUiCard } from '@/features/collection/ui/collection-ui-card';

export function CollectionUiGridItem({ collection }: { collection: CollectionV1 }) {
  const jsonInfo = useGetAsset(collection);
  const asset = jsonInfo.data;

  return (
    <Skeleton visible={jsonInfo.isLoading} radius="lg">
      {asset ? (
        <CollectionUiCard asset={asset} to={collection.publicKey} />
      ) : (
        <Text>Error loading collection info</Text>
      )}
    </Skeleton>
  );
}
