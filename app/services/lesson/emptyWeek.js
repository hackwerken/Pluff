// Create 5 days (Mo - Fr) and 14 hours
export default function () {
  const week = [];

  for (let day = 0; day < 5; day++) {
    week[day] = [];

    for (let hour = 0; hour < 14; hour++) {
      week[day][hour] = {
        number: (hour + 1),
        lessons: [],
      };
    }
  }

  return week;
}
