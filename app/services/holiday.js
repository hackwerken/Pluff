import moment from 'moment';

export default function ($log, $q, apiService) {
  return {
    getHolidays() {
      // Get the json with all the holiday dates in it
      const deferred = $q.defer();

      apiService.getHolidays()
        .then((payload) => {
          const data = [];
          const now = moment();

          payload.data.forEach((holiday) => {
            const startDate = moment(holiday.start);
            const endDate = moment(holiday.end);
            // Calculate the difference in days between the start date and now
            const calcDays = startDate.diff(now, 'days');

            // We don't want holidays from the past
            if (calcDays > 0) {
              data.push({
                title: holiday.title,
                start: startDate.format('DD-MM-YYYY'),
                end: endDate.format('DD-MM-YYYY'),
                days: calcDays,
              });
            }
          });

          deferred.resolve(data);
        }, (msg, code) => {
          deferred.reject(msg);
          $log.error(msg, code);
        });

      return deferred.promise;
    },
  };
}
