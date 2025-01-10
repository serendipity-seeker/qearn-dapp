import { useAtom } from 'jotai';
import Card from './ui/Card';
import Button from './ui/Button';
import Dropdown from './ui/Dropdown';
import { tickInfoAtom } from '@/store/tickInfo';
import { settingsAtom } from '@/store/settings';
import { useEffect, useState } from 'react';
import { truncateMiddle } from '@/utils';
import { useQubicConnect } from './connect/QubicConnectContext';
import { lockQubic } from '@/services/qearn.service';
import { broadcastTx, fetchBalance } from '@/services/rpc.service';
import { FaLock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import InputNumbers from './ui/InputNumbers';
import { balancesAtom } from '@/store/balances';
import { pendingTxAtom } from '@/store/pendingTx';

const QearnForm: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [settings] = useAtom(settingsAtom);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const { getSignedTx } = useQubicConnect();
  const [balances] = useAtom(balancesAtom);
  const [pendingTx, setPendingTx] = useAtom(pendingTxAtom);

  useEffect(() => {
    if (balances.length > 0) {
      setAccounts([{ label: truncateMiddle(balances[0].id, 45), value: balances[0].id }]);
    }
  }, [balances]);

  const [formData, setFormData] = useState({
    amount: '',
    targetTick: '',
  });

  useEffect(() => {
    if (tickInfo) {
      const newTargetTick = String(tickInfo.tick + settings.tickOffset);
      if (newTargetTick !== formData.targetTick) {
        setFormData((prev) => ({
          ...prev,
          targetTick: newTargetTick,
        }));
      }
    }
  }, [tickInfo?.tick, settings.tickOffset]);

  const validateForm = async (): Promise<boolean> => {
    if (!formData.amount || !formData.targetTick) {
      toast.error('All fields must be filled');
      return false;
    }

    const amount = Number(formData.amount);
    const targetTick = Number(formData.targetTick);
    const currentTick = tickInfo?.tick || 0;
    const walletBalance = (await fetchBalance(accounts[selectedAccount].value)) || 0;

    if (amount > walletBalance.balance) {
      toast.error('Amount exceeds wallet balance');
      return false;
    }

    if (amount < 100) {
      toast.error('Amount must be at least 10M');
      return false;
    }

    if (targetTick <= currentTick) {
      toast.error('Target tick must be greater than current tick');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    try {
      const tx = await lockQubic(accounts[selectedAccount].value, Number(formData.amount), Number(formData.targetTick));
      const { tx: signedTx } = await getSignedTx(tx);

      const res = await broadcastTx(signedTx);
      setPendingTx({
        txId: res.transactionId,
        publicId: accounts[selectedAccount].value,
        initAmount: balances[selectedAccount].balance,
        amount: Number(formData.amount),
        epoch: tickInfo?.epoch || 0,
        targetTick: Number(formData.targetTick),
        type: 'qearn',
      });
      toast.success('Transaction sent, it will take some time to be confirmed and executed');
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleAmountChange = (value: string) => {
    setFormData((prev) => ({ ...prev, amount: value }));
  };

  return (
    <Card className="w-full max-w-lg p-8 bg-gradient-to-br from-gray-90 to-gray-80">
      <div className="space-y-6">
        <div className="flex items-center justify-center space-x-3">
          <FaLock className="text-3xl text-primary" />
          <h1 className="text-4xl text-center">Qearn</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Dropdown label="Select Account" options={accounts} selected={selectedAccount} setSelected={setSelectedAccount} />
          </div>

          <div>
            <InputNumbers id="amount" label="Lock Amount" placeholder="Enter amount" onChange={handleAmountChange} />
            <p className="text-gray-300 text-sm text-right">
              Balance: <span className="font-bold text-primary">{balances[selectedAccount]?.balance || 0}</span> QUBIC
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <label htmlFor="targetTick" className="text-gray-300">
                Target Tick
              </label>
            </div>
            <input
              id="targetTick"
              type="number"
              className="w-full p-4 bg-gray-80 border-2 border-gray-70 text-white rounded-lg placeholder-gray-500 cursor-not-allowed opacity-75"
              placeholder="Enter target tick"
              value={formData.targetTick}
              disabled={true}
            />
          </div>

          <Button
            label="Lock Funds"
            className="w-full py-4 text-lg font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            type="submit"
            primary={true}
            icon={<FaLock className="mr-2" />}
          />
        </form>
      </div>
    </Card>
  );
};

export default QearnForm;
