import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const getURL = () => {
  let search = new URLSearchParams(window.location.search);
  return search.toString();
}

export const pushURLParam = (key: string, value: string) => {
  let search = new URLSearchParams(window.location.search);
  search.set(key, value);
  window.history.pushState({}, "", `?${search}`);
}

export const replaceURLParam = (key: string, value: string) => {
  let search = new URLSearchParams(window.location.search);
  let arr = Array.from(search.entries());
  arr = arr.filter(([k, v]) => k !== key);
  arr.push([key, value]);
  window.history.replaceState({}, "", `?${new URLSearchParams(arr)}`);
};

export const removeURLParam = (key: string) => {
  let search = new URLSearchParams(window.location.search);
  let arr = Array.from(search.entries());
  arr = arr.filter(([k, v]) => k !== key);
  window.history.replaceState({}, "", `?${new URLSearchParams(arr)}`);
};

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
};

export const shortenNumber = (num: number) => {
  if (num < 1000) return num;
  if (num < 1000000) return Math.round(num / 1000) + "K";
  if (num < 1000000000) return Math.round(num / 1000000) + "M";
  if (num < 1000000000000) return Math.round(num / 1000000000) + "B";
  return Math.round(num / 1000000000000) + "T";
};

export const getEndPointName = (children: any, directories: number) => {
  return children?.props?.segmentPath.filter((segment: string) => segment !== "children")[directories - 1];
};

export const stringExtractor = (stringToModify: string | undefined, substring: string) => {
  if (!stringToModify) return "";
  const index = stringToModify.indexOf(substring);
  if (index === -1) return stringToModify;
  return stringToModify.slice(0, index) + stringToModify.slice(index + substring.length);
};


export const removeTrailingS = (str: string) => {
  return str.replace(/s$/, '');
};

export const getDate = () => {
  let timeZoneOffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - timeZoneOffset).toLocaleDateString();
};

export const isDigit = (str: string) => {
  return /^\d+$/.test(str);
};

export const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};


export function getDueDate() {
  var currentDate = new Date();
  var offset = 7 * 60 * 60 * 1000; // Offset in milliseconds for GMT-7
  var adjustedDate = new Date(currentDate.getTime() - offset);
  var month = (adjustedDate.getMonth() + 1).toString();
  var day = adjustedDate.getDate().toString().padStart(2, "0");
  var year = adjustedDate.getFullYear();
  return month + "/" + day + "/" + year;
}

function getDDate() {
  var currentDate = new Date();
  var offset = 7 * 60 * 60 * 1000; // Offset in milliseconds for GMT-7
  var adjustedDate = new Date(currentDate.getTime() - offset);
  var year = adjustedDate.getFullYear();
  var month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0");
  var day = adjustedDate.getDate().toString().padStart(2, "0");
  return year + "-" + month + "-" + day;
}

function flattenObjectToStringArray(array: any[]) {
  return array.map((item) => item[Object.keys(item)[0]].toLowerCase());
}

// function getDueDate() {
//   let timeZoneOffset = new Date().getTimezoneOffset() * 60000;
//   return new Date(Date.now() - timeZoneOffset).toLocaleDateString();
// }

// function getDueDate() {
//   var currentDate = new Date();
//   var offset = 7 * 60 * 60 * 1000; // Offset in milliseconds for GMT-7
//   var adjustedDate = new Date(currentDate.getTime() - offset);
//   var month = (adjustedDate.getMonth() + 1).toString().padStart(2, "0");
//   var day = adjustedDate.getDate().toString().padStart(2, "0");
//   var year = adjustedDate.getFullYear();
//   return month + "/" + day + "/" + year;
// }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = async (seconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
};