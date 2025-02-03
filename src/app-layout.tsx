import { ReactNode, Suspense } from 'react';
import { NavLink as Link } from 'react-router-dom';
import { AppShell, Burger, Group, Loader, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ClusterUiChecker } from '@/features/cluster/ui';

export interface AppLayoutLink {
  label: string;
  to: string;
}

export function AppLayout({
  children,
  links,
  profile,
}: {
  children: ReactNode;
  links: AppLayoutLink[];
  profile: ReactNode;
}) {
  const [opened, { toggle, close }] = useDisclosure();
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
        <Group justify="space-between" align="center" h="100%" px="md">
          <Group justify="center" align="center" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text component={Link} to="/" size="xl" fw={700}>
              Scaffold
            </Text>
          </Group>
          <Group justify="center" align="center">
            {profile}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {links.map((link) => (
          <NavLink
            key={link.to}
            component={Link}
            to={link.to}
            label={link.label}
            onClick={() => {
              close();
            }}
          />
        ))}
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
