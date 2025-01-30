import { ReactNode, Suspense } from 'react';
import { NavLink as Link } from 'react-router-dom';
import { AppShell, Burger, Group, Loader, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ClusterUiChecker } from '@/features/cluster/ui';

export function AppLayout({ children, profile }: { children: ReactNode; profile: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Group justify="space-between" align="center" h="100%" px="md">
          <Group justify="center" align="center">
            <Text component={Link} to="/" size="xl" fw={700}>
              Placeholder
            </Text>
          </Group>
          <Group justify="center" align="center">
            {profile}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink component={Link} to="/" label="Home" />
        <NavLink component={Link} to="/account" label="Account" />
        <NavLink component={Link} to="/clusters" label="Clusters" />
      </AppShell.Navbar>

      <AppShell.Main>
        <Suspense fallback={<Loader />}>
          <ClusterUiChecker>
            <div />
          </ClusterUiChecker>
          {children}
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
