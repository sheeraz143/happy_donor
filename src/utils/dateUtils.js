import { format, isValid, parseISO } from "date-fns";

export function formatDate(date, dateFormat = "dd/MM/yyyy") {
  if (!date) return ""; // Handle undefined or null dates

  const parsedDate = parseISO(date);
  if (!isValid(parsedDate)) return ""; // Handle invalid date strings

  return format(parsedDate, dateFormat);
}
