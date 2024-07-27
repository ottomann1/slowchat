import { format, isToday, isYesterday, subDays, isThisWeek } from "date-fns";

export const formatDate = (date: Date): string => {
  const parsedDate = new Date(date);
  if (isToday(parsedDate)) {
    return "Today";
  } else if (isYesterday(parsedDate)) {
    return "Yesterday";
  } else if (isThisWeek(parsedDate)) {
    return format(parsedDate, "EEEE"); // Day of the week
  } else {
    return format(parsedDate, "dd/MM/yyyy"); // European date format
  }
};

export const formatTime = (date: Date): string => {
  return format(new Date(date), "HH:mm"); // European time format without seconds
};
