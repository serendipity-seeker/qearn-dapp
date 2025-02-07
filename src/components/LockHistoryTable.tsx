import { useEffect, useState } from "react";
import Card from "./ui/Card";
import { useAtom } from "jotai";
import { userLockInfoAtom } from "@/store/userLockInfo";
import AccountSelector from "./ui/AccountSelector";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { qearnStatsAtom } from "@/store/qearnStat";
import { calculateRewards } from "@/utils";
import { tickInfoAtom } from "@/store/tickInfo";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import Button from "./ui/Button";
import { useDisclosure } from "@/hooks/useDisclosure";
import { toast } from "react-hot-toast";
import { unLockQubic } from "@/services/qearn.service";
import { broadcastTx } from "@/services/rpc.service";
import { pendingTxAtom } from "@/store/pendingTx";
import { settingsAtom } from "@/store/settings";
import { useQubicConnect } from "./connect/QubicConnectContext";
import UnlockModal from "./UnlockModal";
import { useTranslation } from "react-i18next";
import UnlockAmountSettingModal from "./UnlockAmountSettingModal";
import ConfirmModal from "./ui/ConfirmModal";
import { balancesAtom } from "@/store/balances";

interface ITableData {
  lockedEpoch: number;
  lockedAmount: number;
  totalLockedAmountInEpoch: number;
  currentBonusAmountInEpoch: number;
  earlyUnlockReward: { reward: number; ratio: number };
  fullUnlockReward: { reward: number; ratio: number };
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
  const [balances] = useAtom(balancesAtom);
  const { getSignedTx } = useQubicConnect();
  const { open, onOpen, onClose } = useDisclosure();
  const {
    open: unlockAmountSettingOpen,
    onOpen: onUnlockAmountSettingOpen,
    onClose: onUnlockAmountSettingClose,
  } = useDisclosure();
  const { open: reminderOpen, onOpen: onReminderOpen, onClose: onReminderClose } = useDisclosure();
  const { t } = useTranslation();

  const [unlockAmount, setUnlockAmount] = useState<number>(0);
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

  useEffect(() => {
    if (Object.keys(userLockInfo).length > 0) {
      setAccounts([{ label: `${t("qearnForm.Account")} 1`, value: Object.keys(userLockInfo)[0] }]);
    }
  }, [userLockInfo]);

  useEffect(() => {
    if (accounts.length < 0 || !qearnStats || !userLockInfo) return;
    setTableData(
      Object.entries(userLockInfo[accounts[selectedAccount]?.value] || {}).map(([epochStr, amount]) => {
        const lockedEpoch = parseInt(epochStr);
        const rewards = calculateRewards(
          amount,
          qearnStats[lockedEpoch]?.currentLockedAmount || 0,
          qearnStats[lockedEpoch]?.currentBonusAmount || 0,
          qearnStats[lockedEpoch]?.yieldPercentage || 0,
          tickInfo.epoch,
          lockedEpoch,
        );
        return {
          lockedEpoch: lockedEpoch,
          lockedAmount: amount,
          totalLockedAmountInEpoch: qearnStats[lockedEpoch]?.currentLockedAmount || 0,
          currentBonusAmountInEpoch: qearnStats[lockedEpoch]?.currentBonusAmount || 0,
          earlyUnlockReward: { reward: rewards.earlyUnlockReward, ratio: rewards.earlyUnlockRewardRatio },
          fullUnlockReward: { reward: rewards.fullUnlockReward, ratio: rewards.fullUnlockRewardRatio },
        };
      }) as any[],
    );
  }, [accounts, qearnStats, userLockInfo]);

  const handleUnlockEarly = async () => {
    try {
      const balance = balances.find((balance) => balance.id === accounts[selectedAccount].value);
      if (!balance || balance.balance === 0) {
        onReminderOpen();
        return;
      }
      const tx = await unLockQubic(
        accounts[selectedAccount].value,
        unlockAmount,
        tableData[selectedIdx || 0].lockedEpoch,
        tickInfo?.tick + settings.tickOffset,
      );
      const { tx: signedTx } = await getSignedTx(tx);
      const res = await broadcastTx(signedTx);
      setPendingTx({
        txId: res.transactionId,
        publicId: accounts[selectedAccount].value,
        initAmount: userLockInfo[accounts[selectedAccount].value]?.[tableData[selectedIdx || 0].lockedEpoch] || 0,
        amount: -tableData[selectedIdx || 0].lockedAmount || 0,
        epoch: tableData[selectedIdx || 0].lockedEpoch,
        targetTick: tickInfo?.tick + settings.tickOffset,
        type: "qearn",
      });
      toast.success("Transaction sent, it will take some time to be confirmed and executed");
    } catch (err) {
      toast.error("Something went wrong");
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
        onConfirm={handleUnlockEarly}
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
