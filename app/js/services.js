'use strict';

/* Services */

angular.module('pluffApp.services', [])
  .factory('lessonService', function(moment) {
    var data = {};

    data.title = '';

    // Parse the timetable title
    data.setTitle = function(title) {
      // We don't need some words in the title, so get them out of here.
      var titleFilters = ['Rooster '];

      data.title = title.replace(new RegExp(titleFilters.join('|')), '');
    };

    data.getTitle = function() {
      return data.title;
    };

    // Checks if a hex color is too bright (contrast too low)
    data.isTooLightYIQ = function(hexcolor) {
      var r = parseInt(hexcolor.substr(0, 2), 16);
      var g = parseInt(hexcolor.substr(2, 2), 16);
      var b = parseInt(hexcolor.substr(4, 2), 16);
      var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

      return yiq >= 200;
    };

    // Generate a color based on a string
    data.generateColor = function(name, total) {
      // Generator seed, can be every high number (above ~ 6 million)
      total = total || 6000000;

      // Loop every character and multiply with the generator seed
      for (var i = 0; i < name.length; i++) {
        total = total * name.charCodeAt(i);
      }

      var color = total.toString(16).substr(2, 6);

      // Multiply the color with 200.000 if it was too bright
      if (data.isTooLightYIQ(color)) {
        color = (total * 200000).toString(16).substr(2, 6);
      }

      return '#' + color;
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
              start: start.format('H:mm'),
              end: end.format('H:mm'),
              date: start.format('YYYY-MM-DD'),
              teacher: lesson.teacherAbbreviation.toLowerCase(),
              subject: lesson.subject.toLowerCase(),
              room: lesson.room,
              classes: lesson.classes,
              color: data.generateColor(lesson.subject)
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
  .factory('weekService', function(moment) {
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
      }
    };
  })
  .factory('dataService', function($http, $window) {
    return {
      getSuggestions: function() {
        return $http.jsonp(APIconfig.url('/schedule/autocomplete'))
          .error(function() {
            // User isn't logged in, so redirect to portal
            // This is the most reliable method I found yet.
            // If you know something better, PLEASE don't hesitate to create a PR. You would be my hero.
            $window.location = APIconfig.loginUrl;
          });;
      },
      getTimeTable: function(input) {
        return $http.jsonp(APIconfig.url('/schedule' + input + '?expandTeacher=false&IncludeStartOfWeek=true&daysAhead=90'));
      },
      getTeacher: function(teacher) {
        return $http.jsonp(APIconfig.url('/people/abbreviation/' + teacher));
      }
    };
  })
  .factory('holidayService', function($http, $log, $q, moment) {
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

        $http.jsonp(APIconfig.url('/schedule/rooms/occupancy/today'))
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
                  } else {
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
  })
  .factory('colorService', function($http) {
    return {
      getSubjects: function() {
        return $http.jsonp(APIconfig.url('/schedule/subjects'));
      }
    };
  });
