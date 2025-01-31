import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";
import { toast } from "react-hot-toast";
import { renderInput, renderOutput } from "./common";

const qHelper = new QubicHelper();

export const PublicIdKeyConverter = () => {
  const [publicId, setPublicId] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");

  const validatePublicKey = (key: Uint8Array | string) => {
    if (typeof key === "string" && key.length !== 60) return false;
    if (key instanceof Uint8Array && key.length !== 32) return false;
    return true;
  };

  const handleError = (message: string) => toast.error(message);

  const getPublicKeyFromId = async () => {
    try {
      if (!publicId) return handleError("Please enter a Public ID");
      const pubKey = qHelper.getIdentityBytes(publicId);
      if (!validatePublicKey(pubKey)) {
        return handleError("Invalid public key length - must be 32 bytes");
      }
      setPublicKey(pubKey.toString());
    } catch {
      handleError("Invalid Public ID format");
    }
  };

  const getPublicIdFromKey = async () => {
    try {
      if (!publicKey.length) return handleError("Please enter a Public Key");
      if (
        !validatePublicKey(
          new Uint8Array(
            publicKey
              .trim()
              .split(",")
              .map((str) => Number(str)),
          ),
        )
      ) {
        return handleError("Invalid public key length - must be 32 bytes");
      }
      const id = await qHelper.getIdentity(
        new Uint8Array(
          publicKey
            .trim()
            .split(",")
            .map((str) => Number(str)),
        ),
      );
      setPublicId(id);
    } catch {
      handleError("Invalid Public Key format");
    }
  };

  const cleanStates = () => {
    setPublicId("");
    setPublicKey("");
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Public ID ↔ Key</h2>
          <Button onClick={cleanStates} className="px-3" label="Clean" />
        </div>

        <div className="space-y-4">
          {renderInput("Public ID", publicId, setPublicId, "Enter Public ID")}
          <Button onClick={getPublicKeyFromId} className="mt-2 w-full" variant="primary" label="Get Public Key" />
          {renderOutput("Output", publicKey)}

          {renderInput("Public Key", publicKey, setPublicKey, "Enter Public Key")}
          <Button onClick={getPublicIdFromKey} className="mt-2 w-full" variant="primary" label="Get Public ID" />
          {renderOutput("Output", publicId)}
        </div>
      </div>
    </Card>
  );
};
