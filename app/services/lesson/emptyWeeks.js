// Create 52 empty weeks, create within every week 5 days (Mo - Fr) and 14 hours
export default function (startWeek, endWeek) {
  const weeks = [];

  for (let week = startWeek; week < endWeek; week++) {
    weeks[week] = [];

    for (let day = 0; day < 5; day++) {
      weeks[week][day] = [];

      for (let hour = 0; hour < 14; hour++) {
        weeks[week][day][hour] = {
          number: (hour + 1),
          lessons: [],
        };
      }
    }
  }

  return weeks;
}
