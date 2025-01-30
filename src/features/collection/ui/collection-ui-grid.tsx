import { SimpleGrid } from '@mantine/core';
import { Collection } from '../data-access';
import { CollectionUiGridItem } from './collection-ui-grid-item';

export function CollectionUiGrid({ collections }: { collections: Collection[] }) {
  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
      {collections.map((collection) => (
        <CollectionUiGridItem key={collection.id} collection={collection} />
      ))}
    </SimpleGrid>
  );
}
