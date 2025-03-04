import { TickEvents } from "@/types";
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
  QearnSuccessLocking = 0,
  QearnFailedTransfer = 1,
  QearnLimitLocking = 2,
  QearnOverflowUser = 3,
  QearnInvalidInput = 4,
  QearnSuccessEarlyUnlocking = 5,
  QearnSuccessFullyUnlocking = 6,
}

interface IQearnEvent {
  tick: number;
  eventId: number;
  sourceId: string;
  destinationId: string;
  amount: number;
  type: QearnLogInfo;
}

const qHelper = new QubicHelper();

export const useLog = () => {
  const formatQearnLog = async (log: TickEvents) => {
    const qearnEvents: IQearnEvent[] = [];
    const scLog = checkSCLog(log);
    if (!scLog) return [];

    log.txEvents.forEach((tx) => {
      tx.events.forEach(async (event) => {
        const isQearnLog = checkQearnLog(event.eventData, 9);
        if (!isQearnLog) return;
        // Parse the event data
        const eventData = await parseQearnLog(event.eventData);
        if (eventData) {
          qearnEvents.push({
            tick: log.tick,
            eventId: Number(event.header.eventId),
            ...eventData,
          });
        }
      });
    });
    return qearnEvents;
  };

  const checkSCLog = (log: TickEvents) => {
    let result = false;
    log.txEvents.forEach((tx) => {
      tx.events.forEach((event) => {
        if (
          event.eventType === EventType.CONTRACT_ERROR_MESSAGE ||
          event.eventType === EventType.CONTRACT_WARNING_MESSAGE ||
          event.eventType === EventType.CONTRACT_INFORMATION_MESSAGE ||
          event.eventType === EventType.CONTRACT_DEBUG_MESSAGE
        ) {
          result = true;
        }
      });
    });
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

    const sourcePublickey = eventDataArray.slice(4, 36);
    const destinationPublickey = eventDataArray.slice(36, 68);
    const amount = dataView.getBigUint64(68, true);
    const type = dataView.getUint32(76, true);

    const sourceId = await qHelper.getIdentity(sourcePublickey);
    const destinationId = await qHelper.getIdentity(destinationPublickey);

    return {
      sourceId: sourceId,
      destinationId: destinationId,
      amount: Number(amount),
      type: type as QearnLogInfo,
    };
  };

  return {
    formatQearnLog,
    checkQearnLog,
  };
};
