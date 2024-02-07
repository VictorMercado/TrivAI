function getDayOfWeek(year, month, day) {
  // JavaScript months are 0-based, so subtract 1 from the month
  const date = new Date(year, month - 1, day);

  // getDay() returns the day of the week as an integer (0 for Sunday, 1 for Monday, etc.)
  const dayOfWeek = date.getDay();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return daysOfWeek[dayOfWeek];
}

// Example: Get the day of the week for September 17, 2023
const year = 2023;
const month = 9; // 9 represents September
const day = 17;

const dayOfWeek = getDayOfWeek(year, month, day);
console.log(`September 17, 2023 is a ${dayOfWeek}.`);
