appServices.factory('dayService', function(moment, weekService) {
  var data = {};
  var time = moment();

  // List of the breaks and the duration. The first break is after the second hour and is 20 minutes.
  data.hourBreaks = [0, 0, 20, 0, 0, 0, 0, 10, 0, 0, 15, 0, 20, 0, 0];
  // Fontys starts at 8.45
  data.dayStartTime = moment().hour(8).minute(45).second(0);
  // And ends at 21.40
  data.dayEndTime = moment().hour(21).minute(40).second(0);

  return {
    getHourBreaks: function() {
      return data.hourBreaks;
    },
    // Calculate the date of the current day
    getCurrentDayDate: function(dayNumber) {
      return moment(weekService.getYearUsed() + '-' + weekService.getWeekUsed() + '-' + dayNumber, 'YYYY-w-d');
    },
    isCurrentDay: function(dayNumber) {
      if (time.isSame(this.getCurrentDayDate(dayNumber), 'day')) {
        return true;
      }
    },
    isActiveDay: function(dayNumber) {
      var dayDate = this.getCurrentDayDate(dayNumber);

      if (time.isSame(dayDate, 'day')) {
        return true;
      }
      if ((time.day() === 6 || time.day() === 0) && dayDate.day() === 1) {
        return true;
      }
    },
    setCalculateLine: function() {
      var now = moment();

      if (data.dayEndTime > now && data.dayStartTime < now) {
        var percentageComplete = (now - data.dayStartTime) / (data.dayEndTime - data.dayStartTime) * 100;
        var percentageRounded = (Math.round(percentageComplete * 100) / 100);

        return percentageRounded + '%';
      }

      // Hide line under footer when there are no lessons. Quick 'n dirty
      return '101%';
    }
  };
});
