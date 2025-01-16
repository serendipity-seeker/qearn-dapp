import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import Card from './ui/Card';
import { balancesAtom } from '@/store/balances';
import { useAtom } from 'jotai';
import { userLockInfoAtom } from '@/store/userLockInfo';
import AccountSelector from './ui/AccountSelector';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { qearnStatsAtom } from '@/store/qearnStat';
import { calculateRewards } from '@/utils';
import { tickInfoAtom } from '@/store/tickInfo';

interface ITableData {
  lockedEpoch: number;
  lockedAmount: number;
  totalLockedAmountInEpoch: number;
  currentBonusAmountInEpoch: number;
  earlyUnlockReward: number;
  fullUnlockReward: number;
}

const LockHistoryTable: React.FC = () => {
  const [showingEnded, setShowingEnded] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [isLoading] = useState(false);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const [balances] = useAtom(balancesAtom);
  const [userLockInfo] = useAtom(userLockInfoAtom);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tableData, setTableData] = useState<ITableData[]>([]);
  const [tickInfo] = useAtom(tickInfoAtom);

  const columnHelper = createColumnHelper<ITableData>();
  const lockedColumns = [
    columnHelper.accessor('lockedEpoch', {
      header: 'Epoch',
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor('lockedAmount', {
      header: 'Locked Amount',
      cell: (info: any) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('totalLockedAmountInEpoch', {
      header: 'Total Locked Amount',
      cell: (info: any) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('currentBonusAmountInEpoch', {
      header: 'Current Bonus Amount',
      cell: (info: any) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('earlyUnlockReward', {
      header: 'Early Unlock %',
      cell: (info: any) => `${info.row.original.earlyUnlockReward.reward.toLocaleString()} / ${info.row.original.earlyUnlockReward.ratio.toFixed(2)}%`,
    }),
    columnHelper.accessor('fullUnlockReward', {
      header: 'Full Unlock %',
      cell: (info: any) => `${info.row.original.fullUnlockReward.reward.toLocaleString()} / ${info.row.original.fullUnlockReward.ratio.toFixed(2)}%`,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: () => <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Unlock Early</button>,
    }),
  ];
  const table = useReactTable({
    data: tableData,
    columns: lockedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (balances.length > 0) {
      setAccounts([{ label: `Account 1`, value: balances[0].id }]);
    }
  }, [balances]);

  useEffect(() => {
    if (accounts.length < 0 || !qearnStats || !userLockInfo || !balances) return;
    setTableData(
      Object.entries(userLockInfo[balances[selectedAccount]?.id] || {}).map(([epochStr, amount]) => {
        const lockedEpoch = parseInt(epochStr);
        const rewards = calculateRewards(
          amount,
          qearnStats[lockedEpoch].currentLockedAmount,
          qearnStats[lockedEpoch].currentBonusAmount,
          qearnStats[lockedEpoch].yieldPercentage,
          tickInfo.epoch,
          lockedEpoch
        );
        return {
          lockedEpoch: lockedEpoch,
          lockedAmount: amount,
          totalLockedAmountInEpoch: qearnStats[lockedEpoch].currentLockedAmount,
          currentBonusAmountInEpoch: qearnStats[lockedEpoch].currentBonusAmount,
          earlyUnlockReward: { reward: rewards.earlyUnlockReward, ratio: rewards.earlyUnlockRewardRatio },
          fullUnlockReward: { reward: rewards.fullUnlockReward, ratio: rewards.fullUnlockRewardRatio },
        };
      }) as any[]
    );
  }, [accounts, qearnStats, userLockInfo, balances]);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <AccountSelector label="Select Account" options={accounts} selected={selectedAccount} setSelected={setSelectedAccount} />

        <div className="flex justify-between items-center">
          <Switch
            checked={showingEnded}
            onChange={setShowingEnded}
            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
            />
          </Switch>
          <span className="text-sm">{showingEnded ? 'Showing Unlocked' : 'Showing Locked'}</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-700">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={showingEnded ? 3 : 8} className="text-center py-8">
                      No data available
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LockHistoryTable;
