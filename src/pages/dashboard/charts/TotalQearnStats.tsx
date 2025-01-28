import { useAtom } from 'jotai';
import { qearnStatsAtom } from '@/store/qearnStat';
import Card from '@/components/ui/Card';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, SortingState, getSortedRowModel } from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';

interface ITableData {
  epoch: number;
  lockedAmount: number;
  bonusAmount: number;
  yieldPercentage: number;
  burnedAmount: number;
  burnedPercent: number;
  boostedAmount: number;
  boostedPercent: number;
  rewardedAmount: number;
  rewardedPercent: number;
}

const TotalQearnStats: React.FC = () => {
  const [qearnStats] = useAtom(qearnStatsAtom);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'epoch', desc: true }]);

  const columnHelper = createColumnHelper<ITableData>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('epoch', {
        header: 'Epoch',
        cell: (info) => info.getValue(),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('lockedAmount', {
        header: 'Locked Amount',
        cell: (info) => info.getValue()?.toLocaleString(),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('bonusAmount', {
        header: 'Bonus Amount',
        cell: (info) => info.getValue()?.toLocaleString(),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('yieldPercentage', {
        header: 'APY %',
        cell: (info) => (info.getValue() / 100000).toFixed(2) + '%',
        sortingFn: 'basic',
      }),
      columnHelper.accessor('burnedAmount', {
        header: 'Burned',
        cell: (info) => (
          <div className="flex flex-col">
            <span>{info.getValue()?.toLocaleString()}</span>
            <span className="text-gray-500">({(info.row.original.burnedPercent / 100000).toFixed(2)}%)</span>
          </div>
        ),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('boostedAmount', {
        header: 'Boosted',
        cell: (info) => (
          <div className="flex flex-col">
            <span>{info.getValue()?.toLocaleString()}</span>
            <span className="text-gray-500">({(info.row.original.boostedPercent / 100000).toFixed(2)}%)</span>
          </div>
        ),
        sortingFn: 'basic',
      }),
      columnHelper.accessor('rewardedAmount', {
        header: 'Rewarded',
        cell: (info) => (
          <div className="flex flex-col">
            <span>{info.getValue()?.toLocaleString()}</span>
            <span className="text-gray-500">({(info.row.original.rewardedPercent / 100000).toFixed(2)}%)</span>
          </div>
        ),
        sortingFn: 'basic',
      }),
    ],
    []
  );

  const tableData = useMemo(
    () =>
      Object.entries(qearnStats)
        .filter(([epoch]) => Number(epoch))
        .map(([epoch, stats]) => ({
          epoch: Number(epoch),
          lockedAmount: stats.currentLockedAmount,
          bonusAmount: stats.currentBonusAmount,
          yieldPercentage: stats.yieldPercentage,
          burnedAmount: stats.burnedAmount,
          burnedPercent: stats.burnedPercent,
          boostedAmount: stats.boostedAmount,
          boostedPercent: stats.boostedPercent,
          rewardedAmount: stats.rewardedAmount,
          rewardedPercent: stats.rewardedPercent,
        })),
    [qearnStats]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    enableMultiSort: false,
  });

  return (
    <Card className="p-6 space-y-6 overflow-hidden">
      <div className="space-y-4">
        <h1 className="text-3xl text-center">Total Qearn Stats</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-gray-500">Total Initial Lock Amount</p>
            <p className="text-2xl font-semibold">{qearnStats.totalInitialLockAmount?.toLocaleString() || 0}</p>
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-sm text-gray-500">Total Initial Bonus Amount</p>
            <p className="text-2xl font-semibold">{qearnStats.totalInitialBonusAmount?.toLocaleString() || 0}</p>
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-sm text-gray-500">Total Lock Amount</p>
            <p className="text-2xl font-semibold">{qearnStats.totalLockAmount?.toLocaleString() || 0}</p>
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-sm text-gray-500">Total Bonus Amount</p>
            <p className="text-2xl font-semibold">{qearnStats.totalBonusAmount?.toLocaleString() || 0}</p>
          </div>
          <div className="space-y-2 flex-1">
            <p className="text-sm text-gray-500">Average APY</p>
            <p className="text-2xl font-semibold">{(qearnStats.averageYieldPercentage / 100000).toFixed(2) || 0}%</p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="divide-y divide-gray-700 min-w-full">
            <thead className="bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-center text-xs font-medium text-foreground uppercase tracking-wider cursor-pointer group text-nowrap"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2 justify-center">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <div className={`${header.column.getIsSorted() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
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
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 text-nowrap text-sm text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default TotalQearnStats;
