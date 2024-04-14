import React, { useEffect, useState } from "react";
// import "./Calendar.css";
import { MonthSelect } from "@components/MonthSelect";
import { YearSelect } from "@components/YearSelect";

type CalendarProps = {
  years: Array<number>;
  months: Array<{monthName: string; monthNumber: number}>;
  onDayClick: (year: number, month: number, week: number, day: number) => Promise<void>;
};

const Calendar = ({ onDayClick, years, months } : CalendarProps) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = 0 ; // currentDate.getMonth()

  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const getDaysInMonth = (year : number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year : number, month : number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  

  const renderCalendar = () => {
    const calendar = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || day > totalDays) {
          week.push(<td key={`${i}-${j}`} />);
        } else {
          const isCurrentDay = selectedDay === day;
          const theDay = day;
          week.push(
            <td
              className={`h-24 text-sm hover:bg-primary/25 ${
                isCurrentDay ? "bg-primary/25 text-primary" : ""
              }`}
              key={`${i}-${j}`}
              tabIndex={0}
              role="button"
              aria-label={`Select ${day}`}
              onClick={() => handleDayClick(theDay)}
              onKeyDown={(e) => handleKeyDown(e, theDay)}
            >
              <div className="flex h-full flex-col p-2">
                <span className="text-left">{day}</span>
                <div className="flex flex-1 items-center justify-center">
                  <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
                    <div className={`h-3 w-3 bg-emerald-500 md:mx-[4px]`}></div>
                    <div className={`h-3 w-3 bg-amber-500 md:mx-[4px]`}></div>
                    <div className={`h-3 w-3 bg-blue-500 md:mx-[4px]`}></div>
                    <div className={`h-3 w-3 bg-blue-500 md:mx-[4px]`}></div>
                  </div>
                </div>
              </div>
            </td>,
          );
          day++;
        }
      }

      calendar.push(<tr key={i}>{week}</tr>);
    }

    return calendar;
  };
  const handleDayClick = (day : number) => {
    const isZero = day % 7 === 0;
    const CHANGEDAYINDATABASEFORPROD = day % 7 === 0 ? 7 : day % 7;
    const week = isZero === true ? Math.floor(day / 7) : Math.floor(day / 7) + 1;
    onDayClick(year, month + 1, week, CHANGEDAYINDATABASEFORPROD);
    setSelectedDay(day);
    // Handle click events when a day is selected
    console.log(`Selected day: ${day}`);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTableCellElement>,
    day: number,
  ) => {
    // Handle keyboard navigation
    if (e.key === "Enter" || e.key === " ") {
      // Trigger the same action as a click when the user presses Enter or Spacebar
      handleDayClick(day);
    } else {
      // Otherwise, focus the adjacent day using arrow keys
      switch (e.key) {
        case "ArrowLeft":
          if (day > 1) {
            setSelectedDay(day - 1);
          }
          break;
        case "ArrowRight":
          if (day < totalDays) {
            setSelectedDay(day + 1);
          }
          break;
        case "ArrowUp":
          if (day > 7) {
            setSelectedDay(day - 7);
          }
          break;
        case "ArrowDown":
          if (day <= totalDays - 7) {
            setSelectedDay(day + 7);
          }
          break;
        default:
          break;
      }
    }
  };

  // useEffect(() => {
  //   const handleGlobalKeyDown = (
  //     e: KeyboardEvent,
  //   ) => {
  //     if (selectedDay) {
  //       handleKeyDown(
  //         e as any,
  //         selectedDay,
  //       );
  //     }
  //   };

  //   window.addEventListener("keydown", handleGlobalKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleGlobalKeyDown);
  //   };
  // }, [selectedDay]);

  return (
    <div className="calendar overflow-x-auto">
      <div className="mb-4 flex flex-row justify-between">
        <div className="space-x-2">
          <YearSelect
            years={years}
            value={year}
            onChange={(value) => {
              // Update the year when the user selects a new value
              setYear(value);
            }}
          />
          <MonthSelect
            months={months}
            value={month}
            onChange={(value) => {
              // Update the month when the user selects a new value
              setMonth(value);
            }}
          />
        </div>
        <div className="flex flex-col gap-x-2 lg:flex-row">
          <div className="flex items-center gap-x-2">
            <div className="h-4 w-4 bg-green-500"></div>
            <p className="text-green-500">Completed</p>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="h-4 w-4 bg-amber-500"></div>
            <p className="text-amber-500">Incomplete</p>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="h-4 w-4 bg-blue-500"></div>
            <p className="text-blue-500">Not Started</p>
          </div>
        </div>
      </div>
      <table className="w-full overflow-auto">
        <thead className="text-black">
          <tr>
            {daysOfWeek.map((day, index) => (
              <th key={index} className="bg-primary py-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">{renderCalendar()}</tbody>
      </table>
    </div>
  );
}

export { Calendar };
