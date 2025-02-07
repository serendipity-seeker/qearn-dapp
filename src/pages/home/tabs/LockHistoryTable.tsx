import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import AccountSelector from "../../../components/ui/AccountSelector";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import Button from "../../../components/ui/Button";
import { useDisclosure } from "@/hooks/useDisclosure";
import UnlockModal from "./UnlockModal";
import { useTranslation } from "react-i18next";
import UnlockAmountSettingModal from "./UnlockAmountSettingModal";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { useLockHistory } from "@/hooks/useLockHistory";

interface ITableData {
  lockedEpoch: number;
  lockedAmount: number;
  totalLockedAmountInEpoch: number;
  currentBonusAmountInEpoch: number;
  earlyUnlockReward: { reward: number; ratio: number };
  fullUnlockReward: { reward: number; ratio: number };
}

const LockHistoryTable: React.FC = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: unlockAmountSettingOpen,
    onOpen: onUnlockAmountSettingOpen,
    onClose: onUnlockAmountSettingClose,
  } = useDisclosure();
  const { open: reminderOpen, onOpen: onReminderOpen, onClose: onReminderClose } = useDisclosure();
  const [unlockAmount, setUnlockAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const {
    selectedAccount,
    accounts,
    tableData,
    sorting,
    selectedIdx,
    setSelectedAccount,
    setSorting,
    setSelectedIdx,
    handleUnlockEarly,
  } = useLockHistory();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const columnHelper = createColumnHelper<ITableData>();
  const lockedColumns = [
    columnHelper.accessor("lockedEpoch", {
      header: t("lockHistoryTable.Epoch"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("lockedAmount", {
      header: t("lockHistoryTable.Locked Amount"),
      cell: (info: any) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor("totalLockedAmountInEpoch", {
      header: t("lockHistoryTable.Total Locked Amount"),
      cell: (info: any) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor("currentBonusAmountInEpoch", {
      header: t("lockHistoryTable.Current Bonus Amount"),
      cell: (info: any) => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor("earlyUnlockReward", {
      header: t("lockHistoryTable.Current Reward %"),
      cell: (info: any) =>
        `${info.row.original.earlyUnlockReward.reward.toLocaleString()} / ${info.row.original.earlyUnlockReward.ratio.toFixed(2)}%`,
    }),
    columnHelper.accessor("fullUnlockReward", {
      header: t("lockHistoryTable.Full Reward %"),
      cell: (info: any) =>
        `${info.row.original.fullUnlockReward.reward.toLocaleString()} / ${info.row.original.fullUnlockReward.ratio.toFixed(2)}%`,
    }),
    columnHelper.display({
      id: "actions",
      header: t("lockHistoryTable.Actions"),
      cell: (info: any) => (
        <Button
          className="bg-blue-500 px-4 py-2 transition-colors"
          variant="primary"
          label={t("lockHistoryTable.Unlock Early")}
          onClick={() => {
            setSelectedIdx(info.row.index);
            onUnlockAmountSettingOpen();
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

  const handleUnlock = async () => {
    const result = await handleUnlockEarly(unlockAmount);
    if (result.shouldShowReminder) {
      onReminderOpen();
    }
    if (result.success) {
      onClose();
    }
  };

  return (
    <Card className="w-full space-y-6 overflow-hidden p-3 md:p-6">
      <div className="w-full space-y-4">
        <AccountSelector
          label={t("connect.Select Account")}
          options={accounts}
          selected={selectedAccount}
          setSelected={setSelectedAccount}
        />

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-white"></div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="overflow-x-auto rounded-lg border border-card-border">
              <thead className="bg-gray-90">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="group cursor-pointer text-nowrap px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-200"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <div className="opacity-0 transition-opacity group-hover:opacity-100">
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
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center">
                      {t("lockHistoryTable.No data available")}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="text-nowrap px-4 py-4 text-center text-sm">
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
      <UnlockModal
        open={open}
        onClose={onClose}
        onConfirm={handleUnlock}
        data={{
          currentReward: tableData[selectedIdx || 0]?.earlyUnlockReward?.reward || 0,
          lockedAmount: tableData[selectedIdx || 0]?.lockedAmount || 0,
          apy: tableData[selectedIdx || 0]?.earlyUnlockReward?.ratio || 0,
          epoch: tableData[selectedIdx || 0]?.lockedEpoch || 0,
          unlockAmount,
        }}
      />
      <UnlockAmountSettingModal
        open={unlockAmountSettingOpen}
        onClose={onUnlockAmountSettingClose}
        onConfirm={(amount) => {
          setUnlockAmount(amount);
          onOpen();
        }}
        maxAmount={tableData[selectedIdx || 0]?.lockedAmount || 0}
      />
      <ConfirmModal
        open={reminderOpen}
        onClose={onReminderClose}
        onConfirm={onReminderClose}
        title={t("modal.Account Balance is 0")}
        description={t("modal.To Unlock Qubic, you need to hold at least 1 $QUBIC in your account")}
      />
    </Card>
  );
};

export default LockHistoryTable;
