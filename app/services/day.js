import moment from 'moment';

export default function(weekService) {
  const data = {};
  const time = moment();

  // List of the breaks and the duration. The first break is after the second hour and is 20 minutes.
  data.hourBreaks = [0, 0, 20, 0, 0, 0, 0, 10, 0, 0, 15, 0, 20, 0, 0];
  // List of hours
  data.hourNumbers = [
    {number: 1},
    {number: 2},
    {number: 3},
    {number: 4},
    {number: 5},
    {number: 6},
    {number: 7},
    {number: 8},
    {number: 9},
    {number: 10},
    {number: 11},
    {number: 12},
    {number: 13},
    {number: 14},
  ];
  // Fontys starts at 8.45
  data.dayStartTime = moment().hour(8).minute(45).second(0);
  // And ends at 21.40
  data.dayEndTime = moment().hour(21).minute(40).second(0);

  return {
    getHourBreaks() {
      return data.hourBreaks;
    },
    getHourNumbers() {
      return data.hourNumbers;
    },
    // Calculate the date of the current day
    getCurrentDayDate(dayNumber) {
      return moment(weekService.getYearUsed() + '-' + weekService.getWeekUsed() + '-' + dayNumber, 'YYYY-w-d');
    },
    isCurrentDay(dayNumber) {
      if (time.isSame(this.getCurrentDayDate(dayNumber), 'day')) {
        return true;
      }
    },
    isActiveDay(dayNumber) {
      const dayDate = this.getCurrentDayDate(dayNumber);

      if (time.isSame(dayDate, 'day')) {
        return true;
      }
      if ((time.day() === 6 || time.day() === 0) && dayDate.day() === 1) {
        return true;
      }
    },
    setCalculateLine() {
      const now = moment();

      if (data.dayEndTime > now && data.dayStartTime < now) {
        const percentageComplete = (now - data.dayStartTime) / (data.dayEndTime - data.dayStartTime) * 100;
        const percentageRounded = (Math.round(percentageComplete * 100) / 100);

        return percentageRounded + '%';
      }

      // Hide line under footer when there are no lessons. Quick 'n dirty
      return '101%';
    },
  };
}
