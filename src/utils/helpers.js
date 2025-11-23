// add middot between year and week
export const insertYearWeekSeparator = (week) => {
  const separator = '\u{00B7}';
  const position = 4;
  const weekString = week.toString();
  return `${weekString.slice(0, position)}${separator}${weekString.slice(position)}`;
};
