import { httpEndpoint } from "@/constants";
import { uint8ArrayToBase64 } from "@/utils";
import { useQuery } from "@tanstack/react-query";

const broadcastTx = async (tx: Uint8Array) => {
  const url = `${httpEndpoint}/v1/broadcast-transaction`;
  const txEncoded = uint8ArrayToBase64(tx);
  const body = { encodedTransaction: txEncoded };
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response;
};

export const useBroadCastTx = (tx: Uint8Array) => {
  return useQuery({
    queryKey: ['broadcastTx'],
    queryFn: () => broadcastTx(tx),
  });
};
