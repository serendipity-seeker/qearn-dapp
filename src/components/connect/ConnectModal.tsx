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
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";
import { motion, AnimatePresence } from "framer-motion";

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  /**
   * Connect with private seed
   */
  const privateKeyConnect = async () => {
    const idPackage = await new QubicHelper().createIdPackage(privateSeed);
    connect({
      connectType: "privateKey",
      privateKey: privateSeed,
      publicKey: idPackage.publicId,
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
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed left-0 top-0 z-50 flex h-full w-full overflow-y-auto overflow-x-hidden bg-smoke-light p-5"
          onClick={() => {
            setSelectedMode("none");
            onClose();
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="relative m-auto flex w-full max-w-md flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <Card className="bg-background p-8 text-foreground">
              <motion.div className="flex items-center justify-between" variants={contentVariants}>
                <img
                  src={darkMode ? QubicConnectLogo : QubicConnectLogoDark}
                  alt="Qubic Connect Logo"
                  className="h-6"
                />
                <img src={CloseIcon} onClick={onClose} alt="Close Modal Icon" className="h-5 w-5 cursor-pointer" />
              </motion.div>

              <AnimatePresence mode="wait">
                {selectedMode === "none" && (
                  <motion.div
                    className="mt-4 flex flex-col gap-4"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
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
                  </motion.div>
                )}

                {selectedMode === "private-seed" && (
                  <motion.div
                    className="mt-4"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
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
                      <button
                        className="mt-4 rounded-lg bg-primary-40 p-4 text-black"
                        onClick={() => privateKeyConnect()}
                      >
                        {t("connect.Unlock")}
                      </button>
                    </div>
                  </motion.div>
                )}

                {selectedMode === "vault-file" && (
                  <motion.div
                    className="mt-4"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t("connect.Load your Qubic vault file:")}
                    <input
                      type="file"
                      className="mt-4 w-full rounded-lg border-2 border-gray-300 bg-background p-4 text-foreground"
                      onChange={handleFileChange}
                    />
                    <input
                      type="password"
                      className="mt-4 w-full rounded-lg border-2 border-gray-300 bg-background p-4 text-foreground"
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
                      <button
                        className="mt-4 rounded-lg bg-primary-40 p-4 text-black"
                        onClick={() => vaultFileConnect()}
                      >
                        {t("connect.Unlock")}
                      </button>
                    </div>
                  </motion.div>
                )}

                {selectedMode === "account-select" && (
                  <motion.div
                    className="mt-4 text-[rgba(128,139,155,1)]"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
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
                  </motion.div>
                )}

                {selectedMode === "metamask" && (
                  <motion.div
                    className="mt-4 text-[rgba(128,139,155,1)]"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
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
                  </motion.div>
                )}

                {selectedMode === "walletconnect" && (
                  <motion.div
                    className="mt-4 text-[rgba(128,139,155,1)]"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {t("connect.Connect your Qubic Wallet. You need to have Qubic Wallet installed and unlocked.")}
                    <div className="mt-5 flex flex-col gap-2">
                      <div className="min-w-54 min-h-54 flex flex-col items-center justify-center">
                        {qrCode ? (
                          <img src={qrCode} alt="Wallet Connect QR Code" className="w-54 h-54 mx-auto" />
                        ) : (
                          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-t-2 border-foreground"></div>
                        )}
                      </div>
                      <button
                        onClick={() => window.open(`qubic-wallet://pairwc/${connectionURI}`, "_blank")}
                        className="disabled:bg-gray-40 flex items-center justify-center gap-3 rounded-lg bg-primary-40 p-3 text-black"
                        disabled={!connectionURI}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectModal;
