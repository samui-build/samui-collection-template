import { Container } from '@mantine/core';
import { useGetCollections } from '@/features/collection/data-access/use-get-collections';
import { CollectionUiGrid } from './ui/collection-ui-grid';

export default function CollectionGridFeature() {
  const { items } = useGetCollections();
  return (
    <Container>
      <CollectionUiGrid collections={items} />
    </Container>
  );
}
