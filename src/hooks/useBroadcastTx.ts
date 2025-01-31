import { broadcastTx } from "@/services/rpc.service";
import { useQuery } from "@tanstack/react-query";

export const useBroadCastTx = (tx: Uint8Array) => {
  return useQuery({
    queryKey: ["broadcastTx"],
    queryFn: () => broadcastTx(tx),
  });
};
