import lock from "../../assets/lock.svg";
import unlocked from "../../assets/unlocked.svg";
import ConnectModal from "./ConnectModal";
import { useQubicConnect } from "./QubicConnectContext";
import { useTranslation } from "react-i18next";

const ConnectLink: React.FC<{ darkMode?: boolean }> = ({ darkMode }) => {
  const { connected, showConnectModal, toggleConnectModal } = useQubicConnect();
  const { t } = useTranslation();

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-center gap-[10px] transition-opacity hover:text-primary-40"
        onClick={() => toggleConnectModal()}
      >
        {connected ? (
          <>
            <span className="mt-[5px] font-space text-[16px] font-[500] text-foreground hover:text-primary-40">
              {t("connect.Connected")}
            </span>
            <img src={lock} alt="locked lock icon" className="hover:opacity-80" />
          </>
        ) : (
          <>
            <span className="mt-[5px] font-space text-[16px] font-[500] text-foreground hover:text-primary-40">
              {t("connect.Connect Wallet")}
            </span>
            <img src={unlocked} alt="unlocked lock icon" className="hover:opacity-80" />
          </>
        )}
      </div>
      <ConnectModal open={showConnectModal} onClose={() => toggleConnectModal()} darkMode={darkMode} />
    </>
  );
};

export default ConnectLink;
