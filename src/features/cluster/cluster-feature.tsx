import { Container, Stack, Text, Title } from '@mantine/core';
import { ClusterUiModal, ClusterUiTable } from './ui';

export default function ClusterFeature() {
  return (
    <Container py="xl" my="xl">
      <Stack align="center" gap="xl">
        <Title order={2}>Clusters</Title>
        <Text>Manage and select your Solana clusters</Text>
        <ClusterUiModal />
      </Stack>

      <ClusterUiTable />
    </Container>
  );
}
