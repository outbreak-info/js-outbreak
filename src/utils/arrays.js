// create array of consecutive dates
export const createDateArray = (startDateStr, endDateStr) => {
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
