import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { SimpleGrid } from '@mantine/core';
import { CollectionUiGridItem } from './collection-ui-grid-item';

export function CollectionUiGrid({ collections }: { collections: CollectionV1[] }) {
  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
      {collections.map((collection) => (
        <CollectionUiGridItem key={collection.publicKey} collection={collection} />
      ))}
    </SimpleGrid>
  );
}
