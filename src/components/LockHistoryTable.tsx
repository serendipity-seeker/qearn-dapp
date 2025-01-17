import { useEffect, useState } from 'react';
import Card from './ui/Card';
import { useAtom } from 'jotai';
import { userLockInfoAtom } from '@/store/userLockInfo';
import AccountSelector from './ui/AccountSelector';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel } from '@tanstack/react-table';
import { qearnStatsAtom } from '@/store/qearnStat';
import { calculateRewards } from '@/utils';
import { tickInfoAtom } from '@/store/tickInfo';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import Button from './ui/Button';

interface ITableData {
  lockedEpoch: number;
  lockedAmount: number;
  totalLockedAmountInEpoch: number;
  currentBonusAmountInEpoch: number;
  earlyUnlockReward: number;
  fullUnlockReward: number;
}

const LockHistoryTable: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [isLoading] = useState(false);
  const [accounts, setAccounts] = useState<{ label: string; value: string }[]>([]);
  const [userLockInfo] = useAtom(userLockInfoAtom);
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [tableData, setTableData] = useState<ITableData[]>([]);
  const [tickInfo] = useAtom(tickInfoAtom);
  const [sorting, setSorting] = useState<SortingState>([]);

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
      cell: () => <Button className="px-4 py-2 bg-blue-500 transition-colors" primary={true} label="Unlock Early" />,
    }),
  ];
  const table = useReactTable({
    data: tableData,
    columns: lockedColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    if (Object.keys(userLockInfo).length > 0) {
      setAccounts([{ label: `Account 1`, value: Object.keys(userLockInfo)[0] }]);
    }
  }, [userLockInfo]);

  useEffect(() => {
    if (accounts.length < 0 || !qearnStats || !userLockInfo) return;
    setTableData(
      Object.entries(userLockInfo[accounts[selectedAccount]?.value] || {}).map(([epochStr, amount]) => {
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
  }, [accounts, qearnStats, userLockInfo]);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <AccountSelector label="Select Account" options={accounts} selected={selectedAccount} setSelected={setSelectedAccount} />

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
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {{
                                asc: <MdArrowUpward className="w-4 h-4" />,
                                desc: <MdArrowDownward className="w-4 h-4" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <div className="w-4 h-4 flex flex-col">
                                  <MdArrowUpward className="w-3 h-3" />
                                  <MdArrowDownward className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-700">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
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
