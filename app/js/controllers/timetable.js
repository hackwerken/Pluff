appCtrls.controller('TimeTableCtrl', function($scope, $http, lessonService, $window, $location, weekService, dataService, dayService, timetableData, ngDialog) {
  // Get the personal schedule from the API
  if (timetableData !== false) {
    // Get the title of the timetable and filter some words out of it
    $scope.tableTitle = lessonService.setTitle(timetableData.title);

    $scope.weeks = lessonService.getTimeTable(timetableData.data);
  }
  else {
    $scope.showError = true;
  }

  $scope.hourBreaks = dayService.getHourBreaks();

  // Watch for changes in the weeknumber
  $scope.$watch(function() {
    return weekService.getWeekUsed();
  }, function(newValue) {
    if (newValue) {
      $scope.weekNumberUsed = newValue;
    }
  });

  $scope.currentWeekActive = function() {
    if (weekService.isCurrentWeek()) {
      $scope.showAllDays = false;
    }
    else {
      $scope.showAllDays = true;
    }
  };

  $scope.nextWeek = function() {
    if (weekService.addWeek()) {
      $scope.currentWeekActive();
      console.log('To the next week! ' + weekService.getWeekUsed() + ' year:' + weekService.getYearUsed());
    }
  };

  $scope.currentWeek = function() {
    if (weekService.currentWeek()) {
      $scope.currentWeekActive();
      console.log('To the current week! ' + weekService.getWeekUsed() + ' year:' + weekService.getYearUsed());
    }
  };

  $scope.previousWeek = function() {
    if (weekService.subtractWeek()) {
      $scope.currentWeekActive();
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
    // Check if not using arrow keys in searchfield
    if (document.activeElement.nodeName.toLowerCase() != 'input') {
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
    return dayService.setCalculateLine();
  };

  $window.setInterval($scope.calculateLine, 60000); // Refresh every minute
});
