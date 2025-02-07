import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import { base64ToUint8Array, uint8ArrayToBase64 } from "@/utils";
import { createTx } from "@/services/tx.service";
import { useAtomValue } from "jotai";
import { tickInfoAtom } from "@/store/tickInfo";
import { useQubicConnect } from "@/components/connect/QubicConnectContext";
import { DynamicPayload } from "@qubic-lib/qubic-ts-library/dist/qubic-types/DynamicPayload";
import { renderInput, renderOutput } from "./common";

const initialTxForm = {
  sourceId: "",
  destinationId: "",
  amount: "",
  tick: "",
  inputType: "",
  inputSize: "",
  payload: "",
};

export const TransactionCreator = () => {
  const [txForm, setTxForm] = useState(initialTxForm);
  const [tx, setTx] = useState<Uint8Array | null>(null);
  const tickInfo = useAtomValue(tickInfoAtom);
  const { getSignedTx } = useQubicConnect();

  const handleCreateTx = async () => {
    try {
      if (!txForm.sourceId || !txForm.destinationId || !txForm.amount) {
        return toast.error("Please fill in required fields");
      }
      if (txForm.sourceId.length !== 60 || !/^[A-Z]{60}$/.test(txForm.sourceId)) {
        return toast.error("Invalid source ID - must be 60 uppercase English characters");
      }
      if (txForm.destinationId.length !== 60 || !/^[A-Z]{60}$/.test(txForm.destinationId)) {
        return toast.error("Invalid destination ID - must be 60 uppercase English characters"); 
      }
      const tick = txForm.tick !== "" ? Number(txForm.tick) : tickInfo.tick + 5;
      const amount = txForm.amount !== "" ? Number(txForm.amount) : 0;

      const tx = createTx(txForm.sourceId, txForm.destinationId, amount, tick);

      if (txForm.inputType !== "") {
        tx.setInputType(Number(txForm.inputType));
      }
      if (txForm.inputSize !== "") {
        tx.setInputSize(Number(txForm.inputSize));
      }
      if (txForm.payload) {
        const payloadBytes = base64ToUint8Array(txForm.payload);
        const dynamicPayload = new DynamicPayload(payloadBytes.length);
        dynamicPayload.setPayload(payloadBytes);
        if (payloadBytes.length != Number(txForm.inputSize)) {
          return toast.error("Payload size does not match input size");
        }
        tx.setPayload(dynamicPayload);
      }
      const processedTx = await tx.build("0".repeat(55));
      setTx(processedTx);
    } catch (error) {
      console.error(error);
      toast.error("Error creating transaction");
    }
  };

  const signTx = async () => {
    if (!tx) return toast.error("Please create a transaction first");
    const { tx: signedTx } = await getSignedTx(tx);
    setTx(signedTx);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Transaction Creator</h2>
          <Button onClick={() => {
            setTxForm(initialTxForm);
            setTx(null);
          }} className="px-3" label="Clean" />
        </div>

        <div className="space-y-4">
          {renderInput(
            "Source ID *",
            txForm.sourceId,
            (value) => setTxForm((prev) => ({ ...prev, sourceId: value })),
            "Enter source public ID",
          )}
          {renderInput(
            "Destination ID *",
            txForm.destinationId,
            (value) => setTxForm((prev) => ({ ...prev, destinationId: value })),
            "Enter destination public ID",
          )}
          {renderInput(
            "Amount *",
            txForm.amount,
            (value) => setTxForm((prev) => ({ ...prev, amount: value })),
            "Enter amount",
          )}
          {renderInput(
            "Tick *",
            txForm.tick || String(tickInfo.tick + 5),
            (value) => setTxForm((prev) => ({ ...prev, tick: value })),
            "Enter tick",
          )}
          {renderInput(
            "Input Type",
            txForm.inputType,
            (value) => setTxForm((prev) => ({ ...prev, inputType: value })),
            "Enter input type",
          )}
          {renderInput(
            "Input Size",
            txForm.inputSize,
            (value) => setTxForm((prev) => ({ ...prev, inputSize: value })),
            "Enter input size",
          )}
          {renderInput(
            "Payload (Base64)",
            txForm.payload,
            (value) => setTxForm((prev) => ({ ...prev, payload: value })),
            "Enter payload in Base64",
            3,
          )}

          <Button onClick={handleCreateTx} className="mt-2 w-full" variant="primary" label="Create Transaction" />
          <Button onClick={signTx} className="mt-2 w-full" variant="primary" label="Sign Transaction" disabled={!tx} />

          {tx && renderOutput("Transaction", uint8ArrayToBase64(tx))}
        </div>
      </div>
    </Card>
  );
};
