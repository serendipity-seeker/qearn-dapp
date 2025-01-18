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
import { useDisclosure } from '@/hooks/useDisclosure';
import ConfirmModal from './ui/ConfirmModal';
import { toast } from 'react-hot-toast';
import { lockQubic, unLockQubic } from '@/services/qearn.service';
import { broadcastTx } from '@/services/rpc.service';
import { pendingTxAtom } from '@/store/pendingTx';
import { settingsAtom } from '@/store/settings';
import { useQubicConnect } from './connect/QubicConnectContext';
import UnlockModal from './UnlockModal';

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
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [, setPendingTx] = useAtom(pendingTxAtom);
  const [settings] = useAtom(settingsAtom);
  const { getSignedTx } = useQubicConnect();
  const { open, onOpen, onClose } = useDisclosure();

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
      header: 'Current Reward %',
      cell: (info: any) => `${info.row.original.earlyUnlockReward.reward.toLocaleString()} / ${info.row.original.earlyUnlockReward.ratio.toFixed(2)}%`,
    }),
    columnHelper.accessor('fullUnlockReward', {
      header: 'Full Reward %',
      cell: (info: any) => `${info.row.original.fullUnlockReward.reward.toLocaleString()} / ${info.row.original.fullUnlockReward.ratio.toFixed(2)}%`,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info: any) => (
        <Button
          className="px-4 py-2 bg-blue-500 transition-colors"
          primary={true}
          label="Unlock Early"
          onClick={() => {
            setSelectedIdx(info.row.index);
            onOpen();
          }}
        />
      ),
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

  const handleUnlockEarly = async () => {
    try {
      const tx = await unLockQubic(accounts[selectedAccount].value, tableData[selectedIdx || 0].lockedAmount, tickInfo?.epoch || 0, tickInfo?.tick + settings.tickOffset);
      const { tx: signedTx } = await getSignedTx(tx);
      const res = await broadcastTx(signedTx);
      setPendingTx({
        txId: res.transactionId,
        publicId: accounts[selectedAccount].value,
        initAmount: userLockInfo[accounts[selectedAccount].value]?.[tickInfo?.epoch || 0] || 0,
        amount: -tableData[selectedIdx || 0].lockedAmount || 0,
        epoch: tickInfo?.epoch || 0,
        targetTick: tickInfo?.tick + settings.tickOffset,
        type: 'qearn',
      });
      toast.success('Transaction sent, it will take some time to be confirmed and executed');
    } catch (err) {
      toast.error('Something went wrong');
      console.log(err);
    }
  };

  return (
    <Card className="p-6 space-y-6 overflow-hidden">
      <div className="space-y-4">
        <AccountSelector label="Select Account" options={accounts} selected={selectedAccount} setSelected={setSelectedAccount} />

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="divide-y divide-gray-700">
              <thead className="bg-gray-90">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer group text-nowrap"
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
                        <td key={cell.id} className="px-4 py-4 text-nowrap text-sm text-center">
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
      <UnlockModal open={open} onClose={onClose} onConfirm={handleUnlockEarly} />
    </Card>
  );
};

export default LockHistoryTable;
