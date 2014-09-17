'use strict';

/* Services */

angular.module('pluffApp.services', [])
  .factory('hourService', function() {
    var hour = {};

    hour.getHour = function($scope, dayNumber, hourNumber) {
      // dayNumber can be 1 to 5 (day of the week)
      // hourNumber can be 1 to 15

      // Allow multiple lessons in one hour
      var hourCallback = [];

      if ($scope.tableData != false) {
        // TODO: Optimize for performance (!!)
        $scope.tableData.forEach(function(les) {
          // Get the input date from the weeknumber of the year and daynumber of week (1-5) (ex. 2014-52-5)
          var currentDay = moment('2014-' + $scope.weekNumber().use + '-' + dayNumber, 'YYYY-w-d');

          // Check if the lesson is on the current day
          if (currentDay.isSame(les.start, 'day')) {
            // Get the exponent of the hourNumber (^2 - 1)
            var hourBin = Math.pow(2, hourNumber - 1);

            if (les.hoursMask & hourBin) {
              hourCallback.push(les);
            }
          }
        });
      }

      return hourCallback;
    };

    return hour;
  });
