// create array of consecutive dates
export const createDateArray = (startDateStr, endDateStr) => {
  console.log("start", startDateStr);
  console.log("end", endDateStr);

  const result = [];

  const parseDate = (str) => {
    const [year, month, day] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  let startDate = parseDate(startDateStr);
  let endDate = parseDate(endDateStr);

  // handle invalid dates
  if (isNaN(startDate) || isNaN(endDate)) {
    throw new Error("Invalid date format. Expected yyyy-mm-dd.");
  }

  // swap dates if needed
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentDate.getDate()).padStart(2, "0");
    result.push(`${yyyy}-${mm}-${dd}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};
