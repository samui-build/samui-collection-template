import { useState } from 'react';
import { Button, Modal, Select, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ClusterNetwork, useCluster } from '@/features/cluster/data-access/cluster-provider';

export function ClusterUiModal() {
  const { addCluster } = useCluster();
  const [opened, { close, open }] = useDisclosure(false);
  const [name, setName] = useState('');
  const [network, setNetwork] = useState<ClusterNetwork | undefined>();
  const [endpoint, setEndpoint] = useState('');

  return (
    <>
      <Button onClick={open}>Add Cluster</Button>
      <Modal opened={opened} onClose={close} title="Add Cluster">
        <TextInput
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextInput
          type="text"
          placeholder="Endpoint"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <Select
          value={network}
          onChange={(value) => setNetwork(value as ClusterNetwork)}
          data={[
            { label: 'Devnet', value: ClusterNetwork.Devnet },
            { label: 'Testnet', value: ClusterNetwork.Testnet },
            { label: 'Mainnet', value: ClusterNetwork.Mainnet },
          ]}
         />
        <Button
          onClick={() => {
            addCluster({ name, network, endpoint });
            close();
          }}
        >
          Save
        </Button>
      </Modal>
    </>
  );
}
