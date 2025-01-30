import { LucideWifiHigh, LucideWifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Menu } from '@mantine/core';
import { useCluster } from '@/features/cluster/data-access/cluster-provider';

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>{cluster.name}</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {clusters.map((item) => (
          <Menu.Item
            key={item.name}
            onClick={() => setCluster(item)}
            leftSection={item.active ? <LucideWifiHigh /> : <LucideWifiOff />}
          >
            {item.name}
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Menu.Item component={Link} to="/clusters">
          Manage Clusters
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
