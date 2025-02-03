import {
  CandyGuard,
  CandyMachine,
  DefaultGuardSet,
  GuardGroup,
  GuardSet,
  SolPayment,
} from '@metaplex-foundation/mpl-core-candy-machine';
import { StartDate } from '@metaplex-foundation/mpl-core-candy-machine/dist/src/generated';
import { Button, Card, Paper, Stack, Text } from '@mantine/core';

export function CollectionUiMint({
  candyMachine,
  candyGuard,
  loading,
  mint,
}: {
  candyMachine: CandyMachine;
  candyGuard: CandyGuard;
  loading: boolean;
  mint: (guard: DefaultGuardSet) => Promise<boolean>;
}) {
  const itemsLoaded = candyMachine.itemsLoaded || 0;
  const itemsRedeemed = candyMachine.itemsRedeemed || 0;
  const itemsRemaining = itemsLoaded - Number(itemsRedeemed);
  const groups = candyGuard.groups ?? [];
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
        <Stack>
          {groups.length ? (
            groups.map((group) => (
              <CollectionUiGroup key={group.label} group={group} loading={loading} mint={mint} />
            ))
          ) : (
            <CollectionUiGuard loading={loading} mint={mint} guard={candyGuard.guards} />
          )}
        </Stack>
        {/*<Button*/}
        {/*  loading={loading}*/}
        {/*  radius="md"*/}
        {/*  variant="outline"*/}
        {/*  color="green"*/}
        {/*  size="md"*/}
        {/*  fullWidth*/}
        {/*  mt="md"*/}
        {/*  onClick={mint}*/}
        {/*>*/}
        {/*  Mint*/}
        {/*</Button>*/}
      </Card.Section>
      <pre>{JSON.stringify({ candyGuard, candyMachine }, null, 2)}</pre>
    </Card>
  );
}

function CollectionUiGuard({
  loading,
  mint,
  guard,
}: {
  loading: boolean;
  mint: (guard: DefaultGuardSet) => Promise<boolean>;
  guard: DefaultGuardSet;
}) {
  const { canMint, startDate } = getStartDate(guard);
  const solPaymentGuard = hasSolPaymentGuard(guard);

  return (
    <Paper p="md" radius="md">
      {startDate ? (
        <Text fz="md" fw={500}>
          Starts at {new Date(startDate).toLocaleString()}
        </Text>
      ) : null}{' '}
      {solPaymentGuard ? <pre>{JSON.stringify(solPaymentGuard, null, 2)}</pre> : null}
      <Button
        disabled={!canMint}
        loading={loading}
        radius="md"
        variant="outline"
        color="green"
        size="md"
        fullWidth
        mt="md"
        onClick={() => mint(guard)}
      >
        {canMint ? 'Mint' : `Mint (not started yet)`}
      </Button>
      <pre>{JSON.stringify(filterGuards(guard), null, 2)}</pre>
    </Paper>
  );
}

function CollectionUiGroup({
  loading,
  mint,
  group,
}: {
  loading: boolean;
  mint: (guard: DefaultGuardSet) => Promise<boolean>;
  group: GuardGroup<DefaultGuardSet>;
}) {
  const { canMint, startDate } = getStartDate(group.guards);
  const solPaymentGuard = hasSolPaymentGuard(group.guards);

  return (
    <Paper p="md" radius="md">
      <Text fz="xl" fw={500} key={group.label}>
        {group.label}
      </Text>
      {startDate ? (
        <Text fz="md" fw={500}>
          Starts at {new Date(startDate).toLocaleString()}
        </Text>
      ) : null}{' '}
      {solPaymentGuard ? <pre>{JSON.stringify(solPaymentGuard, null, 2)}</pre> : null}
      <Button
        disabled={!canMint}
        loading={loading}
        radius="md"
        variant="outline"
        color="green"
        size="md"
        fullWidth
        mt="md"
        onClick={() => mint(group.guards)}
      >
        {canMint ? 'Mint' : `Mint (not started yet)`}
      </Button>
      <pre>{JSON.stringify(filterGuards(group.guards), null, 2)}</pre>
    </Paper>
    // <Paper key={group.label} p="md" radius="md">
    //   <Text fz="md" fw={500} key={group.label}>
    //     {group.label}
    //   </Text>
    //
    //   <pre>{JSON.stringify(group, null, 2)}</pre>
    // </Paper>
  );
}

function hasStartDateGuard(guards: DefaultGuardSet): StartDate | null {
  return guards.startDate?.__option === 'Some' ? guards.startDate.value : null;
}

function hasSolPaymentGuard(guards: DefaultGuardSet): SolPayment | null {
  return guards.solPayment?.__option === 'Some' ? guards.solPayment.value : null;
}

function filterGuards(guards: DefaultGuardSet): GuardSet {
  const result: GuardSet = {};
  // Filter out guards with __option None
  Object.keys(guards).forEach((key) => {
    if (guards[key].__option === 'None') {
      return;
    }
    result[key] = guards[key];
  });
  return result;
}

function getStartDate(guards: DefaultGuardSet) {
  const startDateGuard = hasStartDateGuard(guards);
  const startDateSeconds = startDateGuard?.date ? Number(startDateGuard.date) * 1000 : null;
  const startDate = startDateSeconds ? new Date(startDateSeconds).getTime() : null;
  const canMint = startDate ? Date.now() >= startDate : true;

  return {
    canMint,
    startDate,
  };
}
