import Card from "./ui/Card";
import { useAtom } from "jotai";
import { tickInfoAtom } from "@/store/tickInfo";

const TickInfoCard: React.FC = () => {
  const [tickInfo] = useAtom(tickInfoAtom);

  return (
    <Card className="max-w-lg p-6">
      <div className="space-y-4">
        <h1 className="text-center text-3xl">Tick Information</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Current Tick</p>
            <p className="text-2xl font-semibold">{tickInfo?.tick || "-"}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-2xl font-semibold">{tickInfo?.duration}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Epoch</p>
            <p className="text-2xl font-semibold">{tickInfo?.epoch || "-"}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Initial Tick</p>
            <p className="text-2xl font-semibold">{tickInfo?.initialTick || "-"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TickInfoCard;
