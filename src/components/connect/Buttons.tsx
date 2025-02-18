import { MetaMaskLogo } from "./MetaMaskLogo.tsx";
import { MetaMaskFlaskLogo } from "./MetaMaskFlaskLogo.tsx";

import type { MetamaskState } from "./MetamaskContext.tsx";

import type { Snap } from "./types";
import { isLocalSnap } from "./utils/snap";
import { useTranslation } from "react-i18next";

export const shouldDisplayReconnectButton = (installedSnap?: Snap) => installedSnap && isLocalSnap(installedSnap?.id);

const btnClasses = "bg-primary-40 p-3 rounded-lg text-black flex items-center justify-center gap-3 disabled:bg-gray-40";

export const InstallButton = () => {
  const { t } = useTranslation();

  return (
    <button className={btnClasses} onClick={() => (window.location.href = "https://metamask.io/")}>
      <MetaMaskLogo />
      {t("connect.Install MetaMask")}
    </button>
  );
};

export const ConnectButton = (props: any) => {
  const { t } = useTranslation();

  return (
    <button className={btnClasses} onClick={props.onClick}>
      {props.isFlask ? <MetaMaskFlaskLogo /> : <MetaMaskLogo />}
      {t("connect.Connect")}
    </button>
  );
};

export const ReconnectButton = (props: any) => {
  const { t } = useTranslation();

  return (
    <button className={btnClasses} onClick={props.onClick}>
      <MetaMaskFlaskLogo />
      {t("connect.Reconnect")}
    </button>
  );
};

export const HeaderButtons = ({ state, onConnectClick }: { state: MetamaskState; onConnectClick(): unknown }) => {
  const { t } = useTranslation();

  if (!state.snapsDetected && !state.installedSnap) {
    return <InstallButton />;
  }

  if (!state.installedSnap) {
    return <ConnectButton onClick={onConnectClick} isFlask={state.isFlask} />;
  }

  if (shouldDisplayReconnectButton(state.installedSnap)) {
    return <ReconnectButton onClick={onConnectClick} />;
  }

  return (
    <button disabled className={btnClasses}>
      <MetaMaskLogo /> {t("connect.Connected")}
    </button>
  );
};
