import React, { createContext, useContext, useEffect, useState } from 'react';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import Crypto, { SIGNATURE_LENGTH } from '@qubic-lib/qubic-ts-library/dist/crypto';
import { MetaMaskProvider } from './MetamaskContext';
import { connectTypes, defaultSnapOrigin } from './config';
import { useWalletConnect } from './WalletConnectContext';
import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction';
import { base64ToUint8Array, decodeUint8ArrayTx, uint8ArrayToBase64 } from '@/utils';
import { DEFAULT_TX_SIZE } from '@/constants';

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
  getSignedTx: (tx: Uint8Array | QubicTransaction) => Promise<{ tx: Uint8Array }>;
}

const QubicConnectContext = createContext<QubicConnectContextType | undefined>(undefined);

interface QubicConnectProviderProps {
  children: React.ReactNode;
}

export function QubicConnectProvider({ children }: QubicConnectProviderProps) {
  const [connected, setConnected] = useState<boolean>(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const { signTransaction } = useWalletConnect();

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
  const getSignedTx = async (tx: Uint8Array | QubicTransaction) => {
    if (!wallet || !connectTypes.includes(wallet.connectType)) {
      throw new Error('Unsupported connectType: ' + wallet?.connectType);
    }

    let signedtx: Uint8Array | null = null;

    if (wallet.connectType === 'mmSnap') {
      // MetaMask need uint8Array tx to sign
      if (tx instanceof QubicTransaction) {
        tx = await tx.build('0'.repeat(55));
      }
      const mmResult = await getMetaMaskSignedTx(tx, tx.length - SIGNATURE_LENGTH);
      const binaryTx = atob(mmResult.signedTx);
      signedtx = new Uint8Array(binaryTx.length);
      for (let i = 0; i < binaryTx.length; i++) {
        signedtx[i] = binaryTx.charCodeAt(i);
      }
    } else if (wallet.connectType === 'walletconnect') {
      // WalletConnect need decoded tx to sign
      if (tx instanceof Uint8Array) {
        tx = decodeUint8ArrayTx(tx);
      }
      const fromID = await qHelper.getIdentity(tx.sourcePublicKey.getIdentity());
      const toID = await qHelper.getIdentity(tx.destinationPublicKey.getIdentity());
      const wcResult: { transactionId: string; signedTransaction: string; } = await signTransaction({
        fromID: fromID,
        toID: toID,
        amount: tx.amount.getNumber().toString(),
        tick: tx.tick.toString(),
        inputType: tx.inputType.toString(),
        payload: uint8ArrayToBase64(tx.payload.getPackageData()),
      });
      signedtx = base64ToUint8Array(wcResult.signedTransaction);
    } else {
      if (tx instanceof QubicTransaction) {
        tx = await tx.build('0'.repeat(55));
      }
      const qCrypto = await Crypto;
      if (!wallet.privateKey) throw new Error('Private key required');
      const idPackage = await qHelper.createIdPackage(wallet.privateKey);
      const digest = new Uint8Array(SIGNATURE_LENGTH);
      const toSign = tx.slice(0, tx.length - SIGNATURE_LENGTH);

      qCrypto.K12(toSign, digest, SIGNATURE_LENGTH);
      signedtx = qCrypto.schnorrq.sign(idPackage.privateKey, idPackage.publicKey, digest);
    }

    return {
      tx: signedtx || new Uint8Array(DEFAULT_TX_SIZE),
    };
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
