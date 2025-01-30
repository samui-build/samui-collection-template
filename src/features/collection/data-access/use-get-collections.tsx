import { collections } from '@/features/collection/data-access/collections';

export function useGetCollections() {
  return {
    items: collections,
  };
}