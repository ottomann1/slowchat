import { format, isToday, isYesterday, isThisWeek } from "date-fns";

export const formatDate = (date: Date): string => {
  const parsedDate = new Date(date);
  if (isToday(parsedDate)) {
    return "Today";
  } else if (isYesterday(parsedDate)) {
    return "Yesterday";
  } else if (isThisWeek(parsedDate)) {
    return format(parsedDate, "EEEE");
  } else {
    return format(parsedDate, "dd/MM/yyyy");
  }
};

export const formatTime = (date: Date): string => {
  return format(new Date(date), "HH:mm");
};
