import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQubicConnect } from "../components/connect/QubicConnectContext";
import { lockQubic } from "@/services/qearn.service";
import { broadcastTx, fetchBalance } from "@/services/rpc.service";
import { tickInfoAtom } from "@/store/tickInfo";
import { settingsAtom } from "@/store/settings";
import { balancesAtom } from "@/store/balances";
import { pendingTxAtom } from "@/store/pendingTx";
import { userLockInfoAtom } from "@/store/userLockInfo";

export const useQearnForm = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [settings] = useAtom(settingsAtom);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const [amount, setAmount] = useState<string>("");
  const { getSignedTx } = useQubicConnect();
  const [balances] = useAtom(balancesAtom);
  const [, setPendingTx] = useAtom(pendingTxAtom);
  const [userLockInfo] = useAtom(userLockInfoAtom);
  const { t } = useTranslation();

  useEffect(() => {
    if (balances.length > 0) {
      setAccounts([{ label: t("qearnForm.Account") + " 1", value: balances[0].id }]);
    } else {
      setAccounts([]);
    }
  }, [balances]);

  const validate = async (): Promise<boolean> => {
    const numAmount = Number(amount);
    if (!numAmount || !accounts[selectedAccount]?.value) {
      toast.error(t("qearnForm.All fields must be filled"));
      return false;
    }

    const targetTick = tickInfo?.tick + settings.tickOffset;
    const walletBalance = (await fetchBalance(accounts[selectedAccount].value)) || 0;

    if (numAmount > Number(walletBalance.balance)) {
      toast.error(t("qearnForm.Amount exceeds wallet balance"));
      return false;
    }

    if (numAmount < 10000000) {
      toast.error(t("qearnForm.Amount must be at least 10M"));
      return false;
    }

    if (!targetTick) {
      toast.error(t("qearnForm.Target tick is not set"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!(await validate())) return;

    try {
      const numAmount = Number(amount);
      const tx = await lockQubic(accounts[selectedAccount].value, numAmount, tickInfo?.tick + settings.tickOffset);
      const { tx: signedTx } = await getSignedTx(tx);
      const res = await broadcastTx(signedTx);
      setPendingTx({
        txId: res.transactionId,
        publicId: accounts[selectedAccount].value,
        initAmount: userLockInfo[accounts[selectedAccount].value]?.[tickInfo?.epoch || 0] || 0,
        amount: numAmount,
        epoch: tickInfo?.epoch || 0,
        targetTick: tickInfo?.tick + settings.tickOffset,
        type: "qearn",
      });
      toast.success(t("qearnForm.Transaction sent, it will take some time to be confirmed and executed"));
    } catch (err) {
      toast.error(t("qearnForm.Something went wrong"));
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  return {
    selectedAccount,
    setSelectedAccount,
    accounts,
    amount,
    handleAmountChange,
    handleSubmit,
    balances,
  };
}; 