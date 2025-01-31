import { CandyGuard, CandyMachine } from '@metaplex-foundation/mpl-core-candy-machine';
import { Button, Card, Text } from '@mantine/core';

export function CollectionUiMint({
  candyMachine,
  candyGuard,
  loading,
  mint,
}: {
  candyMachine: CandyMachine;
  candyGuard: CandyGuard;
  loading?: boolean;
  mint: () => Promise<boolean>;
}) {
  const itemsLoaded = candyMachine.itemsLoaded || 0;
  const itemsRedeemed = candyMachine.itemsRedeemed || 0;
  const itemsRemaining = itemsLoaded - Number(itemsRedeemed);
  return (
    <Card
      withBorder
      radius="lg"
      shadow="lg"
      display="flex"
      style={{ flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <Card.Section p="md" pb={0}>
        <Text fz="xl" fw={700}>
          Mint Asset
        </Text>
      </Card.Section>
      <Card.Section p="md" style={{ flex: 1 }}>
        <Text fz="md" fw={500}>
          {itemsRemaining} / {itemsLoaded} items remaining
        </Text>
      </Card.Section>

      <Card.Section m="md" mb="xs">
        <Button
          loading={loading}
          radius="md"
          variant="outline"
          color="green"
          size="md"
          fullWidth
          mt="md"
          onClick={mint}
        >
          Mint
        </Button>
      </Card.Section>
      <pre>{JSON.stringify({ candyGuard, candyMachine }, null, 2)}</pre>
    </Card>
  );
}
