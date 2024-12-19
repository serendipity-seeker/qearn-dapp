import { useState, useContext } from 'react';
// @ts-ignore
import { QubicVault } from '@qubic-lib/qubic-ts-vault-library';
// @ts-ignore
import Card from '../ui/Card';
// @ts-ignore
import { useQubicConnect } from './QubicConnectContext';
import QubicConnectLogo from '../../assets/qubic-connect.svg';
import CloseIcon from '../../assets/close.svg';
import { HeaderButtons } from './Buttons';
import { MetaMaskContext } from './MetamaskContext.tsx';
import { connectSnap, getSnap } from './utils';
import { Account } from './types';
import { MetaMaskTypo } from './MetaMaskTypo';
import { MetaMaskLogo } from './MetaMaskLogo';

export enum MetamaskActions {
  SetInstalled = 'SetInstalled',
  SetSnapsDetected = 'SetSnapsDetected',
  SetError = 'SetError',
  SetIsFlask = 'SetIsFlask',
}

const ConnectModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [selectedMode, setSelectedMode] = useState('none');
  // Private seed handling
  const [privateSeed, setPrivateSeed] = useState('');
  const [errorMsgPrivateSeed, setErrorMsgPrivateSeed] = useState('');
  // Vault file handling
  const [vault] = useState(new QubicVault());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  // Context connect handling
  const { connect, disconnect, connected, getMetaMaskPublicId } = useQubicConnect();
  // account selection
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState(0);

  /**
   * Connect with private seed
   */
  const privateKeyConnect = () => {
    connect({
      connectType: 'privateKey',
      privateKey: privateSeed,
      publicKey: privateSeed,
    });
    // reset and close
    setSelectedMode('none');
    setPrivateSeed('');
    onClose();
  };

  /**
   * Connect with MetaMask
   */
  const mmSnapConnect = async () => {
    try {
      await connectSnap(!state.isFlask ? 'npm:@qubic-lib/qubic-mm-snap' : undefined);
      const installedSnap = await getSnap();
      // get publicId from snap
      const publicKey = await getMetaMaskPublicId(0);
      const wallet = {
        connectType: 'mmSnap',
        publicKey,
      };
      connect(wallet);
      console.log('mmSnapConnect: ', wallet);
      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
      onClose();
    } catch (error) {
      console.error(error);
      dispatch({
        type: MetamaskActions.SetError,
        payload: error,
      });
    }
  };

  // check if input is valid seed (55 chars and only lowercase letters)
  const privateKeyValidate = (pk: string) => {
    if (pk.length !== 55) {
      setErrorMsgPrivateSeed('Seed must be 55 characters long');
    }
    if (pk.match(/[^a-z]/)) {
      setErrorMsgPrivateSeed('Seed must contain only lowercase letters');
    }
    if (pk.length === 55 && !pk.match(/[^a-z]/)) {
      setErrorMsgPrivateSeed('');
    }
    setPrivateSeed(pk);
  };

  /**
   * Connect with vault file
   */
  const vaultFileConnect = async () => {
    if (!selectedFile || !password) {
      alert('Please select a file and enter a password.');
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      try {
        await vault.importAndUnlock(
          true, // selectedFileIsVaultFile: boolean,
          password,
          null, // selectedConfigFile: File | null = null,
          selectedFile, // File | null = null,
          true // unlock: boolean = false
        );
        // now we switch view to select one of the seeds
        setAccounts(vault.getSeeds());
        setSelectedMode('account-select');
      } catch (error) {
        console.error('Error unlocking vault:', error);
        alert('Failed to unlock the vault. Please check your password and try again.');
      }
    };

    fileReader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Failed to read the file. Please try again.');
    };

    fileReader.readAsArrayBuffer(selectedFile);
  };

  const selectAccount = () => {
    // get the first account of the vault
    const pkSeed = vault.revealSeed(accounts[parseInt(selectedAccount.toString())]?.publicId);
    connect({
      connectType: 'vaultFile',
      publicKey: accounts[parseInt(selectedAccount.toString())]?.publicId,
      privateKey: pkSeed,
    });
    onClose(); // reset and close
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value.toString());

  return (
    <>
      {open && (
        <div
          className="w-full p-5 h-full fixed top-0 left-0 overflow-x-hidden overflow-y-auto z-50 bg-smoke-light flex"
          onClick={() => {
            setSelectedMode('none');
            onClose();
          }}
        >
          <Card className="relative p-8 w-full max-w-md m-auto flex-col flex" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <img src={QubicConnectLogo} alt="Qubic Connect Logo" className="h-6" />
              <img src={CloseIcon} onClick={onClose} alt="Close Modal Icon" className="w-5 h-5 cursor-pointer" />
            </div>

            {selectedMode === 'none' && (
              <div className="flex flex-col gap-4 mt-4">
                {connected && (
                  <button className="bg-primary-40 p-4 mt-4 rounded-lg text-black" onClick={() => disconnect()}>
                    Disconnect Wallet
                  </button>
                )}
                {!connected && (
                  <>
                    <button className="bg-primary-40 p-4 mt-4 rounded-lg flex items-center justify-center gap-3" onClick={() => setSelectedMode('metamask')}>
                      <MetaMaskLogo />
                      <MetaMaskTypo color="black" />
                    </button>
                    <div className="flex items-center justify-center w-full my-4">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="px-4 text-red text-">⚠️ BE CAREFUL!</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <button className="bg-primary-40 p-4 rounded-lg text-black" onClick={() => setSelectedMode('private-seed')}>
                      Private Seed
                    </button>
                    <button className="bg-primary-40 p-4 rounded-lg text-black" onClick={() => setSelectedMode('vault-file')}>
                      Vault File
                    </button>
                  </>
                )}
              </div>
            )}

            {selectedMode === 'private-seed' && (
              <div className="text-white mt-4">
                Your 55 character private key (seed):
                <input type="text" className="w-full p-4 mt-4 bg-gray-50 rounded-lg" value={privateSeed} onChange={(e) => privateKeyValidate(e.target.value)} />
                {errorMsgPrivateSeed && <p className="text-red-500">{errorMsgPrivateSeed}</p>}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button className="bg-primary-40 p-4 mt-4 rounded-lg text-black" onClick={() => setSelectedMode('none')}>
                    Cancel
                  </button>
                  <button className="bg-primary-40 p-4 mt-4 rounded-lg text-black" onClick={() => privateKeyConnect()}>
                    Unlock
                  </button>
                </div>
              </div>
            )}

            {selectedMode === 'vault-file' && (
              <div className="text-white mt-4">
                Load your Qubic vault file:
                <input type="file" className="w-full p-4 mt-4 bg-gray-50 rounded-lg" onChange={handleFileChange} />
                <input type="password" className="w-full p-4 mt-4 bg-gray-50 rounded-lg" placeholder="Enter password" onChange={handlePasswordChange} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button className="bg-primary-40 p-4 mt-4 rounded-lg text-black" onClick={() => setSelectedMode('none')}>
                    Cancel
                  </button>
                  <button className="bg-primary-40 p-4 mt-4 rounded-lg text-black" onClick={() => vaultFileConnect()}>
                    Unlock
                  </button>
                </div>
              </div>
            )}

            {selectedMode === 'account-select' && (
              <div className="text-[rgba(128,139,155,1)] mt-4">
                Select an account:
                <select className="w-full p-4 mt-4 bg-gray-50 rounded-lg" value={selectedAccount} onChange={(e) => setSelectedAccount(Number(e.target.value))}>
                  {accounts.map((account, idx) => (
                    <option key={account.publicId} value={idx}>
                      {account.alias}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button
                    className="bg-primary-40 p-4 mt-4 rounded-lg text-black"
                    onClick={() => {
                      disconnect();
                      setSelectedMode('none');
                    }}
                  >
                    Lock Wallet
                  </button>
                  <button className="bg-primary-40 p-4 mt-4 rounded-lg text-black" onClick={() => selectAccount()}>
                    Select Account
                  </button>
                </div>
              </div>
            )}

            {selectedMode === 'metamask' && (
              <div className="text-[rgba(128,139,155,1)] mt-4">
                Connect your MetaMask wallet. You need to have MetaMask installed and unlocked.
                <div className="flex flex-col gap-2 mt-5">
                  <HeaderButtons state={state} onConnectClick={() => mmSnapConnect()} />
                  <button className="bg-[rgba(26,222,245,0.1)] p-3 rounded-lg text-primary-40" onClick={() => setSelectedMode('none')}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default ConnectModal;
