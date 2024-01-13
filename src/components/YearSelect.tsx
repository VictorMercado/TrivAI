import React from "react";

interface YearSelectProps {
  value: number;
  years: Array<number>;
  onChange: (value: number) => void;
}

const YearSelect: React.FC<YearSelectProps> = ({ years, value, onChange }) => {
  // const years = Array.from(
  //   { length: 5 },
  //   (_, index) => new Date().getFullYear() + index,
  // );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(parseInt(e.target.value));
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="border border-primary p-2 text-primary bg-transparent md:text-2xl"
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export { YearSelect };
