appCtrls.controller('TimeTableCtrl', function($scope, $rootScope, $http, lessonService, $window, $location, weekService, dataService, dayService, timetableData, ngDialog) {
  // Get the personal schedule from the API
  $scope.weeks = lessonService.getTimeTable(timetableData.data);

  // Get the title of the timetable and filter some words out of it
  $scope.tableTitle = lessonService.setTitle(timetableData.title);

  $scope.hourBreaks = dayService.getHourBreaks();

  // Watch for changes in the weeknumber
  $scope.$watch(function() {
    return weekService.getWeekUsed();
  }, function(newValue) {
    if (newValue) {
      $scope.weekNumberUsed = newValue;
    }
  });

  $scope.nextWeek = function() {
    if (weekService.addWeek()) {
      console.log('To the next week! ' + weekService.getWeekUsed() + ' year:' + weekService.getYearUsed());
    }
  };

  $scope.currentWeek = function() {
    weekService.currentWeek();
    console.log('To the current week! ' + weekService.getWeekUsed() + ' year:' + weekService.getYearUsed());
  };

  $scope.previousWeek = function() {
    if (weekService.subtractWeek()) {
      console.log('To the previous week! ' + weekService.getWeekUsed() + ' year:' + weekService.getYearUsed());
    }
  };

  $scope.isOldWeek = function() {
    return weekService.isOldWeek();
  };

  $scope.isNewWeek = function() {
    return weekService.isNewWeek();
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

  $scope.currentDayDate = function(dayNumber) {
    return dayService.getCurrentDayDate(dayNumber);
  };

  $scope.countLessons = function(day) {
    return lessonService.countLessons(day);
  };

  // Check if the current day is today
  $scope.isCurrentDay = function(dayNumber) {
    return dayService.isCurrentDay(dayNumber);
  };

  // Check if the current day is today, and if it's weekend, select monday
  $scope.isActiveDay = function(dayNumber) {
    return dayService.isActiveDay(dayNumber);
  };

  $scope.teacherDialog = function(teacherAbr) {
    // When the API data is loaded, open the dialog
    dataService.getTeacher(teacherAbr).then(function(payload) {
      var data = payload.data;

      ngDialog.open({
        template: 'partials/dialog-teacher.html',
        data: data
      });
    });
  };

  $scope.calculateLine = function() {
    dayService.setCalculateLine();
  };

  $window.setInterval($scope.calculateLine, 60000); // Refresh every minute
});
