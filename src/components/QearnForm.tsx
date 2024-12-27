import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import Card from './ui/Card';
import Button from './ui/Button';
import { tickInfoAtom } from '@/store/tickInfo';
import { settingsAtom } from '@/store/settings';

interface QearnFormInputs {
  account: string;
  amount: number;
  targetTick: number;
}

const QearnForm: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);
  const [settings] = useAtom(settingsAtom);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QearnFormInputs>({
    defaultValues: {
      account: '',
      amount: 0,
      targetTick: tickInfo?.tick ? tickInfo.tick + 1 : 0,
    },
  });

  const onSubmit = (data: QearnFormInputs) => {
    console.log(data);
  };

  return (
    <Card className="max-w-lg p-6">
      <div className="space-y-4">
        <h1 className="text-3xl text-center">Qearn</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Lock Amount
            </label>
            <input
              type="number"
              id="amount"
              className="w-full px-3 py-2 bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
              {...register('amount', { required: 'Amount is required', min: { value: 0, message: 'Amount must be positive' } })}
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="targetTick" className="block text-sm font-medium">
              Target Tick
            </label>
            <input
              type="number"
              id="targetTick"
              className="w-full px-3 py-2 bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"
              {...register('targetTick', {
                required: 'Target tick is required',
                min: {
                  value: tickInfo?.tick ? tickInfo.tick + settings.tickOffset : 0,
                  message: 'Target tick must be greater than current tick',
                },
              })}
            />
            {errors.targetTick && <p className="text-red-500 text-sm">{errors.targetTick.message}</p>}
          </div>

          <Button label="Lock" className="w-full" type="submit"/>
        </form>
      </div>
    </Card>
  );
};

export default QearnForm;
