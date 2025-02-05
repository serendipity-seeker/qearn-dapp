import { useAtom } from "jotai";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { tickInfoAtom } from "@/store/tickInfo";
import { settingsAtom } from "@/store/settings";
import { useEffect, useState } from "react";
import { useQubicConnect } from "./connect/QubicConnectContext";
import { lockQubic } from "@/services/qearn.service";
import { broadcastTx, fetchBalance } from "@/services/rpc.service";
import { toast } from "react-hot-toast";
import InputNumbers from "./ui/InputNumbers";
import { balancesAtom } from "@/store/balances";
import { pendingTxAtom } from "@/store/pendingTx";
import AccountSelector from "./ui/AccountSelector";
import { userLockInfoAtom } from "@/store/userLockInfo";
import { useDisclosure } from "@/hooks/useDisclosure";
import ConfirmModal from "./ui/ConfirmModal";
import { useTranslation } from "react-i18next";

const QearnForm: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [settings] = useAtom(settingsAtom);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const { getSignedTx } = useQubicConnect();
  const [balances] = useAtom(balancesAtom);
  const [, setPendingTx] = useAtom(pendingTxAtom);
  const [userLockInfo] = useAtom(userLockInfoAtom);
  const { open, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  useEffect(() => {
    if (balances.length > 0) {
      setAccounts([{ label: t("qearnForm.Account") + " 1", value: balances[0].id }]);
    }
  }, [balances]);

  const validate = async (): Promise<boolean> => {
    if (!amount || !accounts[selectedAccount].value) {
      toast.error(t("qearnForm.All fields must be filled"));
      return false;
    }

    const targetTick = tickInfo?.tick + settings.tickOffset;
    const walletBalance = (await fetchBalance(accounts[selectedAccount].value)) || 0;

    if (amount > walletBalance.balance) {
      toast.error(t("qearnForm.Amount exceeds wallet balance"));
      return false;
    }

    if (amount < 10000000) {
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
      // const tx = await unLockQubic(accounts[selectedAccount].value, amount, tickInfo?.epoch || 0, tickInfo?.tick + settings.tickOffset);
      const tx = await lockQubic(accounts[selectedAccount].value, amount, tickInfo?.tick + settings.tickOffset);
      const { tx: signedTx } = await getSignedTx(tx);
      const res = await broadcastTx(signedTx);
      setPendingTx({
        txId: res.transactionId,
        publicId: accounts[selectedAccount].value,
        initAmount: userLockInfo[accounts[selectedAccount].value]?.[tickInfo?.epoch || 0] || 0,
        amount: amount,
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
    setAmount(Number(value));
  };

  return (
    <Card className="w-full max-w-[460px] mx-auto p-8">
      <div className="space-y-6">
        <h1 className="text-2xl">{t("qearnForm.Lock $QUBIC")}</h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <AccountSelector
              label="Account"
              options={accounts}
              selected={selectedAccount}
              setSelected={setSelectedAccount}
            />
            <p className="flex justify-between px-4 text-sm text-gray-50">
              <span className="text-primary font-bold">{t("qearnForm.Available")}:</span>{" "}
              <span className="text-primary font-bold">{balances[selectedAccount]?.balance || 0} QUBIC</span>
            </p>
          </div>
          <InputNumbers id="amount" label={t("qearnForm.Lock Amount")} placeholder={t("qearnForm.Enter amount")} onChange={handleAmountChange} />
          <Button label={t("qearnForm.Lock Funds")} className="w-full py-4 text-lg font-semibold" variant="primary" onClick={onOpen} />
        </div>
      </div>

      <ConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={handleSubmit}
        title={t("qearnForm.Lock $QUBIC?")}
        description={
          <div>
            <p>
              {t("qearnForm.Are you sure you want to lock {{amount}}QUBIC?", { amount })}
            </p>
            <p>{t("qearnForm.You will be able to unlock it anytime.")}</p>
          </div>
        }
      />
    </Card>
  );
};

export default QearnForm;
