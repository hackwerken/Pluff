import moment from 'moment';

export default function($log, $q, apiService) {
  return {
    getHolidays: function() {
      // Get the json with all the holiday dates in it
      var deferred = $q.defer();

      apiService.getHolidays()
        .then(function(payload) {
          var data = [];
          var now = moment();

          payload.data.forEach(function(holiday) {
            var startDate = moment(holiday.start);
            var endDate = moment(holiday.end);
            // Calculate the difference in days between the start date and now
            var calcDays = startDate.diff(now, 'days');

            // We don't want holidays from the past
            if (calcDays > 0) {
              data.push({
                title: holiday.title,
                start: startDate.format('DD-MM-YYYY'),
                end: endDate.format('DD-MM-YYYY'),
                days: calcDays
              });
            }
          });

          deferred.resolve(data);
        }, function(msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        });

      return deferred.promise;
    }
  };
}
