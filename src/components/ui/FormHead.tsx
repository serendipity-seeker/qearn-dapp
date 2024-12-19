import arrowLeftIcon from '../../assets/arrow-left.svg';

interface FormHeadProps {
  onBack: () => void;
  title: string;
}

const FormHead: React.FC<FormHeadProps> = ({ onBack, title }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <button onClick={onBack} className="text-white">
        <img src={arrowLeftIcon} alt='Back' className='cursor-pointer' />
      </button>
      <h1 className="text-white text-[25px] font-semibold">{title}</h1>
    </div>
  );
};

export default FormHead;
