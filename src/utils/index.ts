import { REWARD_DATA } from "@/data/contants";
import { toast } from "react-hot-toast";
import QRCode from "qrcode";
import { QubicTransaction } from "@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction";
import { PublicKey } from "@qubic-lib/qubic-ts-library/dist/qubic-types/PublicKey";
import { Long } from "@qubic-lib/qubic-ts-library/dist/qubic-types/Long";
import { DynamicPayload } from "@qubic-lib/qubic-ts-library/dist/qubic-types/DynamicPayload";
import { Signature } from "@qubic-lib/qubic-ts-library/dist/qubic-types/Signature";
import { PUBLIC_KEY_LENGTH, SIGNATURE_LENGTH } from "@qubic-lib/qubic-ts-library/dist/crypto";
import { LocalDateTime, ZoneOffset, DayOfWeek, Duration } from "@js-joda/core";

// format number input to 100,000,000 format
export const formatQubicAmount = (amount: number, seperator = ",") => {
  return amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, seperator)
    .replace(".0", "");
};

export const truncateMiddle = (str: string, charsToRemove: number) => {
  const length = str.length;
  const start = Math.floor((length - charsToRemove) / 2);
  const end = start + charsToRemove;

  return str.slice(0, start) + "..." + str.slice(end);
};

export const copyText = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard");
};

export const sumArray = (arr: any[]) => arr.reduce((acc, curr) => acc + curr, 0);

// Convert Uint8Array to hex string
export const byteArrayToHexString = (byteArray: any[]) => {
  const hexString = Array.from(byteArray, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return hexString;
};

// Basic validation checks
export const isAddressValid = (toAddress: string) => toAddress.length === 60 && /^[A-Z]+$/.test(toAddress);
export const isPositiveNumber = (amount: number) => !isNaN(Number(amount)) && Number(amount) > 0;
export const isAmountValid = (amount: number) => isPositiveNumber(amount) && amount % 1 === 0;

export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  const binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
  return btoa(binaryString);
};

export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  return new Uint8Array(binaryString.split("").map((char) => char.charCodeAt(0)));
};

export const createDataView = (size: number): { buffer: ArrayBuffer; view: DataView } => {
  const buffer = new ArrayBuffer(size);
  return { buffer, view: new DataView(buffer) };
};

export const decodeUint8ArrayTx = (tx: Uint8Array) => {
  const new_tx = new QubicTransaction();
  const inputSize =
    new DataView(tx.slice(PUBLIC_KEY_LENGTH * 2 + 14, PUBLIC_KEY_LENGTH * 2 + 16).buffer).getUint16(0, true) || 0;
  const payloadStart = PUBLIC_KEY_LENGTH * 2 + 16;
  const payloadEnd = payloadStart + inputSize;
  const signatureEnd = payloadEnd + SIGNATURE_LENGTH;

  new_tx
    .setSourcePublicKey(new PublicKey(tx.slice(0, PUBLIC_KEY_LENGTH)))
    .setDestinationPublicKey(new PublicKey(tx.slice(PUBLIC_KEY_LENGTH, PUBLIC_KEY_LENGTH * 2)))
    .setAmount(new Long(tx.slice(PUBLIC_KEY_LENGTH * 2, PUBLIC_KEY_LENGTH * 2 + 8)))
    .setTick(new DataView(tx.slice(PUBLIC_KEY_LENGTH * 2 + 8, PUBLIC_KEY_LENGTH * 2 + 12).buffer).getUint32(0, true))
    .setInputType(
      new DataView(tx.slice(PUBLIC_KEY_LENGTH * 2 + 12, PUBLIC_KEY_LENGTH * 2 + 14).buffer).getUint16(0, true),
    )
    .setInputSize(inputSize);

  if (inputSize > 0) {
    const payload = new DynamicPayload(inputSize);
    payload.setPayload(tx.slice(payloadStart, payloadEnd));
    new_tx.setPayload(payload);
  }
  new_tx.signature = new Signature(tx.slice(payloadEnd, signatureEnd));

  return new_tx;
};

interface ICreatePayload {
  data: number;
  type: "uint8" | "uint16" | "uint32" | "bigint64";
}

export const createPayload = (data: ICreatePayload[]) => {
  const TYPE_SIZES = {
    uint8: 1,
    uint16: 2,
    uint32: 4,
    bigint64: 8,
  };

  const totalSize = data.reduce((acc, { type }) => acc + TYPE_SIZES[type], 0);
  const dynamicPayload = new DynamicPayload(totalSize);

  const { buffer, view } = createDataView(totalSize);

  let offset = 0;
  const setters = {
    uint8: (v: DataView, o: number, d: number) => {
      v.setUint8(o, d);
      return 1;
    },
    uint16: (v: DataView, o: number, d: number) => {
      v.setUint16(o, d, true);
      return 2;
    },
    uint32: (v: DataView, o: number, d: number) => {
      v.setUint32(o, d, true);
      return 4;
    },
    bigint64: (v: DataView, o: number, d: number) => {
      v.setBigUint64(o, BigInt(d), true);
      return 8;
    },
  };

  data.forEach(({ type, data: value }) => {
    offset += setters[type](view, offset, value);
  });

  const result = new Uint8Array(buffer);

  dynamicPayload.setPayload(result);
  return dynamicPayload;
};

export const calculateRewards = (
  lockAmount: number,
  totalLockedAmount: number,
  currentBonusAmount: number,
  yieldPercentage: number,
  currentEpoch: number,
  lockedEpoch: number,
) => {
  const fullUnlockPercent = yieldPercentage / 100000;
  const fullUnlockReward = currentBonusAmount * (lockAmount / totalLockedAmount);

  const earlyUnlockPercent =
    REWARD_DATA.find(
      (data) => data.weekFrom < currentEpoch - lockedEpoch && data.weekTo + 1 >= currentEpoch - lockedEpoch,
    )?.earlyUnlock || 0;
  const earlyUnlockReward = fullUnlockReward * (earlyUnlockPercent / 100);

  return {
    earlyUnlockReward,
    earlyUnlockRewardRatio: (fullUnlockPercent * earlyUnlockPercent) / 100,
    fullUnlockReward,
    fullUnlockRewardRatio: fullUnlockPercent,
  };
};

export const generateQRCode = async (text: string) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text);
    return qrCodeDataURL;
  } catch (err) {
    console.error("Failed to generate QR code", err);
    return "";
  }
};

export const generateSeed = (): string => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const letterSize = letters.length;
  let seed = "";
  for (let i = 0; i < 55; i++) {
    seed += letters[Math.floor(Math.random() * letterSize)];
  }
  return seed;
};

export const getTimeToNewEpoch = () => {
  const now = LocalDateTime.now(ZoneOffset.UTC);

  let nextWednesday = now.withHour(12).withMinute(0).withSecond(0).withNano(0);

  while (
    nextWednesday.dayOfWeek() !== DayOfWeek.WEDNESDAY ||
    (nextWednesday.dayOfWeek() === DayOfWeek.WEDNESDAY && now.isAfter(nextWednesday))
  ) {
    nextWednesday = nextWednesday.plusDays(1);
  }

  const duration = Duration.between(now, nextWednesday);

  return {
    days: duration.toDays(),
    hours: duration.toHours() % 24,
    minutes: duration.toMinutes() % 60,
  };
};
