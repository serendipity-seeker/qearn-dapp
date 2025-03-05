import { IEvent, TickEvents } from "@/types";
import { base64ToUint8Array } from "@/utils";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";

enum EventType {
  QU_TRANSFER = 0,
  ASSET_ISSUANCE = 1,
  ASSET_OWNERSHIP_CHANGE = 2,
  ASSET_POSSESSION_CHANGE = 3,
  CONTRACT_ERROR_MESSAGE = 4,
  CONTRACT_WARNING_MESSAGE = 5,
  CONTRACT_INFORMATION_MESSAGE = 6,
  CONTRACT_DEBUG_MESSAGE = 7,
  BURNING = 8,
  DUST_BURNING = 9,
  SPECTRUM_STATS = 10,
  ASSET_OWNERSHIP_MANAGING_CONTRACT_CHANGE = 11,
  ASSET_POSSESSION_MANAGING_CONTRACT_CHANGE = 12,
  CUSTOM_MESSAGE = 255,
}

enum QearnLogInfo {
  SUCCESS_LOCKING = 0,
  FAILED_TRANSFER = 1,
  LIMIT_LOCKING = 2,
  OVERFLOW_USER = 3,
  INVALID_INPUT = 4,
  SUCCESS_EARLY_UNLOCKING = 5,
  SUCCESS_FULLY_UNLOCKING = 6,
}

interface IQearnEvent {
  tick: number;
  eventId: number;
  sourceId: string;
  destinationId: string;
  amount: number;
  type: string;
}

const qHelper = new QubicHelper();

export const useLog = () => {
  const formatQearnLog = async (log: TickEvents) => {
    const qearnEvents: IQearnEvent[] = [];

    for (const tx of log.txEvents) {
      for (const event of tx.events) {
        const isSCLog = checkSCLog(event);
        if (!isSCLog) continue;

        const isQearnLog = checkQearnLog(event.eventData, 9);
        if (!isQearnLog) continue;

        const eventData = await parseQearnLog(event.eventData);
        if (eventData) {
          qearnEvents.push({
            tick: log.tick,
            eventId: Number(event.header.eventId),
            ...eventData,
          });
        }
      }
    }
    return qearnEvents;
  };

  const checkSCLog = (event: IEvent) => {
    let result = false;
    if (
      event.eventType === EventType.CONTRACT_ERROR_MESSAGE ||
      event.eventType === EventType.CONTRACT_WARNING_MESSAGE ||
      event.eventType === EventType.CONTRACT_INFORMATION_MESSAGE ||
      event.eventType === EventType.CONTRACT_DEBUG_MESSAGE
    ) {
      result = true;
    }
    return result;
  };

  const checkQearnLog = (eventData: string, index: number) => {
    const eventDataArray = base64ToUint8Array(eventData);
    const dataView = new DataView(eventDataArray.buffer);
    const contractIndex = dataView.getUint32(0, true);
    if (contractIndex !== index) {
      return false;
    }
    return true;
  };

  const parseQearnLog = async (eventData: string) => {
    const eventDataArray = base64ToUint8Array(eventData);
    const dataView = new DataView(eventDataArray.buffer);

    const sourcePublickey = eventDataArray.slice(8, 40);
    const destinationPublickey = eventDataArray.slice(40, 72);
    const amount = dataView.getBigUint64(72, true);
    const type = dataView.getUint32(80, true);

    const sourceId = await qHelper.getIdentity(sourcePublickey);
    const destinationId = await qHelper.getIdentity(destinationPublickey);

    return {
      sourceId: sourceId,
      destinationId: destinationId,
      amount: Number(amount),
      type: QearnLogInfo[type],
    };
  };

  return {
    formatQearnLog,
    checkQearnLog,
  };
};
