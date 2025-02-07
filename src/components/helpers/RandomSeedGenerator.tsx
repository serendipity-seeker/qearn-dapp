import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { generateSeed } from "@/utils";
import { toast } from "react-hot-toast";
import { renderOutput } from "./common";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const qHelper = new QubicHelper();

export const RandomSeedGenerator = () => {
  const [randomSeed, setRandomSeed] = useState("");
  const [publicId, setPublicId] = useState("");
  const [showSeed, setShowSeed] = useState(false);

  const handleGenerateRandomSeed = async () => {
    const seed = generateSeed();
    setRandomSeed(seed);
    const idPackage = await qHelper.createIdPackage(seed);
    setPublicId(idPackage.publicId);
    toast.success("Random seed generated");
  };

  const renderBlurredOutput = (label: string, value: string) => (
    <div className="mt-2 break-all rounded-lg bg-background p-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{label}:</p>
        <button
          onClick={() => setShowSeed(!showSeed)}
          className="text-muted-foreground cursor-pointer bg-transparent hover:text-foreground"
        >
          {showSeed ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
      <p className={`font-mono text-foreground ${!showSeed && "select-none blur-sm"}`}>{value}</p>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Random Seed Generator</h2>
          <Button
            onClick={() => {
              setRandomSeed("");
              setPublicId("");
            }}
            className="px-3"
            label="Clean"
          />
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGenerateRandomSeed}
            className="w-full"
            variant="primary"
            label="Generate Random Seed"
          />
          {randomSeed && renderBlurredOutput("Generated Seed", randomSeed)}
          {publicId && renderOutput("Public ID", publicId)}
        </div>
      </div>
    </Card>
  );
};
