import { Anchor, AnchorProps } from '@mantine/core';
import { useCluster } from '@/features/cluster/data-access/cluster-provider';

export function ExplorerLink({
  path,
  label,
  ...props
}: { path: string; label: string } & AnchorProps) {
  const { getExplorerUrl } = useCluster();
  return (
    <Anchor href={getExplorerUrl(path)} target="_blank" rel="noopener noreferrer" {...props}>
      {label}
    </Anchor>
  );
}
