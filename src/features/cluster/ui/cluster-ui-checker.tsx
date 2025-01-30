import { ReactNode } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Group, Text } from '@mantine/core';
import { useCluster } from '@/features/cluster/data-access/cluster-provider';

export function ClusterUiChecker({ children }: { children: ReactNode }) {
  const { cluster } = useCluster();
  const { connection } = useConnection();

  const query = useQuery({
    queryKey: ['version', { cluster, endpoint: connection.rpcEndpoint }],
    queryFn: () => connection.getVersion(),
    retry: 1,
  });
  if (query.isLoading) {
    return null;
  }
  if (query.isError || !query.data) {
    return (
      <Alert
        color="yellow"
        styles={{
          root: { display: 'flex', justifyContent: 'center' },
          title: { justifyContent: 'center' },
        }}
        title="Error connecting to cluster"
      >
        <Group justify="center">
          <Text>
            Error connecting to cluster <strong>{cluster.name}</strong>
          </Text>
          <Button variant="light" color="yellow" size="xs" onClick={() => query.refetch()}>
            Refresh
          </Button>
        </Group>
      </Alert>
    );
  }
  return children;
}
