interface MinMaxSpanProps {
  values: {
    [key: string]: number[];
  };
  prop: string;
}

const MinMaxSpan: React.FC<MinMaxSpanProps> = ({ values, prop }) => {
  // get smallest and highest fee from data.oracle_fee array
  const min = Math.min(...values[prop]);
  const max = Math.max(...values[prop]);
  // if min and max are the same, return just one value
  if (min === max) {
    return <span>{min}</span>;
  }
  // otherwise
  return (
    <span>
      {min} - {max}
    </span>
  );
};

export default MinMaxSpan;
