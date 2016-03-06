import moment from 'moment';

export default function (weekService) {
  const data = {};
  let now;

  function updateTime() {
    now = moment();
  }

  updateTime();

  // List of the breaks and the duration. The first break is after the second hour and is 20 minutes.
  data.hourBreaks = [0, 0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 30, 0, 30, 0];
  // List of hours
  data.hourNumbers = [
    { number: 1 },
    { number: 2 },
    { number: 3 },
    { number: 4 },
    { number: 5 },
    { number: 6 },
    { number: 7 },
    { number: 8 },
    { number: 9 },
    { number: 10 },
    { number: 11 },
    { number: 12 },
    { number: 13 },
    { number: 14 },
  ];
  // Fontys starts at 8.45
  data.dayStartTime = now.clone().hour(8).minute(45).second(0);
  // And ends at 21.30
  data.dayEndTime = now.clone().hour(21).minute(30).second(0);

  return {
    getHourBreaks() {
      return data.hourBreaks;
    },
    getHourNumbers() {
      return data.hourNumbers;
    },
    // Calculate the date of the current day
    getCurrentDayDate(dayNumber) {
      return moment(`${weekService.getYearUsed()}-${weekService.getWeekUsed()}-${dayNumber}`, 'YYYY-W-E');
    },
    isCurrentDay(dayNumber) {
      if (now.isSame(this.getCurrentDayDate(dayNumber), 'day')) {
        return true;
      }
      return false;
    },
    isActiveDay(dayNumber) {
      const dayDate = this.getCurrentDayDate(dayNumber);

      if (now.isSame(dayDate, 'day')) {
        return true;
      }
      if ((now.day() === 6 || now.day() === 0) && dayDate.day() === 1) {
        return true;
      }
      return false;
    },
    setCalculateLine() {
      updateTime();

      if (data.dayEndTime > now && data.dayStartTime < now) {
        const percentageComplete = (now - data.dayStartTime) / (data.dayEndTime - data.dayStartTime) * 100;
        const percentageRounded = (Math.round(percentageComplete * 100) / 100);

        return `${percentageRounded}%`;
      }

      // Hide line under footer when there are no lessons. Quick 'n dirty
      return '101%';
    },
  };
}
