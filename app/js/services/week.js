appServices.factory('weekService', function(moment) {
  var data = {};

  var time = moment();

  // Set default weeknumber. In the weekend, use the next week number
  if (time.day() === 0 || time.day() === 6) {
    data.weekCurrent = parseInt(time.add(1, 'w').format('w'));
  }
  else {
    data.weekCurrent = parseInt(time.format('w'));
  }

  // Set the default used weeknumber (without leading zero). In the weekend, use the next week number
  data.weekUse = data.weekCurrent;

  // Set default year
  data.yearCurrent = parseInt(time.format('YYYY'));
  data.yearUse = data.yearCurrent;

  return {
    getYearUsed: function() {
      return data.yearUse;
    },
    getWeekUsed: function() {
      return data.weekUse;
    },
    setWeek: function(newWeek) {
      // Rotate the number when the year has ended
      if (newWeek === 53) {
        data.weekUse = 1;
        data.yearUse = data.yearCurrent + 1;
      }
      else if (newWeek === 0) {
        data.weekUse = 52;
        data.yearUse = data.yearCurrent;
      }
      else {
        data.weekUse = newWeek;
      }
    },
    setYear: function(newYear) {
      data.yearUse = newYear;
    },
    // Check if the used week is older then or the same as the current week
    isOldWeek: function() {
      if (data.weekUse <= data.weekCurrent && data.yearUse === data.yearCurrent) {
        return true;
      }
      return false;
    },
    // Check if the used week is too far away (the next year + 12 weeks)
    isNewWeek: function() {
      if (data.weekUse >= 12 && data.yearUse === (data.yearCurrent + 1)) {
        return true;
      }
      return false;
    },
    isCurrentWeek: function() {
      if (data.weekUse === data.weekCurrent) {
        return true;
      }
      return false;
    },
    addWeek: function() {
      if (this.isNewWeek() === false) {
        this.setWeek(data.weekUse + 1);
        return true;
      }
      return false;
    },
    subtractWeek: function() {
      if (this.isOldWeek() === false) {
        this.setWeek(data.weekUse - 1);
        return true;
      }
      return false;
    },
    currentWeek: function() {
      // Reset to the current week
      this.setWeek(data.weekCurrent);
      this.setYear(data.yearCurrent);
      return true;
    }
  };
});
