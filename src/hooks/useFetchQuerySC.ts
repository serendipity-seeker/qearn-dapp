import { useQuery } from '@tanstack/react-query';
import { fetchQuerySC } from '@/services/rpc.service';
import { IQuerySC, IQuerySCResponse } from '@/types';

export const useFetchQuerySC = (query: IQuerySC) => {
  return useQuery<IQuerySCResponse, Error>({
    queryKey: ['querySC', query],
    queryFn: () => fetchQuerySC(query),
  });
};