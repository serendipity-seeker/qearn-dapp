import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { tickInfoAtom } from "@/store/tickInfo";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { broadcastTx, fetchBalance } from "@/services/rpc.service";
import { useQubicConnect } from "@/components/connect/QubicConnectContext";
import { createTx } from "@/services/tx.service";
import { balancesAtom } from "@/store/balances";
import { pendingTxAtom } from "@/store/pendingTx";
import { settingsAtom } from "@/store/settings";
export const useTransferForm = () => {
  const { t } = useTranslation();
  const [tickInfo] = useAtom(tickInfoAtom);
  const [, setPendingTx] = useAtom(pendingTxAtom);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const { getSignedTx } = useQubicConnect();
  const [balances] = useAtom(balancesAtom);
  const [settings] = useAtom(settingsAtom);

  useEffect(() => {
    if (balances.length > 0) {
      setAccounts([{ label: t("qearnForm.Account") + " 1", value: balances[0].id }]);
    }
  }, [balances]);

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const validate = async (): Promise<boolean> => {
    const numAmount = Number(amount);
    if (!numAmount || !accounts[selectedAccount]?.value || !recipient) {
      toast.error(t("qearnForm.All fields must be filled"));
      return false;
    }

    const walletBalance = (await fetchBalance(accounts[selectedAccount].value)) || 0;

    if (numAmount > Number(walletBalance.balance)) {
      toast.error(t("qearnForm.Amount exceeds wallet balance"));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!(await validate())) return;

    try {
      const numAmount = Number(amount);
      const tx = createTx(accounts[selectedAccount].value, recipient, numAmount, tickInfo?.tick + settings.tickOffset);
      const { tx: signedTx } = await getSignedTx(tx);
      const result = await broadcastTx(signedTx);

      if (result.error) {
        throw new Error(result.error);
      }
      setPendingTx({
        txId: result.transactionId,
        publicId: accounts[selectedAccount].value,
        initAmount: Number(balances[selectedAccount].balance),
        amount: numAmount,
        epoch: tickInfo?.epoch || 0,
        targetTick: tickInfo?.tick,
        type: "transfer",
      });
      toast.success(t("qearnForm.Transaction submitted"));
      setRecipient("");
      setAmount("");
    } catch (error) {
      toast.error(t("qearnForm.Something went wrong"));
    }
  };

  return {
    recipient,
    amount,
    handleRecipientChange,
    handleAmountChange,
    handleSubmit,
    tickInfo,
    accounts,
    selectedAccount,
    setSelectedAccount,
    balances,
  };
};
