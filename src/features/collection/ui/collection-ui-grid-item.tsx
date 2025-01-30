import { Link } from 'react-router-dom';
import { Anchor, AspectRatio, Card, Group, Image, UnstyledButton } from '@mantine/core';
import { Collection } from '../data-access';

export function CollectionUiGridItem({ collection }: { collection: Collection }) {
  return (
    <Card withBorder radius="lg" shadow="lg">
      <Card.Section>
        <UnstyledButton component={Link} to={collection.id}>
          <AspectRatio ratio={16 / 9} mx="auto">
            <Image src={collection.imageUrl} alt={collection.name} />
          </AspectRatio>
        </UnstyledButton>
      </Card.Section>

      <Card.Section className="classes.section" m="md" mb={0}>
        <Group justify="space-between">
          <Anchor component={Link} to={collection.id} fz="xl" fw={700}>
            {collection.name}
          </Anchor>
        </Group>
      </Card.Section>
    </Card>
  );
}
