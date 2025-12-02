// create array of consecutive dates
export const createDateArray = (startDate, endDate, desiredNumOfDays = null) => {
  if (!endDate) {
    throw new Error("endDate is required.");
  }

  // strict YYYY-MM-DD parser returning a UTC midnight date
  const parse = (d) => {
    if (d instanceof Date) {
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }
    if (typeof d === "string") {
      const parts = d.split("-").map(Number);
      if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
        throw new Error("Invalid date. Expected YYYY-MM-DD.");
      }
      const [y, m, day] = parts;
      return new Date(Date.UTC(y, m - 1, day));
    }
    throw new Error("Invalid date. Provide a Date or YYYY-MM-DD string.");
  };

  let start = startDate ? parse(startDate) : null;
  const end = parse(endDate);

  // swap if reversed (only when both dates are provided)
  if (start && start > end) {
    [start, end] = [end, start];
  }

  // sliding-window mode (desiredNumOfDays provided)
  if (desiredNumOfDays !== null) {
    if (!Number.isInteger(desiredNumOfDays) || desiredNumOfDays < 1) {
      throw new Error("desiredNumOfDays must be a positive integer.");
    }

    // start = end - (N - 1) days (inclusive window)
    const computedStart = new Date(end);
    computedStart.setUTCDate(end.getUTCDate() - (desiredNumOfDays - 1));

    // if startDate was passed, we must not go earlier than it
    start = start ? new Date(Math.max(start.getTime(), computedStart.getTime())) : computedStart;
  }

  // full-range mode requires startDate
  if (!start) {
    throw new Error("startDate is required when desiredNumOfDays is not provided.");
  }

  // build date sequence
  const result = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    result.push(cursor.toISOString().split("T")[0]); // YYYY-MM-DD
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
};

// find week end 
export const findWeekEnd = (week, dataArray, weekAccessor, weekEndAccessor) => {
  const result = dataArray.find(item => weekAccessor(item) === week);
  return result ? weekEndAccessor(result) : null;
};

// find week 
export const findWeek = (week_end, dataArray, weekAccessor, weekEndAccessor) => {
  const result = dataArray.find(item => weekEndAccessor(item) === week_end);
  return result ? weekAccessor(result) : null;
}

// create array used to build the stacked area chart
export const createStackedAreaArray = (data, uniqueLabels, weekAccessor, 
  weekStartAccessor, weekEndAccessor, labelAccessor, yAccessor) => {
  // initialize wideData object
  const wideData = {};

  data.forEach(item => {
    if (!wideData[weekAccessor(item)]) {
      // initialize a new entry for this week
      wideData[weekAccessor(item)] = {
        epiweek: weekAccessor(item),
        week_end: weekEndAccessor(item),
        week_start: weekStartAccessor(item)
      };

      // set all label names to 0
      uniqueLabels.forEach(label => {
        wideData[weekAccessor(item)][label] = 0;
      });
    }

    // set the mean_lineage_prevalence 
    wideData[weekAccessor(item)][labelAccessor(item)] = yAccessor(item);
  });

  // convert wideData object to an array
  const wideDataArray = Object.values(wideData);

  return wideDataArray;
};

// scale values in a nested data structure by a given factor
export const scaleValues = (data, factor = 100, ...accessors) => {
  // validate inputs
  if (!data || !Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array');
  }

  if (!accessors || accessors.length === 0) {
    throw new Error('At least one accessor function must be provided');
  }

  // check whether accessors are functions
  const invalidAccessors = accessors.filter(acc => typeof acc !== 'function');
  if (invalidAccessors.length > 0) {
    throw new Error('All accessors must be functions');
  }

  // scale the data
  return data.map(item => ({
    ...item,
    data: item.data.map(dataPoint => {
      const scaledPoint = { ...dataPoint };
      
      // apply scaling to each accessor
      accessors.forEach(accessor => {
        try {
          const value = accessor(dataPoint);
          if (typeof value === 'number' && !isNaN(value)) {
            // find the property name by comparing the accessor's return value with object properties
            const key = Object.keys(dataPoint).find(k => dataPoint[k] === value);
            if (key) {
              scaledPoint[key] = value * factor;
            }
          }
        } catch (error) {
          console.warn(`Accessor failed for data point:`, error);
        }
      });
      
      return scaledPoint;
    })
  }));
};
