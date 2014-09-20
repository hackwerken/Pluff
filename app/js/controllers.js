'use strict';

/* Controllers */
angular.module('pluffApp.controllers', [])
  .controller('LanguageCtrl', LanguageCtrl)
  .controller('TimeTableCtrl', TimeTableCtrl);

function LanguageCtrl($scope, $translate) {
  $scope.switch = function($lang) {
    // Switch to the given language
    $translate.use($lang);
  }
}

function TimeTableCtrl($scope, $http, $routeParams, hourService, $window, $location, $q) {
  $scope.tableData = false;

  $scope.days = [
    {number: 1, spelled: 'MONDAY'},
    {number: 2, spelled: 'TUESDAY'},
    {number: 3, spelled: 'WEDNESDAY'},
    {number: 4, spelled: 'THURSDAY'},
    {number: 5, spelled: 'FRIDAY'}
  ];

  // TODO: start times probably aren't necessary (?)
  $scope.hours = [
    {number: 1, start: '08:45'},
    {number: 2, start: '09:35'},
    {number: 3, start: '10:45'},
    {number: 4, start: '11:35'},
    {number: 5, start: '12:25'},
    {number: 6, start: '13:15'},
    {number: 7, start: '14:05'},
    {number: 8, start: '15:15'},
    {number: 9, start: '16:05'},
    {number: 10, start: '16:55'},
    {number: 11, start: '18:00'},
    {number: 12, start: '18:50'},
    {number: 13, start: '20:00'},
    {number: 14, start: '21:40'}
  ];

  $scope.input = function() {

    // Check which timetable should be loaded
    // First if a room or class is filled in, if nothing: default to the personal timetable
    // TODO: Use dedicated URL's for the room and class.
    if ($routeParams.roomQuery) {
      return '/room/' + $routeParams.roomQuery;
    }
    else if ($routeParams.classQuery) {
      return '/class/' + $routeParams.classQuery;
    }
    else {
      return '/me';
    }
  }

  // Get the personal schedule from the API
  // TODO: Only pull the timetables for this week (calculate the difference between selected week and current week)
  $http.jsonp(APIconfig.url('/Schedule' + $scope.input() + '?includeTeacher=false&IncludeStartOfWeek=true&daysAhead=90'))
    .success(function(data, status) {
      $scope.tableData = data.data; // sorry for the awful names it's late okay?
      $scope.tableName = data.title;
    })
    .error(function(data, status, headers, config) {
      // Redirect to FHICT loginpage if there's an error, because the user probably isn't logged in
      // TODO: Check if it's a 'normal' error or auth error
      // TODO: Redirect back to Pluff
      if(status === 404) {
        console.log('Kon niet inloggen!');
        // window.location = APIconfig.loginUrl;
      }
      else {
        console.log('Andere fout ofzo.');
      }

      // TODO: Create a nice error page
    });

  // Set the default used weeknumber (without leading zero)
  $scope.weekNumberUsed = parseInt(moment().format('w'));

  $scope.weekNumber = function() {
    var weekInfo = {};

    // Get current week number (without leading zero)
    // TODO: If it's friday after 18 pm or weekend, make the current week next week
    weekInfo.current = parseInt(moment().format('w'));
    weekInfo.use = $scope.weekNumberUsed;

    // Rotate the number when the year has ended
    if (weekInfo.use === 53) {
      weekInfo.use = 1;
    }
    if (weekInfo.use === 0) {
      weekInfo.use = 52;
    }

    $scope.weekNumberUsed = weekInfo.use;

    return weekInfo;
  };

  $scope.nextWeek = function() {
    // Add 1 to the weeknumber in use
    $scope.weekNumberUsed++;
    console.log('Op naar volgende week! ' + $scope.weekNumberUsed);
  };

  $scope.currentWeek = function() {
    // Reset to the current week
    $scope.weekNumberUsed = $scope.weekNumber().current;
    console.log('Op naar de huidige week! ' + $scope.weekNumberUsed);
  };

  $scope.previousWeek = function() {
    // Subtract 1 from the weeknumber in use
    // TODO: Do something when user tries to go past the current week
    $scope.weekNumberUsed--;
    console.log('Op naar de vorige week! ' + $scope.weekNumberUsed);
  };

  $scope.getHour = function(dayNumber, hourNumber) {
    return hourService.getHour($scope, dayNumber, hourNumber);
  };

  // Bind keybindings to the window to enable right and left arrow navigation
  angular.element($window).on('keydown', function(e) {
    // Go to the next week on right arrow key
    if (e.keyCode === 39) {
      $scope.$apply(function() {
        $scope.nextWeek();
      });
    }
    // Go to the previous week on left arrow key
    if (e.keyCode === 37) {
      $scope.$apply(function() {
        $scope.previousWeek();
      });
    }
  });

  // Calculate the date of the current day
  $scope.currentDayDate = function(dayNumber) {
    return moment('2014-' + $scope.weekNumber().use + '-' + dayNumber, 'YYYY-w-d');
  }

  // Check if the current day is today
  $scope.isActiveDay = function(dayNumber) {
    if (moment().isSame($scope.currentDayDate(dayNumber), 'day')) {
      return true;
    }
  }

  // Search results
  $scope.getAllRooms = $http.jsonp(APIconfig.url('/Schedule/rooms?test'));
  $scope.getAllClasses = $http.jsonp(APIconfig.url('/Schedule/classes?test'));

  // Execute when all the requested JSON is loaded
  $q.all([$scope.getAllRooms, $scope.getAllClasses]).then(function(data) {
    var rooms = data[0].data;
    var classes = data[1].data;

    // Mix all this data in one array with the correct type
    var results = [];

    // TODO: Find a cleaner way (more DRY)
    rooms.forEach(function(room) {
      results.push({'name': room, 'type': 'room'});
    });

    classes.forEach(function(klass) {
      results.push({'name': klass, 'type': 'class'});
    });

    // Add the resulting array in the global scope for the autocomplete plugin to use it
    $scope.searchAuto = results;
  });

  // Fired when a search suggestion is selected
  $scope.searchSelected = function(selected) {
    var title = selected.originalObject.name;
    var type = selected.originalObject.type;

    // Check which type is selected (room or class) to update the url
    if (type === 'room') {
      console.log('Autocomplete room ' + title)
      $location.path('/room/' + title);
    }
    else if (type === 'class') {
      console.log('Autocomplete class ' + title)
      $location.path('/class/' + title);
    }
  }
}
