import { createContext, useContext, useEffect, useState } from 'react';
import SignClient from '@walletconnect/sign-client';

interface WalletConnectContextType {
  signClient: SignClient | null;
  sessionTopic: string;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<string>;
  approve: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendQubic: (params: { fromID: string; toID: string; amount: string }) => Promise<any>;
  signTransaction: (params: { fromID: string; toID: string; amount: string; tick: number; inputType: string; payload: string }) => Promise<any>;
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
  const [approval, setApproval] = useState<(() => Promise<any>) | null>(null);

  const connect = async () => {
    if (!signClient) return '';
    setIsConnecting(true);
    try {
      const { uri, approval: approvalPromise } = await signClient.connect({
        requiredNamespaces: {
          qubic: {
            chains: ['qubic:main'],
            methods: ['qubic_requestAccounts', 'qubic_sendQubic', 'qubic_sendAsset', 'qubic_signTransaction', 'qubic_sign'],
            events: ['amountChanged', 'tokenAmountChanged', 'accountsChanged'],
          },
        },
      });

      setApproval(() => approvalPromise);
      console.log('Generated URL:', uri);
      return uri;
    } catch (error) {
      console.error('Failed to connect:', error);
      return '';
    } finally {
      setIsConnecting(false);
    }
  };

  const approve = async () => {
    if (!approval) return;
    try {
      const session = await approval();
      console.log('Connection approved', session);
      setSessionTopic(session.topic);
      setIsConnected(true);
      localStorage.setItem('sessionTopic', session.topic);
    } catch (e) {
      console.error('Connection rejected:', e);
    } finally {
      setApproval(null);
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

  const sendQubic = async (params: { fromID: string; toID: string; amount: string }) => {
    if (!signClient || !sessionTopic) throw new Error('Not connected');

    return await signClient.request({
      topic: sessionTopic,
      chainId: 'qubic:mainnet',
      request: {
        method: 'qubic_sendQubic',
        params: {
          ...params,
          nonce: Date.now().toString(),
        },
      },
    });
  };

  const signTransaction = async (params: { fromID: string; toID: string; amount: string; tick: number; inputType: string; payload: string }) => {
    if (!signClient || !sessionTopic) throw new Error('Not connected');

    return await signClient.request({
      topic: sessionTopic,
      chainId: 'qubic:mainnet',
      request: {
        method: 'qubic_signTransaction',
        params: {
          ...params,
          nonce: Date.now().toString(),
        },
      },
    });
  };

  const signMessage = async (params: { fromID: string; message: string }) => {
    if (!signClient || !sessionTopic) throw new Error('Not connected');

    return await signClient.request({
      topic: sessionTopic,
      chainId: 'qubic:mainnet',
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
    approve,
    disconnect,
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
