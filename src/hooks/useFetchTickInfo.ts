import { useQuery } from '@tanstack/react-query';
import { TickInfo } from '@/types';
import { httpEndpoint } from '@/constants';

export const fetchTickInfo = async (): Promise<TickInfo> => {
  const tickResult = await fetch(`${httpEndpoint}/v1/tick-info`);
  const tick = await tickResult.json();
  if (!tick || !tick.tickInfo) {
    console.warn('getTickInfo: Invalid tick');
    return {} as TickInfo;
  }
  return tick.tickInfo;
};

export const useFetchTickInfo = () => {
  return useQuery<TickInfo, Error>({
    queryKey: ['tickInfo'],
    queryFn: fetchTickInfo,
  });
};
