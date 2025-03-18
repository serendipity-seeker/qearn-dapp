import { useState } from "react";
import { toast } from "react-hot-toast";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { renderInput, renderOutput } from "./common";
import Dropdown from "../ui/Dropdown";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";
import { uint8ArrayToBase64 } from "@/utils";

type TType = "bit" | "uint16" | "uint32" | "uint64" | "id" | "string" | "base64";

const qHelper = new QubicHelper();

export const Uint8ArrayParser = () => {
  const [uint8Input, setUint8Input] = useState("");
  const [parsedData, setParsedData] = useState<string[]>([]);
  const [types, setTypes] = useState<{ type: TType; size?: number }[]>([]);

  const handleError = (message: string) => toast.error(message);

  const handleParse = async () => {
    try {
      if (!uint8Input) return handleError("Please enter a Uint8 Array");
      const uint8Array = new Uint8Array(uint8Input.split(",").map(Number));
      let offset = 0;
      const parsed = [];
      for (const { type, size } of types) {
        let value;
        if (type === "bit") {
          value = uint8Array[offset];
          offset += 1;
        } else if (type === "uint16") {
          value = new DataView(uint8Array.buffer, offset, 2).getUint16(0);
          offset += 2;
        } else if (type === "uint32") {
          value = new DataView(uint8Array.buffer, offset, 4).getUint32(0, true);
          offset += 4;
        } else if (type === "uint64") {
          value = new DataView(uint8Array.buffer, offset, 8).getBigUint64(0, true).toString();
          offset += 8;
        } else if (type === "id") {
          value = await qHelper.getIdentity(uint8Array.slice(offset, offset + 32));
          offset += 32;
        } else if (type === "string") {
          if (!size) return handleError("Please specify size for string type");
          value = new TextDecoder().decode(uint8Array.slice(offset, offset + size));
          offset += size;
        } else if (type === "base64") {
          if (!size) return handleError("Please specify size for base64 type");
          value = uint8ArrayToBase64(uint8Array.slice(offset, offset + size));
          offset += size;
        } else {
          return handleError("Unknown type");
        }
        parsed.push(value);
      }

      setParsedData(parsed as string[]);
    } catch (error) {
      handleError("Invalid Uint8Array format");
    }
  };

  const cleanStates = () => {
    setUint8Input("");
    setParsedData([]);
    setTypes([]);
  };

  const options = [
    { label: "uint16", value: "uint16" },
    { label: "uint32", value: "uint32" },
    { label: "uint64", value: "uint64" },
    { label: "id", value: "id" },
    { label: "string", value: "string" },
    { label: "base64", value: "base64" },
    { label: "bit", value: "bit" },
  ];
  const addType = (type: TType) => {
    if (type === "string") {
      const size = parseInt(prompt("Enter size for string type (in bytes):") || "0", 10);
      if (isNaN(size) || size <= 0) return handleError("Invalid size for string type");
      setTypes([...types, { type, size }]);
    } else if (type === "base64") {
      const size = parseInt(prompt("Enter size for base64 type (in bytes):") || "0", 10);
      if (isNaN(size) || size <= 0) return handleError("Invalid size for base64 type");
      setTypes([...types, { type, size }]);
    } else {
      setTypes([...types, { type }]);
    }
  };

  const removeType = (index: number) => {
    setTypes(types.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Uint8Array Parser</h2>
          <Button onClick={cleanStates} className="px-3" label="Clean" />
        </div>

        <div className="space-y-4">
          {renderInput("Uint8 Array", uint8Input, setUint8Input, "Enter comma-separated Uint8 Array", 3)}

          <div>
            <h3>Required Fields</h3>
            <div className="">
              <Dropdown
                label="Type"
                options={options}
                setSelected={(idx: number) => addType(options[idx].value as TType)}
                selected={0}
              />
            </div>
          </div>
          <Button onClick={handleParse} className="mt-2 w-full" variant="primary" label="Parse" />
          <div className="mt-4">
            <h3>Output Fields</h3>
            {types.map((typeObj, index) => (
              <div key={index} className="relative mb-2 flex items-center justify-between">
                {renderOutput(`Type: ${typeObj.type}`, parsedData[index] || "")}
                <Button
                  variant="primary"
                  onClick={() => removeType(index)}
                  className="absolute bottom-1 right-1 bg-red-500 px-1 py-1 text-sm"
                  label="Remove"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
