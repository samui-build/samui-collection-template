import { CollectionV1 } from '@metaplex-foundation/mpl-core';
import { publicKey, PublicKey } from '@metaplex-foundation/umi';
import { useParams } from 'react-router-dom';
import { Alert, Container, Loader, SimpleGrid } from '@mantine/core';
import { CollectionUiMint } from '@/features/collection/ui/collection-ui-mint';
import {
  collectionConfigs,
  useFetchCandyGuard,
  useFetchCandyMachine,
  useGetAsset,
  useGetCollection,
  useMintAsset,
} from './data-access';
import { CollectionUiCard } from './ui/collection-ui-card';

export default function CollectionDetailFeature() {
  const { collection } = useParams() as { collection: string };
  const query = useGetCollection({ collection });

  const found = collectionConfigs.find(({ collectionMint }) => collectionMint === collection);

  if (!found) {
    return (
      <Alert color="red" title="Error">
        Collection not found
      </Alert>
    );
  }

  return (
    <Container>
      {query.isLoading ? (
        <Loader />
      ) : query.data ? (
        <CollectionDetail
          candyMachine={publicKey(found.candyMachine)}
          candyGuard={publicKey(found.candyGuard)}
          collection={query.data}
        />
      ) : (
        <Alert color="red" title="Error">
          Collection not found
        </Alert>
      )}
    </Container>
  );
}

function CollectionDetail({
  candyMachine,
  candyGuard,
  collection,
}: {
  candyMachine: PublicKey;
  candyGuard: PublicKey;
  collection: CollectionV1;
}) {
  const query = useGetAsset(collection);
  const mutation = useMintAsset({ collection });
  const candyMachineQuery = useFetchCandyMachine(candyMachine);
  const candyGuardQuery = useFetchCandyGuard(candyGuard);

  const isLoading = query.isPending || candyMachineQuery.isPending || candyGuardQuery.isPending;

  return isLoading ? (
    <Loader />
  ) : query.data ? (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
      <CollectionUiCard asset={query.data} />
      {candyMachineQuery.data && candyGuardQuery.data ? (
        <CollectionUiMint
          candyMachine={candyMachineQuery.data}
          candyGuard={candyGuardQuery.data}
          loading={mutation.isPending}
          mint={(guard) =>
            mutation.mutateAsync({ cm: candyMachineQuery.data, cg: candyGuardQuery.data, guard })
          }
        />
      ) : null}
    </SimpleGrid>
  ) : (
    <Alert color="red">Error loading Asset</Alert>
  );
}
