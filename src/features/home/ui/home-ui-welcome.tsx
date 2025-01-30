import { Text, Title } from '@mantine/core';
import classes from './home-ui-welcome.module.css';

export function HomeUiWelcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Placeholder
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Placeholder is a starter project for Metaplex Core NFT Collections.
      </Text>
    </>
  );
}
