import { useState, useContext, useEffect } from "react";
// @ts-ignore
import { QubicVault } from "@qubic-lib/qubic-ts-vault-library";
// @ts-ignore
import Card from "../ui/Card";
// @ts-ignore
import { useQubicConnect } from "./QubicConnectContext";
import QubicConnectLogo from "../../assets/qubic-connect.svg";
import QubicConnectLogoDark from "../../assets/qubic-connect-dark.svg";
import CloseIcon from "../../assets/close.svg";
import { HeaderButtons } from "./Buttons";
import { MetaMaskContext } from "./MetamaskContext.tsx";
import { connectSnap, getSnap } from "./utils";
import { Account } from "./types";
import MetaMaskLogo from "@/assets/metamask.svg";
import { useWalletConnect } from "./WalletConnectContext.tsx";
import { generateQRCode } from "@/utils/index.ts";
import WalletConnectLogo from "@/assets/wallet-connect.svg";
import { useTranslation } from "react-i18next";

export enum MetamaskActions {
  SetInstalled = "SetInstalled",
  SetSnapsDetected = "SetSnapsDetected",
  SetError = "SetError",
  SetIsFlask = "SetIsFlask",
}

const ConnectModal = ({ open, onClose, darkMode }: { open: boolean; onClose: () => void; darkMode?: boolean }) => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const { t } = useTranslation();
  
  const [selectedMode, setSelectedMode] = useState("none");
  // Private seed handling
  const [privateSeed, setPrivateSeed] = useState("");
  const [errorMsgPrivateSeed, setErrorMsgPrivateSeed] = useState("");
  // Vault file handling
  const [vault] = useState(new QubicVault());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  // Context connect handling
  const { connect, disconnect, connected, getMetaMaskPublicId } = useQubicConnect();
  // account selection
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState(0);
  // WC
  const [qrCode, setQrCode] = useState<string>("");
  const [connectionURI, setConnectionURI] = useState<string>("");
  const { connect: walletConnectConnect, isConnected, requestAccounts } = useWalletConnect();
  /**
   * Connect with private seed
   */
  const privateKeyConnect = () => {
    connect({
      connectType: "privateKey",
      privateKey: privateSeed,
      publicKey: privateSeed,
    });
    // reset and close
    setSelectedMode("none");
    setPrivateSeed("");
    onClose();
  };

  /**
   * Connect with MetaMask
   */
  const mmSnapConnect = async () => {
    try {
      await connectSnap(!state.isFlask ? "npm:@qubic-lib/qubic-mm-snap" : undefined);
      const installedSnap = await getSnap();
      // get publicId from snap
      const publicKey = await getMetaMaskPublicId(0);
      const wallet = {
        connectType: "mmSnap",
        publicKey,
      };
      connect(wallet);
      console.log("mmSnapConnect: ", wallet);
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

  /**
   *
   * Connect with WalletConnect
   */
  const generateURI = async () => {
    const { uri, approve } = await walletConnectConnect();
    setConnectionURI(uri);
    const result = await generateQRCode(uri);
    setQrCode(result);
    await approve();
  };

  const wcConnect = async () => {
    try {
      const accounts = await requestAccounts();
      const wallet = {
        connectType: "walletconnect",
        publicKey: accounts[0].address,
      };
      connect(wallet);
      setSelectedMode("none");
      onClose();
    } catch (error) {
      console.error("Failed to connect with WalletConnect:", error);
    }
  };

  useEffect(() => {
    if (isConnected) {
      wcConnect();
    }
  }, [isConnected]);

  // check if input is valid seed (55 chars and only lowercase letters)
  const privateKeyValidate = (pk: string) => {
    if (pk.length !== 55) {
      setErrorMsgPrivateSeed(t("connect.Seed must be 55 characters long"));
    }
    if (pk.match(/[^a-z]/)) {
      setErrorMsgPrivateSeed(t("connect.Seed must contain only lowercase letters"));
    }
    if (pk.length === 55 && !pk.match(/[^a-z]/)) {
      setErrorMsgPrivateSeed("");
    }
    setPrivateSeed(pk);
  };

  /**
   * Connect with vault file
   */
  const vaultFileConnect = async () => {
    if (!selectedFile || !password) {
      alert(t("connect.Please select a file and enter a password."));
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
          true, // unlock: boolean = false
        );
        // now we switch view to select one of the seeds
        setAccounts(vault.getSeeds());
        setSelectedMode("account-select");
      } catch (error) {
        console.error("Error unlocking vault:", error);
        alert(t("connect.Failed to unlock the vault. Please check your password and try again."));
      }
    };

    fileReader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Failed to read the file. Please try again.");
    };

    fileReader.readAsArrayBuffer(selectedFile);
  };

  const selectAccount = () => {
    // get the first account of the vault
    const pkSeed = vault.revealSeed(accounts[parseInt(selectedAccount.toString())]?.publicId);
    connect({
      connectType: "vaultFile",
      publicKey: accounts[parseInt(selectedAccount.toString())]?.publicId,
      privateKey: pkSeed,
    });
    onClose(); // reset and close
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value.toString());

  return (
    <>
      {open && (
        <div
          className="fixed left-0 top-0 z-50 flex h-full w-full overflow-y-auto overflow-x-hidden bg-smoke-light p-5"
          onClick={() => {
            setSelectedMode("none");
            onClose();
          }}
        >
          <Card
            className="relative m-auto flex w-full max-w-md flex-col p-8 bg-background text-foreground"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <img src={darkMode ? QubicConnectLogo : QubicConnectLogoDark} alt="Qubic Connect Logo" className="h-6" />
              <img src={CloseIcon} onClick={onClose} alt="Close Modal Icon" className="h-5 w-5 cursor-pointer" />
            </div>

            {selectedMode === "none" && (
              <div className="mt-4 flex flex-col gap-4">
                {connected && (
                  <button className="mt-4 rounded-lg bg-primary-40 p-4 text-black" onClick={() => disconnect()}>
                    {t("connect.Disconnect Wallet")}
                  </button>
                )}
                {!connected && (
                  <>
                    <button
                      className="disabled:bg-gray-40 mt-4 flex items-center justify-center gap-3 rounded-lg bg-primary-40 p-2 text-black"
                      onClick={() => setSelectedMode("metamask")}
                    >
                      <img src={MetaMaskLogo} alt="MetaMask Logo" className="h-8 w-8" />
                      <span className="w-32">{t("connect.MetaMask")}</span>
                    </button>
                    <button
                      className="disabled:bg-gray-40 flex items-center justify-center gap-3 rounded-lg bg-primary-40 p-2 text-black"
                      onClick={() => {
                        generateURI();
                        setSelectedMode("walletconnect");
                      }}
                    >
                      <img src={WalletConnectLogo} alt="Wallet Connect Logo" className="h-8 w-8" />
                      <span className="w-32">{t("connect.Wallet Connect")}</span>
                    </button>
                    <div className="my-4 flex w-full items-center justify-center">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="text-red px-4">{t("connect.⚠️ BE CAREFUL!")}</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <button
                      className="rounded-lg bg-primary-40 p-3 text-black"
                      onClick={() => setSelectedMode("private-seed")}
                    >
                      {t("connect.Private Seed")}
                    </button>
                    <button
                      className="rounded-lg bg-primary-40 p-3 text-black"
                      onClick={() => setSelectedMode("vault-file")}
                    >
                      {t("connect.Vault File")}
                    </button>
                  </>
                )}
              </div>
            )}

            {selectedMode === "private-seed" && (
              <div className="mt-4">
                {t("connect.Your 55 character private key (seed):")}
                <input
                  type="text"
                  className="mt-4 w-full rounded-lg border-2 border-gray-300 bg-background p-4 text-foreground"
                  value={privateSeed}
                  onChange={(e) => privateKeyValidate(e.target.value)}
                />
                {errorMsgPrivateSeed && <p className="text-red-500">{errorMsgPrivateSeed}</p>}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <button
                    className="mt-4 rounded-lg bg-primary-40 p-4 text-black"
                    onClick={() => setSelectedMode("none")}
                  >
                    {t("connect.Cancel")}
                  </button>
                  <button className="mt-4 rounded-lg bg-primary-40 p-4 text-black" onClick={() => privateKeyConnect()}>
                    {t("connect.Unlock")}
                  </button>
                </div>
              </div>
            )}

            {selectedMode === "vault-file" && (
              <div className="mt-4">
                {t("connect.Load your Qubic vault file:")}
                <input type="file" className="mt-4 w-full rounded-lg p-4 border-2 border-gray-300 bg-background text-foreground" onChange={handleFileChange} />
                <input
                  type="password"
                  className="mt-4 w-full rounded-lg p-4 border-2 border-gray-300 bg-background text-foreground"
                  placeholder={t("connect.Enter password")}
                  onChange={handlePasswordChange}
                />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <button
                    className="mt-4 rounded-lg bg-primary-40 p-4 text-black"
                    onClick={() => setSelectedMode("none")}
                  >
                    {t("connect.Cancel")}
                  </button>
                  <button className="mt-4 rounded-lg bg-primary-40 p-4 text-black" onClick={() => vaultFileConnect()}>
                    {t("connect.Unlock")}
                  </button>
                </div>
              </div>
            )}

            {selectedMode === "account-select" && (
              <div className="mt-4 text-[rgba(128,139,155,1)]">
                {t("connect.Select an account:")}
                <select
                  className="mt-4 w-full rounded-lg p-4"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(Number(e.target.value))}
                >
                  {accounts.map((account, idx) => (
                    <option key={account.publicId} value={idx}>
                      {account.alias}
                    </option>
                  ))}
                </select>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <button
                    className="mt-4 rounded-lg bg-primary-40 p-4 text-black"
                    onClick={() => {
                      disconnect();
                      setSelectedMode("none");
                    }}
                  >
                    {t("connect.Lock Wallet")}
                  </button>
                  <button className="mt-4 rounded-lg bg-primary-40 p-4 text-black" onClick={() => selectAccount()}>
                    {t("connect.Select Account")}
                  </button>
                </div>
              </div>
            )}

            {selectedMode === "metamask" && (
              <div className="mt-4 text-[rgba(128,139,155,1)]">
                Connect your MetaMask wallet. You need to have MetaMask installed and unlocked.
                <div className="mt-5 flex flex-col gap-2">
                  <HeaderButtons state={state} onConnectClick={() => mmSnapConnect()} />
                  <button
                    className="rounded-lg bg-[rgba(26,222,245,0.1)] p-3 text-primary-40"
                    onClick={() => setSelectedMode("none")}
                  >
                    {t("connect.Cancel")}
                  </button>
                </div>
              </div>
            )}

            {selectedMode === "walletconnect" && (
              <div className="mt-4 text-[rgba(128,139,155,1)]">
                {t("connect.Connect your Qubic Wallet. You need to have Qubic Wallet installed and unlocked.")}
                <div className="mt-5 flex flex-col gap-2">
                  <img src={qrCode} alt="Wallet Connect QR Code" className="w-54 h-54 mx-auto" />
                  <button
                    onClick={() => window.open(`qubic-wallet://pairwc/${connectionURI}`, "_blank")}
                    className="disabled:bg-gray-40 flex items-center justify-center gap-3 rounded-lg bg-primary-40 p-3 text-black"
                  >
                    {t("connect.Open in Qubic Wallet")}
                  </button>
                  <button
                    className="rounded-lg bg-[rgba(26,222,245,0.1)] p-3 text-primary-40"
                    onClick={() => setSelectedMode("none")}
                  >
                    {t("connect.Cancel")}
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
