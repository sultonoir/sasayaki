import { formatDate } from "date-fns";

export function fromNow(from: Date) {
  if (!(from instanceof Date)) {
    return "Invalid input: 'from' must be a Date object";
  }

  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    // For times less than 24 hours ago, show hours and minutes
    return formatDate(from, "h:mm a");
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
}
