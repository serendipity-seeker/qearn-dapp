import { useQuery } from '@tanstack/react-query';
import { Balance } from '@/types';
import { httpEndpoint } from '@/constants';

export const fetchBalance = async (publicId: string): Promise<Balance> => {
  const balanceResult = await fetch(`${httpEndpoint}/v1/balances/${publicId}`);
  const balance = await balanceResult.json();
  if (!balance || !balance.balance) {
    console.warn('getBalance: Invalid balance');
    return {} as Balance;
  }
  return balance.balance;
};

export const useFetchBalance = (publicId: string) => {
  return useQuery<Balance, Error>({
    queryKey: ['balance', publicId],
    queryFn: () => fetchBalance(publicId),
  });
};
