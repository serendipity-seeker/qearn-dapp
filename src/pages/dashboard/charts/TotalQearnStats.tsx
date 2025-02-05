import { useAtom } from "jotai";
import { qearnStatsAtom } from "@/store/qearnStat";
import Card from "@/components/ui/Card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState, useMemo, useEffect } from "react";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { IBurnNBoostedStats } from "@/types";
import { getBurnedAndBoostedStats } from "@/services/qearn.service";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

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
  const [sorting, setSorting] = useState<SortingState>([{ id: "epoch", desc: true }]);
  const [burnNBoostedStats, setBurnNBoostedStats] = useState<IBurnNBoostedStats>({} as IBurnNBoostedStats);
  const { t } = useTranslation();

  useEffect(() => {
    getBurnedAndBoostedStats().then((stats) => setBurnNBoostedStats(stats));
  }, []);

  const columnHelper = createColumnHelper<ITableData>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("epoch", {
        header: t("lockHistoryTable.Epoch"),
        cell: (info) => <span className="font-semibold">EP{info.getValue()}</span>,
        sortingFn: "basic",
      }),
      columnHelper.accessor("lockedAmount", {
        header: t("dashboard.Locked Amount"),
        cell: (info) => (
          <span className="font-medium text-emerald-500 dark:text-emerald-400">
            {info.getValue()?.toLocaleString()}
          </span>
        ),
        sortingFn: "basic",
      }),
      columnHelper.accessor("bonusAmount", {
        header: t("dashboard.Bonus Amount"),
        cell: (info) => (
          <span className="font-medium text-blue-500 dark:text-blue-400">{info.getValue()?.toLocaleString()}</span>
        ),
        sortingFn: "basic",
      }),
      columnHelper.accessor("yieldPercentage", {
        header: t("dashboard.APY %"),
        cell: (info) => (
          <span className="font-medium text-yellow-500 dark:text-yellow-400">
            {(info.getValue() / 100000).toFixed(2)}%
          </span>
        ),
        sortingFn: "basic",
      }),
      columnHelper.accessor("burnedAmount", {
        header: t("dashboard.Burned"),
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-red-500 dark:text-red-400">{info.getValue()?.toLocaleString()}</span>
            <span className="text-xs text-foreground">({(info.row.original.burnedPercent / 100000).toFixed(2)}%)</span>
          </div>
        ),
        sortingFn: "basic",
      }),
      columnHelper.accessor("boostedAmount", {
        header: t("dashboard.Boosted"),
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-purple-500 dark:text-purple-400">
              {info.getValue()?.toLocaleString()}
            </span>
            <span className="text-xs text-foreground">({(info.row.original.boostedPercent / 100000).toFixed(2)}%)</span>
          </div>
        ),
        sortingFn: "basic",
      }),
      columnHelper.accessor("rewardedAmount", {
        header: t("dashboard.Rewarded"),
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium text-orange-500 dark:text-orange-400">
              {info.getValue()?.toLocaleString()}
            </span>
            <span className="text-xs text-foreground">
              ({(info.row.original.rewardedPercent / 100000).toFixed(2)}%)
            </span>
          </div>
        ),
        sortingFn: "basic",
      }),
    ],
    [i18n.language],
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
    [qearnStats],
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
    <Card className="space-y-8 overflow-hidden p-4 md:p-8">
      <div className="space-y-6">
        <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-center text-4xl font-bold text-transparent">
          {t("dashboard.Qearn Overview")}
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="space-y-2 p-4">
            <p className="text-sm text-foreground">{t("dashboard.Total Lock Amount")}</p>
            <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
              {(qearnStats.totalLockAmount + qearnStats.totalBonusAmount)?.toLocaleString() || 0}
            </p>
          </Card>
          <Card className="space-y-2 p-4">
            <p className="text-sm text-foreground">{t("dashboard.Total Burned Amount")}</p>
            <p className="text-2xl font-bold text-red-500 dark:text-red-400">
              {burnNBoostedStats.burnedAmount?.toLocaleString() || 0}
            </p>
          </Card>
          <Card className="space-y-2 p-4">
            <p className="text-sm text-foreground">{t("dashboard.Average APY")}</p>
            <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">
              {(qearnStats.averageYieldPercentage / 100000).toFixed(2) || 0}%
            </p>
          </Card>
        </div>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-90">
          <table className="min-w-full divide-y divide-gray-90">
            <thead className="bg-gray-90">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="group cursor-pointer text-nowrap px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-200"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <div
                            className={`${header.column.getIsSorted() ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                          >
                            {{
                              asc: <MdArrowUpward className="h-4 w-4" />,
                              desc: <MdArrowDownward className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <div className="flex h-4 w-4 flex-col">
                                <MdArrowUpward className="h-3 w-3" />
                                <MdArrowDownward className="h-3 w-3" />
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
            <tbody className="divide-y divide-card-border">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-90/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="text-nowrap px-3 py-2 text-center text-sm">
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
