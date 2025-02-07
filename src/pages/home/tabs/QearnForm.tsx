import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { useDisclosure } from "@/hooks/useDisclosure";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import InputNumbers from "../../../components/ui/InputNumbers";
import AccountSelector from "../../../components/ui/AccountSelector";
import { useQearnForm } from "@/hooks/useQearnForm";
import { useTranslation } from "react-i18next";

const QearnForm: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const {
    selectedAccount,
    setSelectedAccount,
    accounts,
    amount,
    handleAmountChange,
    handleSubmit,
    balances,
  } = useQearnForm();

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
          <InputNumbers 
            id="amount" 
            label={t("qearnForm.Lock Amount")} 
            placeholder={t("qearnForm.Enter amount")} 
            onChange={handleAmountChange} 
          />
          <Button 
            label={t("qearnForm.Lock Funds")} 
            className="w-full py-4 text-lg font-semibold" 
            variant="primary" 
            onClick={onOpen} 
          />
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
