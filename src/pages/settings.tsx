import Card from "@/components/ui/Card";
import ConfirmSlider from "@/components/ui/ConfirmSlider";

const Settings: React.FC = () => {
  return (
    <div>
      <Card>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Settings</h2>
          <ConfirmSlider onConfirm={() => {}} />
        </div>
      </Card>
    </div>
  );
};

export default Settings;
