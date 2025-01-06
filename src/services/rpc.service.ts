import { httpEndpoint } from '@/constants';
import { Balance, IQuerySC, IQuerySCResponse, TickInfo } from '@/types';
import { uint8ArrayToBase64 } from '@/utils';

export const fetchTickInfo = async (): Promise<TickInfo> => {
  const tickResult = await fetch(`${httpEndpoint}/v1/tick-info`);
  const tick = await tickResult.json();
  if (!tick || !tick.tickInfo) {
    console.warn('getTickInfo: Invalid tick');
    return {} as TickInfo;
  }
  return tick.tickInfo;
};

export const fetchBalance = async (publicId: string): Promise<Balance> => {
  const balanceResult = await fetch(`${httpEndpoint}/v1/balances/${publicId}`);
  const balance = await balanceResult.json();
  if (!balance || !balance.balance) {
    console.warn('getBalance: Invalid balance');
    return {} as Balance;
  }
  return balance.balance;
};

export const broadcastTx = async (tx: Uint8Array) => {
  const url = `${httpEndpoint}/v1/broadcast-transaction`;
  const txEncoded = uint8ArrayToBase64(tx);
  const body = { encodedTransaction: txEncoded };
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response;
};

export const fetchQuerySC = async (query: IQuerySC): Promise<IQuerySCResponse> => {
  const queryResult = await fetch(`${httpEndpoint}/v1/querySmartContract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });
  const result = await queryResult.json();
  return result;
};
