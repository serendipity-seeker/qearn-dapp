import { RPC_ENDPOINT, API_ENDPOINT } from "@/constants";
import {
  Balance,
  EpochTicks,
  IQuerySC,
  IQuerySCResponse,
  LatestStats,
  RichList,
  TickInfo,
  TxHistory,
  TxStatus,
} from "@/types";
import { uint8ArrayToBase64 } from "@/utils";

export const fetchTickInfo = async (): Promise<TickInfo> => {
  const tickResult = await fetch(`${RPC_ENDPOINT}/v1/tick-info`);
  const tick = await tickResult.json();
  if (!tick || !tick.tickInfo) {
    console.warn("getTickInfo: Invalid tick");
    return {} as TickInfo;
  }
  return tick.tickInfo;
};

export const fetchBalance = async (publicId: string): Promise<Balance> => {
  const balanceResult = await fetch(`${RPC_ENDPOINT}/v1/balances/${publicId}`);
  const balance = await balanceResult.json();
  if (!balance || !balance.balance) {
    console.warn("getBalance: Invalid balance");
    return {} as Balance;
  }
  return balance.balance;
};

export const broadcastTx = async (tx: Uint8Array) => {
  const url = `${RPC_ENDPOINT}/v1/broadcast-transaction`;
  const txEncoded = uint8ArrayToBase64(tx);
  const body = { encodedTransaction: txEncoded };
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const broadcastResult = await result.json();
  return broadcastResult;
};

export const fetchQuerySC = async (query: IQuerySC): Promise<IQuerySCResponse> => {
  const queryResult = await fetch(`${RPC_ENDPOINT}/v1/querySmartContract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  });
  const result = await queryResult.json();
  return result;
};

export const fetchTxStatus = async (txId: string): Promise<TxStatus> => {
  const txStatusResult = await fetch(`${RPC_ENDPOINT}/v1/tx-status/${txId}`);
  let txStatus = {} as { transactionStatus: TxStatus };
  if (txStatusResult.status == 200) {
    txStatus = await txStatusResult.json();
  }
  return txStatus.transactionStatus;
};

export const fetchLatestStats = async (): Promise<LatestStats> => {
  const latestStatsResult = await fetch(`${RPC_ENDPOINT}/v1/latest-stats`);
  if (!latestStatsResult.ok) {
    console.warn("fetchLatestStats: Failed to fetch latest stats");
    return {} as LatestStats;
  }
  const latestStats = await latestStatsResult.json();
  if (!latestStats || !latestStats.data) {
    console.warn("fetchLatestStats: Invalid response data");
    return {} as LatestStats;
  }
  return latestStats.data;
};

export const fetchRichList = async (page: number, pageSize: number): Promise<RichList> => {
  const richListResult = await fetch(`${RPC_ENDPOINT}/v1/rich-list?page=${page}&pageSize=${pageSize}`);
  const richList = await richListResult.json();
  return richList;
};

export const fetchTxHistory = async (publicId: string, startTick: number, endTick: number): Promise<TxHistory> => {
  const txHistoryResult = await fetch(
    `${RPC_ENDPOINT}/v2/identities/${publicId}/transfers?startTick=${startTick}&endTick=${endTick}`,
  );
  const txHistory = await txHistoryResult.json();
  return txHistory.data;
};

export const fetchEpochTicks = async (epoch: number, page: number, pageSize: number): Promise<EpochTicks> => {
  const epochTicksResult = await fetch(`${RPC_ENDPOINT}/v2/epochs/${epoch}/ticks?page=${page}&pageSize=${pageSize}`);
  const epochTicks = await epochTicksResult.json();
  return epochTicks.data;
};

export const fetchTickEvents = async (tick: number) => {
  try {
    const tickEventsResult = await fetch(`${API_ENDPOINT}/v1/events/getTickEvents`, {
      method: "POST",
      body: JSON.stringify({ tick }),
    });
    return tickEventsResult.json();
  } catch (error) {
    return null;
  }
};
