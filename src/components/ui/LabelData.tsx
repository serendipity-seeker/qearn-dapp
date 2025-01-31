interface LabelDataProps {
  lbl: string;
  value: React.ReactNode;
}

const LabelData: React.FC<LabelDataProps> = ({ lbl, value }) => (
  <div className="flex flex-col items-center justify-center">
    <span className="text-12 text-gray-50">{lbl}</span>
    <span className="text-16 text-white">{value}</span>
  </div>
);

export default LabelData;
