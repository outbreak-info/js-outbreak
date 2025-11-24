// filter x-axis ticks based on the number of ticks and container width
export function filterXTicks(ticks, width) {
  const numberOfTicks = ticks.length;
  
  // configuration map: [minTicks, widthBreakpoints]
  const filterConfig = [
    { minTicks: 270, intervals: { 700: 60, 550: 90, default: 210 } },
    { minTicks: 210, intervals: { 700: 30, 550: 60, default: 90 } },
    { minTicks: 120, intervals: { 700: 21, 550: 30, default: 60 } },
    { minTicks: 0,   intervals: { 700: 14, 550: 21, 400: 30, default: 45 } }
  ];
  
  // find the appropriate config based on number of ticks
  const config = filterConfig.find(c => numberOfTicks > c.minTicks);
  
  // deetermine the interval based on width
  const getInterval = (intervals) => {
    if (width > 700) return intervals[700];
    if (width > 550) return intervals[550];
    if (width > 400) return intervals[400] || intervals.default;
    return intervals.default;
  };
  
  const interval = getInterval(config.intervals);
  
  // filter ticks by the calculated interval
  return ticks.filter((_, index) => index % interval === 0);
}
