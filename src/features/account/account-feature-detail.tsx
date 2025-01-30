import { useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useParams } from 'react-router-dom';
import { Container, Stack } from '@mantine/core';
import { ExplorerLink } from '@/features/cluster/ui/explorer-link';
import {
  AccountBalance,
  AccountButtons,
  AccountTokens,
  AccountTransactions,
  ellipsify,
} from './ui/account-ui';

export default function AccountFeatureDetail() {
  const params = useParams();
  const address = useMemo(() => {
    if (!params.address) {
      return;
    }
    try {
      return new PublicKey(params.address);
    } catch (e) {
      console.log(`Invalid public key`, e);
    }
  }, [params]);
  if (!address) {
    return <div>Error loading account</div>;
  }

  return (
    <Container py="xl" my="xl">
      <Stack align="center" gap="xl">
        <AccountBalance order={2} address={address} />
        <ExplorerLink path={`account/${address}`} label={ellipsify(address.toString())} />
        <AccountButtons address={address} />
      </Stack>

      <Stack>
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </Stack>
    </Container>
  );
}
