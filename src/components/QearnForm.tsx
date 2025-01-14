import { useAtom } from 'jotai';
import Card from './ui/Card';
import Button from './ui/Button';
import { tickInfoAtom } from '@/store/tickInfo';
import { settingsAtom } from '@/store/settings';
import { useEffect, useState } from 'react';
import { useQubicConnect } from './connect/QubicConnectContext';
import { lockQubic, unLockQubic } from '@/services/qearn.service';
import { broadcastTx, fetchBalance } from '@/services/rpc.service';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import InputNumbers from './ui/InputNumbers';
import { balancesAtom } from '@/store/balances';
import { pendingTxAtom } from '@/store/pendingTx';
import AccountSelector from './ui/AccountSelector';

const QearnForm: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [settings] = useAtom(settingsAtom);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const { getSignedTx } = useQubicConnect();
  const [balances] = useAtom(balancesAtom);
  const [, setPendingTx] = useAtom(pendingTxAtom);

  useEffect(() => {
    if (balances.length > 0) {
      setAccounts([{ label: `Account 1`, value: balances[0].id }]);
    }
  }, [balances]);

  const validate = async (): Promise<boolean> => {
    if (!amount || !accounts[selectedAccount].value) {
      toast.error('All fields must be filled');
      return false;
    }

    const targetTick = tickInfo?.tick + settings.tickOffset;
    const walletBalance = (await fetchBalance(accounts[selectedAccount].value)) || 0;

    if (amount > walletBalance.balance) {
      toast.error('Amount exceeds wallet balance');
      return false;
    }

    if (amount < 10000000) {
      toast.error('Amount must be at least 10M');
      return false;
    }

    if (!targetTick) {
      toast.error('Target tick is not set');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    toast.error('SUBMITTING...');
    if (!(await validate())) {
      return;
    }

    try {
      // const tx = await unLockQubic(accounts[selectedAccount].value, amount, tickInfo?.epoch || 0, tickInfo?.tick + settings.tickOffset);
      const tx = await lockQubic(accounts[selectedAccount].value, amount, tickInfo?.tick + settings.tickOffset);
      const { tx: signedTx } = await getSignedTx(tx);

      const res = await broadcastTx(signedTx);
      setPendingTx({
        txId: res.transactionId,
        publicId: accounts[selectedAccount].value,
        initAmount: balances[selectedAccount].balance,
        amount,
        epoch: tickInfo?.epoch || 0,
        targetTick: tickInfo?.tick + settings.tickOffset,
        type: 'qearn',
      });
      toast.success('Transaction sent, it will take some time to be confirmed and executed');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(Number(value));
  };

  return (
    <Card className="w-full max-w-lg p-8 bg-gradient-to-br from-gray-90 to-gray-80">
      <div className="space-y-6">
        <h1 className="text-4xl">Lock $QUBIC</h1>

        <div className="space-y-6">
          <AccountSelector label="Select Account" options={accounts} selected={selectedAccount} setSelected={setSelectedAccount} />

          <div>
            <InputNumbers id="amount" label="Lock Amount" placeholder="Enter amount" onChange={handleAmountChange} />
            <p className="text-gray-300 text-sm text-right">
              Balance: <span className="font-bold text-primary">{balances[selectedAccount]?.balance || 0}</span> QUBIC
            </p>
          </div>

          <Button
            label="Lock Funds"
            className="w-full py-4 text-lg font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            type="submit"
            primary={true}
            icon={<FaLock className="mr-2" />}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Card>
  );
};

export default QearnForm;
