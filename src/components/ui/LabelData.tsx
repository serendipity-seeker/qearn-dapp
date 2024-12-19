interface LabelDataProps {
  lbl: string;
  value: React.ReactNode;
}

const LabelData: React.FC<LabelDataProps> = ({ lbl, value }) => (
  <div className="flex flex-col justify-center items-center">
    <span className="text-gray-50 text-12">{lbl}</span>
    <span className="text-white text-16">{value}</span>
  </div>
);

export default LabelData;
