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
        if (currentDay.isSame(lesson.start, 'day') && filterSubjects.indexOf(lesson.subject) && lesson.hoursMask & hourExp) {
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

        var deferred = $q.defer();

        $http.jsonp(APIconfig.url('/Schedule' + input + '?includeTeacher=false&IncludeStartOfWeek=true&daysAhead=90'))
        .success(function(payload) {
          deferred.resolve(payload);
        })
        .error(function(msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);

          // Redirect to FHICT loginpage if there's an error, because the user probably isn't logged in
          // TODO: Check if it's a 'normal' error or auth error
          // TODO: Redirect back to Pluff
          window.location = APIconfig.loginUrl;
        })

        return deferred.promise;
      },
      getTeacher: function(teacher) {
        return $http.jsonp(APIconfig.url('/people/search/' + teacher + '?test'));
      },
      getSuggestions: function() {
        return $http.jsonp(APIconfig.url('/schedule/autocomplete?test'));
      }
    }
  });
