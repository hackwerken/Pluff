'use strict';

/* Controllers */
angular.module('pluffApp.controllers', [])
  .controller('LanguageCtrl', LanguageCtrl)
  .controller('NavCtrl', NavCtrl)
  .controller('TimeTableCtrl', TimeTableCtrl)
  .controller('HolidaysCtrl', HolidaysCtrl);

function LanguageCtrl($scope, $translate, $route) {
  $scope.switch = function($lang) {
    // Switch to the given language
    $translate.use($lang);
    // Full page reload to apply all languages
    window.location.reload();
  }
}

function NavCtrl($scope, ngDialog) {
  $scope.holidays = function() {
    ngDialog.open({
      template: 'partials/dialog-holidays.html',
      controller: 'HolidaysCtrl'
    });
  }
}

function TimeTableCtrl($scope, $http, hourService, $window, $location, $q, dataService, timetableData, ngDialog) {
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

  // Get the personal schedule from the API
  $scope.tableData = timetableData.data;
  $scope.tableTitle = timetableData.title;

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

  $scope.isOldWeek = function() {
    console.log();
    if ($scope.weekNumberUsed <= $scope.weekNumber().current) {
      return true;
    }
    return false;
  }

  $scope.lessonStartEndTime = function(start, end) {
    var startTime = moment(start);
    var endTime = moment(end);

    return startTime.format('H:m') + ' - ' + endTime.format('H:m');
  }

  dataService.getSuggestions().then(function(payload) {
    // Add the resulting array in the global scope for the autocomplete plugin to use it
    $scope.searchAuto = payload.data;
  });

  // Fired when a search suggestion is selected
  $scope.searchSelected = function(selected) {
    var title = selected.originalObject.name;
    var category = selected.originalObject.category;

    // Check which category is selected (room or class) to update the url
    console.log('Autocomplete ' + category + ' ' + title);
    $location.path('/' + category + '/' + title);
  };

  $scope.teacherDialog = function(teacherAbr) {
    dataService.getTeacher(teacherAbr).then(function(payload) {
      var data = payload.data[0];

      ngDialog.open({
        template: 'partials/dialog-teacher.html',
        data: data
      });
    });
  }
}

function HolidaysCtrl($scope, $http, holidayService) {
  holidayService.getHolidays().then(function(payload) {
    $scope.holidays = payload;
  });

}
