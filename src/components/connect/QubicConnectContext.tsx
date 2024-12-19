import React, { createContext, useContext, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import Crypto from '@qubic-lib/qubic-ts-library/dist/crypto';
import { seedStringToBytes, digestBytesToString, publicKeyStringToBytes, publicKeyBytesToString } from '@qubic-lib/qubic-ts-library/dist/converter/converter.js';
import { MetaMaskProvider } from './MetamaskContext';
import { connectTypes, defaultSnapOrigin, tickOffset } from './config';

interface Wallet {
  connectType: string;
  publicKey: string;
  privateKey?: string;
}

interface QubicConnectContextType {
  connected: boolean;
  wallet: Wallet | null;
  showConnectModal: boolean;
  connect: (wallet: Wallet) => void;
  disconnect: () => void;
  toggleConnectModal: () => void;
  getMetaMaskPublicId: (accountIdx?: number, confirm?: boolean) => Promise<string>;
  getSignedTx: (tx: Uint8Array, offset: number) => Promise<{ tx: Uint8Array; offset: number }>;
  broadcastTx: (tx: Uint8Array) => Promise<{ status: number; result: any }>;
  getTickInfo: () => Promise<{ tick: number; epoch: number }>;
  getBalance: (publicId: string) => Promise<{ balance: { id: string; balance: number } }>;
  tickOffset: number;
  getPaymentTx: (sender: string, receiver: string, amount: number, tick: number) => Promise<{ tx: Uint8Array; offset: number }>;
}

const QubicConnectContext = createContext<QubicConnectContextType | undefined>(undefined);

interface QubicConnectProviderProps {
  children: React.ReactNode;
}

export function QubicConnectProvider({ children }: QubicConnectProviderProps) {
  const [connected, setConnected] = useState<boolean>(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);

  const httpEndpoint = 'https://rpc.qubic.org'; // live system
  const qHelper = new QubicHelper();

  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (storedWallet) {
      setWallet(JSON.parse(storedWallet));
      setConnected(true);
    }
  }, []);

  const connect = (wallet: Wallet): void => {
    localStorage.setItem('wallet', JSON.stringify(wallet));
    setWallet(wallet);
    setConnected(true);
  };

  const disconnect = (): void => {
    localStorage.removeItem('wallet');
    setWallet(null);
    setConnected(false);
  };

  const toggleConnectModal = (): void => {
    setShowConnectModal(!showConnectModal);
  };

  function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
    return btoa(binaryString);
  }

  const getMetaMaskPublicId = async (accountIdx: number = 0, confirm: boolean = false): Promise<string> => {
    return await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'getPublicId',
          params: {
            accountIdx,
            confirm,
          },
        },
      },
    });
  };

  const getMetaMaskSignedTx = async (tx: Uint8Array, offset: number, accountIdx: number = 0) => {
    const base64Tx = btoa(String.fromCharCode(...Array.from(tx)));

    return await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: defaultSnapOrigin,
        request: {
          method: 'signTransaction',
          params: {
            base64Tx,
            accountIdx,
            offset,
          },
        },
      },
    });
  };

  const getTickInfo = async () => {
    console.log('getTickInfo');
    const tickResult = await fetch(`${httpEndpoint}/v1/tick-info`);
    const tick = await tickResult.json();
    if (!tick || !tick.tickInfo) {
      console.warn('getTickInfo: Invalid tick');
      return { tickInfo: { tick: 0, epoch: 0 } };
    }
    return tick.tickInfo;
  };

  const getBalance = async (publicId: string) => {
    console.log('getBalance: for publicId ', publicId);
    const accountResult = await fetch(`${httpEndpoint}/v1/balances/${publicId}`);
    const results = await accountResult.json();
    if (!results || !results.balance) {
      console.warn('getBalance: Invalid balance');
      return { balance: { id: publicId, balance: 0 } };
    }
    return results;
  };

  const getPaymentTx = async (sender: string, receiver: string, amount: number, tick: number) => {
    const destPublicKey = publicKeyStringToBytes(receiver).slice(0, 32);
    const senderPublicId = publicKeyStringToBytes(sender).slice(0, 32);
    const tx = new Uint8Array(144).fill(0);
    const txView = new DataView(tx.buffer);
    let offset = 0;
    let i = 0;
    for (i = 0; i < 32; i++) {
      tx[i] = senderPublicId[i];
    }
    offset = i;
    for (i = 0; i < 32; i++) {
      tx[offset + i] = destPublicKey[i];
    }
    offset += i;
    txView.setBigInt64(offset, BigInt(amount), true);
    offset += 8;
    txView.setUint32(offset, tick, true);
    offset += 4;
    txView.setUint16(offset, 0, true);
    offset += 2;
    txView.setUint16(offset, 0, true);
    offset += 2;

    return {
      tx,
      offset,
    };
  };

  const getSignedTx = async (tx: Uint8Array, offset: number) => {
    if (!wallet || !connectTypes.includes(wallet.connectType)) {
      throw new Error('Unsupported connectType: ' + wallet?.connectType);
    }

    let signedtx: Uint8Array | null = null;

    if (wallet.connectType === 'mmSnap') {
      const mmResult = await getMetaMaskSignedTx(tx, offset);
      const binaryTx = atob(mmResult.signedTx);
      signedtx = new Uint8Array(binaryTx.length);
      for (let i = 0; i < binaryTx.length; i++) {
        signedtx[i] = binaryTx.charCodeAt(i);
      }
    } else {
      const qCrypto = await Crypto;
      if (!wallet.privateKey) throw new Error('Private key required');
      const idPackage = await qHelper.createIdPackage(wallet.privateKey);
      const digest = new Uint8Array(64);
      const toSign = tx.slice(0, offset);

      qCrypto.K12(toSign, digest, 64);
      signedtx = qCrypto.schnorrq.sign(idPackage.privateKey, idPackage.publicKey, digest);
    }

    if (signedtx) {
      tx.set(signedtx, offset);
      offset += 64;
    }

    return {
      tx,
      offset,
    };
  };

  const broadcastTx = async (tx: Uint8Array) => {
    const url = `${httpEndpoint}/v1/broadcast-transaction`;
    const txEncoded = uint8ArrayToBase64(tx);
    const body = { encodedTransaction: txEncoded };
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        console.log('broadcastTx:', response);
      }
      return {
        status: response.status,
        result,
      };
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const contextValue: QubicConnectContextType = {
    connected,
    wallet,
    showConnectModal,
    connect,
    disconnect,
    toggleConnectModal,
    getMetaMaskPublicId,
    getSignedTx,
    broadcastTx,
    getTickInfo,
    getBalance,
    tickOffset,
    getPaymentTx,
  };

  return (
    <MetaMaskProvider>
      <QubicConnectContext.Provider value={contextValue}>{children}</QubicConnectContext.Provider>
    </MetaMaskProvider>
  );
}

export function useQubicConnect(): QubicConnectContextType {
  const context = useContext(QubicConnectContext);
  if (context === undefined) {
    throw new Error('useQubicConnect() hook must be used within a <QubicConnectProvider>');
  }
  return context;
}
