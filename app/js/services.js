'use strict';

/* Services */

angular.module('pluffApp.services', [])
  .factory('lessonService', function() {
    var data = {};

    data.generateColor = function(name) {
      // Number between 0 and 1
      var generatedNumber = (Math.sin(name.charCodeAt(0)) + Math.sin(name.charCodeAt(1)) + Math.sin(name.charCodeAt(2))) / 6 + 0.5;

      // Create whole numbers between 0 and 5
      var type = Math.floor(generatedNumber * 6);

      // Create a number based on generatedNumber between 61 en 223 -> to HEX
      var value = Math.floor((Math.sin(generatedNumber * 2000) + 1) * 50 + 61).toString(16);
      if (value.length === 1) {
        value = '0' + value;
      }

      // Choose part of the color based on the outcome of type (so we can control the colors a little)
      switch (type) {
        case 0:
          return '#3ddf' + value;
        case 1:
          return '#' + value + 'df3d';
        case 2:
          return '#df' + value + '3d';
        case 3:
          return '#df3d' + value;
        case 4:
          return '#' + value + '3ddf';
        case 5:
        case 6:
          return '#3d' + value + 'df';
        default:
          return '#fff';
      }
    };

    data.getTimeTable = function(payload) {
      var weeks = [];

      // Create 52 empty weeks, create within every week 5 days (Mo - Fr) and 14 hours
      // TODO: Seperate from the rest
      for (var week = 0; week < 52; week++) {
        weeks[week] = [];

        for (var day = 0; day < 5; day++) {
          weeks[week][day] = [];

          for (var hour = 0; hour < 14; hour++) {
            weeks[week][day][hour] = {
              number: (hour + 1),
              lessons: []
            };
          }
        }
      }

      // Filter all subjects in this array
      var filterSubjects = ['delta'];

      // Process the timetable data
      payload.forEach(function(lesson) {
        var start = moment(lesson.start);
        var end = moment(lesson.end);
        var startWeeknumber = start.format('w'); // Output: weeknumber (without leading zero)
        var startDaynumber = start.format('d'); // Output: daynumber of week (1 - 5), 1 = Monday

        // Convert mask to binary and get the length to minimize needed loops
        var hourLength = lesson.hoursMask.toString(2).length;

        // Iterate over every possible hour and check if there's a lesson in it
        for (var hourNumber = 1; hourNumber <= hourLength; hourNumber++) {
          // Get the exponent of the hourNumber (current hour) (^2 - 1)
          // Equalize the current hour with the mask
          var hourExp = Math.pow(2, hourNumber - 1);

          // Check if the current hour (hourNumber) is in the mask
          // And if the subject isn't in the filterSubjects array
          // Ex.: if a mask is 12, the binary code of it is 1100. This means that the lesson is in the third and fourth hour
          if (lesson.hoursMask & hourExp && !(filterSubjects.indexOf(lesson.subject) > -1)) {
            // Reformat the lesson data to include only what is needed
            var lessonData = {
              'start': start.format('H:mm'),
              'end': end.format('H:mm'),
              'date': start.format('YYYY-MM-DD'),
              'teacher': lesson.teacherAbbreviation.toLowerCase(),
              'subject': lesson.subject.toLowerCase(),
              'room': lesson.room,
              'classes': lesson.classes,
              'color': data.generateColor(lesson.subject)
            };

            // Select the current hour and push the new lesson to it
            // Array keys are zero based, and skipping the first key results in a hell
            weeks[(startWeeknumber - 1)][(startDaynumber - 1)][(hourNumber - 1)].lessons.push(lessonData);
          }
        }
      });

      return weeks;
    };

    return data;
  })
  .factory('dataService', function($http, $log, $q) {
    return {
      getTimeTable: function(input) {
        return $http.jsonp(APIconfig.url('/schedule' + input + '?expandTeacher=false&IncludeStartOfWeek=true&daysAhead=90'));
      },
      getTeacher: function(teacher) {
        return $http.jsonp(APIconfig.url('/people/abbreviation/' + teacher + '?test'));
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
        });

        return deferred.promise;
      }
    };
  })
  .factory('roomService', function($http, $log, $q) {
    return {
      getFreeRooms: function() {
        var deffered = $q.defer();

        $http.jsonp(APIconfig.url('/schedule/rooms/occupancy/today?test'))
        .success(function(payload) {
          var data = [];

          // Filter all rooms in this array
          var filterRooms = ['?', 'eindhoven'];

          // Loop through each room
          payload.forEach(function(room) {
            var hourData = [];

            if (!(filterRooms.indexOf(room.room) > -1)) {

              // Loop trough all hours and check if the room is free on that hour
              // Return true if the room is occupied
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
        });

        return deffered.promise;
      }
    };
  });
