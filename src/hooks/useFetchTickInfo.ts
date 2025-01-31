import { useQuery } from "@tanstack/react-query";
import { TickInfo } from "@/types";
import { fetchTickInfo } from "@/services/rpc.service";

export const useFetchTickInfo = () => {
  return useQuery<TickInfo, Error>({
    queryKey: ["tickInfo"],
    queryFn: fetchTickInfo,
  });
};
