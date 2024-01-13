
interface MonthSelectProps {
  value: number;
  months: Array<{monthNumber: number; monthName: string;}>;
  onChange: (value: number) => void;
}

const MonthSelect: React.FC<MonthSelectProps> = ({ months, value, onChange }) => {
  // const months = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <select
      onChange={handleChange}
      className="border border-primary bg-transparent p-2 text-primary md:text-2xl"
    >
      {months.map((month, index) => (
        <option key={index} value={month.monthNumber}>
          {month.monthName}
        </option>
      ))}
    </select>
  );
};

export { MonthSelect };
