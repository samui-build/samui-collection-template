import { Link } from 'react-router-dom';
import { Anchor, AspectRatio, Card, Group, Image, Text, UnstyledButton } from '@mantine/core';
import { AssetInfo } from '../data-access';

export function CollectionUiCard({ asset, to }: { asset: AssetInfo; to?: string | unknown }) {
  const image = asset?.image ? (
    <AspectRatio ratio={1} mx="auto">
      <Image src={asset.image} alt={asset.name} />
    </AspectRatio>
  ) : (
    <Text> No image </Text>
  );

  return (
    <Card withBorder radius="lg" shadow="lg">
      <Card.Section>
        {to ? (
          <UnstyledButton component={Link} to={to}>
            {image}
          </UnstyledButton>
        ) : (
          image
        )}
      </Card.Section>
      <Card.Section m="md" mb="xs">
        <Group justify="space-between">
          {to ? (
            <Anchor component={Link} to={to} fz="xl" fw={700}>
              {asset.name}
            </Anchor>
          ) : (
            <Text fz="xl" fw={700}>
              {asset.name}
            </Text>
          )}
        </Group>
        {asset?.description ? (
          <Text fz="sm" c="dimmed" mt="xs">
            {asset.description}
          </Text>
        ) : null}
      </Card.Section>
    </Card>
  );
}
