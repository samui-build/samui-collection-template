import { AspectRatio, Card, Group, Image, Text } from '@mantine/core';
import { AssetInfo } from '../data-access';

export function CollectionUiCard({ asset }: { asset: AssetInfo }) {
  return (
    <Card withBorder radius="lg" shadow="lg">
      {asset?.image ? (
        <Card.Section>
          <AspectRatio ratio={1} mx="auto">
            <Image src={asset.image} alt={asset.name} />
          </AspectRatio>
        </Card.Section>
      ) : null}

      <Card.Section m="md" mb="xs">
        <Group justify="space-between">{asset.name}</Group>
        {asset?.description ? (
          <Text fz="sm" c="dimmed" mt="xs">
            {asset.description}
          </Text>
        ) : null}
      </Card.Section>
    </Card>
  );
}
