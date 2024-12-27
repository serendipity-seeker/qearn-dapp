import { useQuery } from '@tanstack/react-query';
import { Balance } from '@/types';
import { fetchBalance } from '@/services/rpc.service';

export const useFetchBalance = (publicId: string) => {
  return useQuery<Balance, Error>({
    queryKey: ['balance', publicId],
    queryFn: () => fetchBalance(publicId),
  });
};
