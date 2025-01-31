import arrowLeftIcon from "../../assets/arrow-left.svg";

interface FormHeadProps {
  onBack: () => void;
  title: string;
}

const FormHead: React.FC<FormHeadProps> = ({ onBack, title }) => {
  return (
    <div className="mb-4 flex items-center space-x-2">
      <button onClick={onBack} className="text-white">
        <img src={arrowLeftIcon} alt="Back" className="cursor-pointer" />
      </button>
      <h1 className="text-[25px] font-semibold text-white">{title}</h1>
    </div>
  );
};

export default FormHead;
