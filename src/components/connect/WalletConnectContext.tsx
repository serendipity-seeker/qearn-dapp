import { createContext, useContext, useEffect, useState } from 'react';
import SignClient from '@walletconnect/sign-client';
import { WalletConnectAccount } from './types/account';
import toast from 'react-hot-toast';

interface WalletConnectContextType {
  signClient: SignClient | null;
  sessionTopic: string;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<{ uri: string; approve: () => Promise<void> }>;
  disconnect: () => Promise<void>;
  requestAccounts: () => Promise<WalletConnectAccount[]>;
  sendQubic: (params: { fromID: string; toID: string; amount: string }) => Promise<any>;
  signTransaction: (params: { fromID: string; toID: string; amount: string; tick: string; inputType: string; payload: string }) => Promise<any>;
  signMessage: (params: { fromID: string; message: string }) => Promise<any>;
}

const WalletConnectContext = createContext<WalletConnectContextType | undefined>(undefined);

interface WalletConnectProviderProps {
  children: React.ReactNode;
}

export function WalletConnectProvider({ children }: WalletConnectProviderProps) {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [sessionTopic, setSessionTopic] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connect = async () => {
    if (!signClient) return { uri: '', approve: async () => {} };
    setIsConnecting(true);
    try {
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          qubic: {
            chains: ['qubic:main'],
            methods: ['qubic_requestAccounts', 'qubic_sendQubic', 'qubic_sendAsset', 'qubic_signTransaction', 'qubic_sign'],
            events: ['amountChanged', 'tokenAmountChanged', 'accountsChanged'],
          },
        },
      });

      console.log('Generated URL:', uri);

      const approve = async () => {
        try {
          const session = await approval();
          console.log('Connection approved', session);
          setSessionTopic(session.topic);
          setIsConnected(true);
          localStorage.setItem('sessionTopic', session.topic);
        } catch (e) {
          console.error('Connection rejected:', e);
        }
      };

      return { uri: uri || '', approve };
    } catch (error) {
      console.error('Failed to connect:', error);
      return { uri: '', approve: async () => {} };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!signClient || !sessionTopic) return;

    try {
      await signClient.disconnect({
        topic: sessionTopic,
        reason: { code: 6000, message: 'User disconnected' },
      });

      setSessionTopic('');
      setIsConnected(false);
      localStorage.removeItem('sessionTopic');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const requestAccounts = async () => {
    if (!signClient || !sessionTopic) throw new Error('Not connected');

    try {
      const result = await signClient.request({
        topic: sessionTopic,
        chainId: 'qubic:main',
        request: {
          method: 'qubic_requestAccounts',
          params: {
            nonce: Date.now().toString(),
          },
        },
      });
      console.log('Requested accounts:', result);
      return result as WalletConnectAccount[];
    } catch (error) {
      console.error('Failed to request accounts:', error);
      throw error;
    }
  };

  const sendQubic = async (params: { fromID: string; toID: string; amount: string }) => {
    if (!signClient || !sessionTopic) throw new Error('Not connected');

    return await signClient.request({
      topic: sessionTopic,
      chainId: 'qubic:main',
      request: {
        method: 'qubic_sendQubic',
        params: {
          ...params,
          nonce: Date.now().toString(),
        },
      },
    });
  };

  const signTransaction = async (params: { fromID: string; toID: string; amount: string; tick: string; inputType: string; payload: string }) => {
    if (!signClient || !sessionTopic) throw new Error('Not connected');

    try {
      return await signClient.request({
        topic: sessionTopic,
        chainId: 'qubic:main',
        request: {
          method: 'qubic_signTransaction',
          params: {
            ...params,
            nonce: Date.now().toString(),
          },
        },
      });
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const signMessage = async (params: { fromID: string; message: string }) => {
    if (!signClient || !sessionTopic) throw new Error('Not connected');

    return await signClient.request({
      topic: sessionTopic,
      chainId: 'qubic:main',
      request: {
        method: 'qubic_sign',
        params,
      },
    });
  };

  useEffect(() => {
    SignClient.init({
      projectId: 'b2ace378845f0e4806ef23d2732f77a4',
      metadata: {
        name: 'QEARN DAPP',
        description: 'QEARN DAPP',
        url: 'https://qearn.qubic.org',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
      },
    }).then((client) => {
      setSignClient(client);

      const storedTopic = localStorage.getItem('sessionTopic');
      if (storedTopic) {
        const session = client.session.get(storedTopic);
        if (session) {
          setSessionTopic(storedTopic);
          setIsConnected(true);
        } else {
          localStorage.removeItem('sessionTopic');
        }
      }

      client.on('session_delete', () => {
        setSessionTopic('');
        setIsConnected(false);
        localStorage.removeItem('sessionTopic');
      });

      client.on('session_expire', () => {
        setSessionTopic('');
        setIsConnected(false);
        localStorage.removeItem('sessionTopic');
      });
    });
  }, []);

  const contextValue: WalletConnectContextType = {
    signClient,
    sessionTopic,
    isConnecting,
    isConnected,
    connect,
    disconnect,
    requestAccounts,
    sendQubic,
    signTransaction,
    signMessage,
  };

  return <WalletConnectContext.Provider value={contextValue}>{children}</WalletConnectContext.Provider>;
}

export function useWalletConnect() {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error('useWalletConnect must be used within a WalletConnectProvider');
  }
  return context;
}
