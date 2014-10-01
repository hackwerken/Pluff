'use strict';

/* Services */

angular.module('pluffApp.services', [])
  .factory('hourService', function() {
    var hour = {};

    hour.getHour = function($scope, dayNumber, hourNumber) {
      // dayNumber can be 1 to 5 (day of the week)
      // hourNumber can be 1 to 14

      // Allow multiple lessons in one hour
      var hourCallback = [];

      // Filter all subjects in this array
      var filterSubjects = ['delta'];

      // Get the complete date from the daynumber and current weeknumber
      var currentDay = $scope.currentDayDate(dayNumber);

      // Get the exponent of the hourNumber (current hour) (^2 - 1)
      // Equalize the current hour with the mask
      var hourExp = Math.pow(2, hourNumber - 1);

      // TODO: Optimize for performance
      $scope.tableData.forEach(function(lesson) {
        // Check if the lesson is on the current day and if the current hour is in the mask
        // Ex.: if a mask is 12, the binary code of it is 1100. This means that the lesson is in the third and fourth hour.
        if (currentDay.isSame(lesson.start, 'day') && !(filterSubjects.indexOf(lesson.subject) > -1) && lesson.hoursMask & hourExp) {
          hourCallback.push(lesson);
        }
      });

      return hourCallback;
    };

    return hour;
  })
  .factory('dataService', function($http, $log, $q) {
    return {
      getTimeTable: function(input) {
        // TODO: Only pull the timetables for this week (calculate the difference between selected week and current week)
        return $http.jsonp(APIconfig.url('/Schedule' + input + '?includeTeacher=false&IncludeStartOfWeek=true&daysAhead=90'));
      },
      getTeacher: function(teacher) {
        return $http.jsonp(APIconfig.url('/people/afkorting/' + teacher + '?test'));
      },
      getSuggestions: function() {
        return $http.jsonp(APIconfig.url('/schedule/autocomplete?test'));
      }
    }
  })
  .factory('holidayService', function($http, $log, $q) {
    return {
      getHolidays: function() {
        // Get the json with all the holiday dates in it
        var deferred = $q.defer();

        $http.get('json/holidays.json')
        .success(function(payload) {
          var data = [];
          var now = moment();

          payload.forEach(function(holiday) {
            var startDate = moment(holiday.start);
            var endDate = moment(holiday.end);
            // Calculate the difference in days between the start date and now
            var calcDays = startDate.diff(now, 'days');

            // We don't want holidays from the past
            if (calcDays > 0) {
              data.push({
                name: holiday.name,
                start: startDate.format('DD-MM-YYYY'),
                end: endDate.format('DD-MM-YYYY'),
                days: calcDays
              });
            }
          });

          deferred.resolve(data);
        })
        .error(function(msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        })

        return deferred.promise;
      }
    }
  })
  .factory('roomService', function($http, $log, $q) {
    return {
      getFreeRooms: function() {
        var deffered = $q.defer();

        $http.jsonp(APIconfig.url('/Schedule/rooms/occupancy/today?test'))
        .success(function(payload) {
          var data = [];

          // Filter all rooms in this array
          var filterRooms = ['?', 'eindhoven'];

          // Loop through each room
          payload.forEach(function(room) {
            var hourData = [];

            if (!(filterRooms.indexOf(room.room) > -1)) {

              // Loop trough all hours and check if the room is free on that hour.
              // Return true if the room is occupied.
              for (var hour = 1; hour < 15; hour++) {
                var hourExp = Math.pow(2, hour - 1);

                if (room.mask & hourExp) {
                  hourData.push(true);
                }
                else {
                  hourData.push(false);
                }
              }

              data.push({
                name: room.room,
                hours: hourData
              });

            }
          });

          deffered.resolve(data);
        })
        .error(function(msg, code) {
          deffered.reject(msg);
          $log.error(msg, code);
        })

        return deffered.promise;
      }
    };
  });
