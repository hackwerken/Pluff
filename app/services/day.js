import moment from 'moment';

export default function (weekService) {
  let now;

  function updateTime() {
    now = moment();
    // For debugging you can override this to a fixed day like this:
    // now = moment('2016-03-11 14:15', 'YYYY-MM-DD HH:mm');
  }

  updateTime();

  // List of the breaks and the duration. The first break is after the second hour and is 20 minutes.
  const hourBreaks = [0, 15, 0, 0, 0, 0, 15, 0, 0, 0, 30, 0, 30, 0];
  // List of hours
  const hourNumbers = [
    { number: 1, duration: 45 },
    { number: 2, duration: 45 },
    { number: 3, duration: 45 },
    { number: 4, duration: 45 },
    { number: 5, duration: 45 },
    { number: 6, duration: 45 },
    { number: 7, duration: 45 },
    { number: 8, duration: 45 },
    { number: 9, duration: 45 },
    { number: 10, duration: 45 },
    { number: 11, duration: 45 },
    { number: 12, duration: 45 },
    { number: 13, duration: 45 },
    { number: 14, duration: 90 },
  ];
  // Fontys starts at 8.45
  const dayStartTime = now.clone().hour(8).minute(45).second(0);
  // And ends at 21.30
  const dayEndTime = now.clone().hour(21).minute(30).second(0);

  return {
    getHourBreaks() {
      return hourBreaks;
    },
    getHourDurations() {
      return hourNumbers.map((hour) => hour.duration);
    },
    getHourNumbers() {
      return hourNumbers;
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

      if (dayEndTime > now && dayStartTime < now) {
        const percentageComplete = (now - dayStartTime) / (dayEndTime - dayStartTime) * 100;
        const percentageRounded = (Math.round(percentageComplete * 100) / 100);

        return `${percentageRounded}%`;
      }

      // Hide line under footer when there are no lessons. Quick 'n dirty
      return '101%';
    },
  };
}
