export const generateFormattedData = (prevalenceArray) => {
  if (!prevalenceArray?.length) return { formattedArray: [], uniqueNames: [] };

  const uniqueNames = [...new Set(prevalenceArray.map(d => d.name))];
  const epiweekMap = new Map();

  for (const entry of prevalenceArray) {
    epiweekMap.set(entry.epiweek, {
      week_start: entry.week_start,
      week_end: entry.week_end,
      geo_loc_region: entry.geo_loc_region,
    });
  }

  const epiweeks = Array.from(epiweekMap.keys());
  const firstEpiweek = Math.min(...epiweeks);
  const lastEpiweek = Math.max(...epiweeks);

  const existingMap = new Map();
  for (const entry of prevalenceArray) {
    const key = `${entry.epiweek}-${entry.name}`;
    existingMap.set(key, entry);
  }

  const allEpiweeks = [];
  const formatDate = (d) => d.toISOString().split("T")[0];

  let currentDate = new Date(epiweekMap.get(firstEpiweek).week_start);
  const endDate = new Date(epiweekMap.get(lastEpiweek).week_end);

  while (currentDate <= endDate) {
    const year = currentDate.getUTCFullYear();
    const jan1 = new Date(Date.UTC(year, 0, 1));
    const weekNumber = Math.floor(((currentDate - jan1) / (7 * 24 * 60 * 60 * 1000)) + 1);
    const epiweek = parseInt(`${year}${String(weekNumber).padStart(2, '0')}`, 10);
    console.log(currentDate.toISOString(), epiweek);

    if (!epiweekMap.has(epiweek)) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);

      epiweekMap.set(epiweek, {
        week_start: formatDate(weekStart),
        week_end: formatDate(weekEnd),
        geo_loc_region: prevalenceArray[0].geo_loc_region,
      });
    }

    allEpiweeks.push(epiweek);
    currentDate.setUTCDate(currentDate.getUTCDate() + 7);
  }

  const formattedArray = [];

  for (const epiweek of allEpiweeks.sort((a, b) => a - b)) {
    for (const name of uniqueNames) {
      const key = `${epiweek}-${name}`;
      if (existingMap.has(key)) {
        const original = existingMap.get(key);
        formattedArray.push({
          ...original,
          week_end_date: new Date(original.week_end),
        });
      } else {
        const { week_start, week_end, geo_loc_region } = epiweekMap.get(epiweek);
        formattedArray.push({
          epiweek,
          name,
          mean_lineage_prevalence: 0,
          week_start,
          week_end,
          geo_loc_region,
          week_end_date: new Date(week_end),
        });
      }
    }
  }

  return {
    formattedArray: formattedArray.sort((a, b) => a.epiweek - b.epiweek),
    uniqueNames,
  };
}

