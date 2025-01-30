import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { useParams } from 'react-router-dom';
import { Alert, Container, Loader } from '@mantine/core';
import { useGetAsset, useGetCollection } from './data-access';
import { CollectionUiCard } from './ui/collection-ui-card';

export default function CollectionDetailFeature() {
  const { collection } = useParams() as { collection: string };
  const query = useGetCollection({ collection });

  return (
    <Container>
      {query.isLoading ? (
        <Loader />
      ) : query.data ? (
        <CollectionDetail collection={query.data} />
      ) : (
        <Alert color="red" title="Error">
          Collection not found
        </Alert>
      )}
    </Container>
  );
}

function CollectionDetail({ collection }: { collection: CollectionV1 }) {
  const query = useGetAsset(collection);

  return query.isPending ? (
    <Loader />
  ) : query.data ? (
    <CollectionUiCard asset={query.data} />
  ) : (
    <Alert color="red">Error loading Asset</Alert>
  );
}
