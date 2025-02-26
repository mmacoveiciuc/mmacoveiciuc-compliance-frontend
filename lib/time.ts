export function formatDateTimeWithYear(dateStr: string): string {
  // Create a date object from the input string
  const date = new Date(dateStr);

  // Array of month names for convenience
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Helper function to get the ordinal suffix (st, nd, rd, th)
  function getOrdinalSuffix(day: number): string {
    // Special case for 11th, 12th, 13th
    if (day >= 11 && day <= 13) {
      return "th";
    }

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  const daySuffix = getOrdinalSuffix(day);

  // Convert 24-hour format to 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.

  // Format minutes to always be two digits (e.g. 00, 05, 30)
  const minutesStr = minutes.toString().padStart(2, "0");

  // Construct the final string (e.g., "February 23rd, 2023, 10:00 PM")
  return `${monthName} ${day}${daySuffix}, ${year}, ${hours}:${minutesStr} ${ampm}`;
}
