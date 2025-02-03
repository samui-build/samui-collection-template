import { Container, Loader } from '@mantine/core';
import { useGetCollections } from '@/features/collection/data-access/use-get-collections';
import { CollectionUiGrid } from './ui/collection-ui-grid';

export default function CollectionGridFeature() {
  const query = useGetCollections();
  return (
    <Container>
      {query.isLoading ? <Loader /> : <CollectionUiGrid collections={query.data ?? []} />}
    </Container>
  );
}
