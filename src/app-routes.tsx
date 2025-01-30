import { lazy } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Group } from '@mantine/core';
import { AppLayout } from '@/app-layout';
import { ClusterUiSelect } from '@/features/cluster/ui/cluster-ui-select';
import { WalletButton } from '@/features/solana/solana-provider';
import { UiThemeToggler } from '@/ui/ui-theme-toggler';
import { HomeFeature } from './features/home/home.feature';

const AccountList = lazy(() => import('@/features/account/account-feature-list'));
const AccountDetail = lazy(() => import('@/features/account/account-feature-detail'));
const ClusterFeature = lazy(() => import('@/features/cluster/cluster-feature'));

const router = createBrowserRouter([
  {
    element: (
      <AppLayout
        profile={
          <Group>
            <UiThemeToggler />
            <WalletButton />
            <ClusterUiSelect />
          </Group>
        }
      >
        <Outlet />
      </AppLayout>
    ),
    children: [
      { path: '/', element: <HomeFeature /> },
      { path: '/account', element: <AccountList /> },
      { path: '/account/:address', element: <AccountDetail /> },
      { path: '/clusters', element: <ClusterFeature /> },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
