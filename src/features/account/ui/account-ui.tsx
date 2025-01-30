import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useQueryClient } from '@tanstack/react-query';
import { LucideRefreshCw } from 'lucide-react';
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  ButtonProps,
  Group,
  Loader,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  TextProps,
  Title,
  TitleProps,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCluster } from '@/features/cluster/data-access/cluster-provider';
import { ExplorerLink } from '@/features/cluster/ui';
import {
  useGetBalance,
  useGetSignatures,
  useGetTokenAccounts,
  useGetTokenBalance,
  useRequestAirdrop,
  useTransferSol,
} from '../data-access/account-data-access';

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return `${str.substring(0, len)}..${str.substring(str.length - len, str.length)}`;
  }
  return str;
}

export function AccountBalance({ address, ...props }: { address: PublicKey } & TitleProps) {
  const query = useGetBalance({ address });

  return (
    <Title onClick={() => query.refetch()} {...props}>
      {query.data ? <BalanceSol balance={query.data} /> : '...'} SOL
    </Title>
  );
}

export function AccountChecker() {
  const { publicKey } = useWallet();
  if (!publicKey) {
    return null;
  }
  return <AccountBalanceCheck address={publicKey} />;
}

export function AccountBalanceCheck({ address }: { address: PublicKey }) {
  const { cluster } = useCluster();
  const query = useGetBalance({ address });
  const requestAirdrop = useRequestAirdrop({ address });

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
        title="Account not found"
      >
        <Group justify="center">
          <Text>
            You are connected to <strong>{cluster.name}</strong> but your account is not found on
            this cluster.
          </Text>
          <Button
            variant="light"
            color="yellow"
            size="xs"
            onClick={() => requestAirdrop.mutateAsync('1').catch((err) => console.log(err))}
          >
            Request Airdrop
          </Button>
        </Group>
      </Alert>
    );
  }
  return null;
}

export function AccountButtons({ address }: { address: PublicKey }) {
  const wallet = useWallet();
  const { cluster } = useCluster();

  return (
    <Group gap={2}>
      <ModalAirdrop disabled={cluster.network?.includes('mainnet')} address={address} />
      <ModalSend disabled={wallet.publicKey?.toString() !== address.toString()} address={address} />
      <ModalReceive address={address} />
    </Group>
  );
}

export function AccountTokens({ address }: { address: PublicKey }) {
  const [showAll, setShowAll] = useState(false);
  const query = useGetTokenAccounts({ address });
  const client = useQueryClient();
  const items = useMemo(() => {
    if (showAll) {
      return query.data;
    }
    return query.data?.slice(0, 5);
  }, [query.data, showAll]);

  return (
    <div>
      <Stack>
        <Group justify="space-between">
          <Text size="xl">Token Accounts</Text>
          <Group>
            {query.isLoading ? (
              <Loader />
            ) : (
              <ActionIcon
                variant="outline"
                onClick={async () => {
                  await query.refetch();
                  await client.invalidateQueries({
                    queryKey: ['getTokenAccountBalance'],
                  });
                }}
              >
                <LucideRefreshCw size={16} />
              </ActionIcon>
            )}
          </Group>
        </Group>
        {query.isError && (
          <Alert color="red" title="An error occurred">
            Error: ${query.error?.message.toString()}
          </Alert>
        )}

        {query.isSuccess && (
          <div>
            {query.data.length === 0 ? (
              <Alert color="blue" title="No token accounts found">
                Token accounts will appear here when you send or receive tokens.
              </Alert>
            ) : (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Public Key</Table.Th>
                    <Table.Th>Mint</Table.Th>
                    <Table.Th ta="right">Balance</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {items?.map(({ account, pubkey }) => (
                    <Table.Tr key={pubkey.toString()}>
                      <Table.Td>
                        <ExplorerLink
                          ff="monospace"
                          label={ellipsify(pubkey.toString())}
                          path={`account/${pubkey.toString()}`}
                        />
                      </Table.Td>
                      <Table.Td>
                        <ExplorerLink
                          ff="monospace"
                          label={ellipsify(account.data.parsed.info.mint)}
                          path={`account/${account.data.parsed.info.mint.toString()}`}
                        />
                      </Table.Td>
                      <Table.Td align="right">
                        <AccountTokenBalance ff="monospace" address={pubkey} />
                      </Table.Td>
                    </Table.Tr>
                  ))}

                  {(query.data?.length ?? 0) > 5 && (
                    <Table.Tr>
                      <Table.Td colSpan={4} align="center">
                        <Button onClick={() => setShowAll(!showAll)}>
                          {showAll ? 'Show Less' : 'Show All'}
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            )}
          </div>
        )}
      </Stack>
    </div>
  );
}

export function AccountTokenBalance({ address, ...props }: { address: PublicKey } & TextProps) {
  const query = useGetTokenBalance({ address });
  return query.isLoading ? (
    <Loader />
  ) : query.data ? (
    <Text {...props}>{query.data?.value.uiAmount}</Text>
  ) : (
    <div>Error</div>
  );
}

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address });
  const [showAll, setShowAll] = useState(false);

  const items = useMemo(() => {
    if (showAll) {
      return query.data;
    }
    return query.data?.slice(0, 5);
  }, [query.data, showAll]);

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl">Transaction History</Text>
        {query.isLoading ? (
          <Loader />
        ) : (
          <ActionIcon variant="outline" onClick={() => query.refetch()}>
            <LucideRefreshCw size={16} />
          </ActionIcon>
        )}
      </Group>
      {query.isError && (
        <Alert color="red" title="An error occurred">
          Error: ${query.error?.message.toString()}
        </Alert>
      )}
      {query.isSuccess && query.data.length === 0 ? (
        <Alert color="blue" title="No transactions found.">
          Transactions will appear here when you send or receive tokens.
        </Alert>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Signature</Table.Th>
              <Table.Th align="right">Slot</Table.Th>
              <Table.Th>Block Time</Table.Th>
              <Table.Th ta="right">Result</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items?.map((item) => (
              <Table.Tr key={item.signature}>
                <Table.Th>
                  <ExplorerLink
                    ff="monospace"
                    path={`tx/${item.signature}`}
                    label={ellipsify(item.signature, 8)}
                  />
                </Table.Th>
                <Table.Td>
                  <ExplorerLink
                    ff="monospace"
                    path={`block/${item.slot}`}
                    label={item.slot.toString()}
                  />
                </Table.Td>
                <Table.Td>{/*<UiTime date={new Date((item.blockTime ?? 0) * 1000)} />*/}</Table.Td>
                <Table.Td align="right">
                  {item.err ? (
                    <Badge color="red" title={JSON.stringify(item.err)}>
                      Failed
                    </Badge>
                  ) : (
                    <Badge color="green">Success</Badge>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
            {(query.data?.length ?? 0) > 5 && (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">
                  <Button onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show Less' : 'Show All'}
                  </Button>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}

function BalanceSol({ balance }: { balance: number }) {
  return <span>{Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000}</span>;
}

function ModalReceive({ address, ...props }: { address: PublicKey }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open} {...props}>
        Receive
      </Button>
      <Modal opened={opened} onClose={close} title="Receive">
        <p>You can receive assets by sending them to your public key:</p>
        <code>{address.toString()}</code>
      </Modal>
    </>
  );
}

function ModalAirdrop({ address, ...props }: ButtonProps & { address: PublicKey }) {
  const [opened, { close, open }] = useDisclosure(false);
  const mutation = useRequestAirdrop({ address });
  const [amount, setAmount] = useState('2');

  return (
    <>
      <Button onClick={open} {...props}>
        Airdrop
      </Button>
      <Modal opened={opened} onClose={close} title="Airdrop">
        <TextInput
          disabled={mutation.isPending}
          type="number"
          step="any"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          disabled={!amount || mutation.isPending}
          onClick={() => {
            mutation.mutateAsync(amount).then(() => close());
          }}
        >
          Request Airdrop
        </Button>
      </Modal>
    </>
  );
}

function ModalSend({ address, ...props }: ButtonProps & { address: PublicKey }) {
  const [opened, { close, open }] = useDisclosure(false);
  const wallet = useWallet();
  const mutation = useTransferSol({ address });
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('1');

  if (!address || !wallet.sendTransaction) {
    return <div>Wallet not connected</div>;
  }

  return (
    <>
      <Button onClick={open} {...props}>
        Send
      </Button>
      <Modal opened={opened} onClose={close} title="Send">
        <TextInput
          disabled={mutation.isPending}
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <TextInput
          disabled={mutation.isPending}
          type="number"
          step="any"
          min="0"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          disabled={!destination || !amount || mutation.isPending}
          onClick={() => {
            mutation
              .mutateAsync({
                destination: new PublicKey(destination),
                amount,
              })
              .then(() => close());
          }}
        >
          Send
        </Button>
      </Modal>
    </>
  );
}
