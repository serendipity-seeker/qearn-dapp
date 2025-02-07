import { useTranslation } from "react-i18next";
import { useDisclosure } from "@/hooks/useDisclosure";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import InputNumbers from "@/components/ui/InputNumbers";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useTransferForm } from "@/hooks/useTransferForm";
import AccountSelector from "@/components/ui/AccountSelector";
import InputText from "@/components/ui/InputText";

const TransferForm: React.FC = () => {
  const { t } = useTranslation();
  const { open, onOpen, onClose } = useDisclosure();
  const {
    recipient,
    amount,
    accounts,
    selectedAccount,
    balances,
    handleSubmit,
    handleAmountChange,
    setSelectedAccount,
    handleRecipientChange,
  } = useTransferForm();

  return (
    <Card className="mx-auto w-full max-w-[460px] p-8">
      <div className="space-y-6">
        <h1 className="text-2xl">{t("transferForm.Transfer $QUBIC")}</h1>
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

          <InputText
            id="recipient"
            label={t("transferForm.Recipient Address")}
            placeholder={t("transferForm.Enter recipient address")}
            onChange={handleRecipientChange}
          />
          <InputNumbers
            id="amount"
            label={t("transferForm.Amount")}
            placeholder={t("transferForm.Enter amount")}
            onChange={handleAmountChange}
          />
          <Button
            label={t("transferForm.Send")}
            className="w-full py-4 text-lg font-semibold"
            variant="primary"
            onClick={onOpen}
            disabled={!recipient || !amount}
          />
        </div>
      </div>

      <ConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={handleSubmit}
        title={t("transferForm.Confirm Transfer")}
        description={t("transferForm.Are you sure you want to send {{amount}} QUBIC?", { amount: amount || 0 })}
      />
    </Card>
  );
};

export default TransferForm;
