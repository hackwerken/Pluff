import teacherDialogPartial from 'partials/dialog-teacher.html';

export default function ($scope, $http, lessonService, $window, $location, $interval, weekService, apiService, dayService, timetableData, ngDialog) {
  // Get the personal schedule from the API
  if (timetableData !== false) {
    // Get the title of the timetable and filter some words out of it
    lessonService.setInfo(timetableData.data.title, timetableData.kind);

    $scope.weeks = lessonService.getTimeTable(timetableData.data);
  } else {
    $scope.showError = true;
  }

  // Timetable could not be found. Show a list of the classes and teachers.
  if ($scope.showError) {
    apiService.getSuggestions('User').then((payload) => {
      $scope.autocompleteList = payload.data;
    });
  }

  $scope.hourBreaks = dayService.getHourBreaks();

  // Watch for changes in the weeknumber
  $scope.$watch(() => weekService.getWeekUsed(), (newValue) => {
    if (newValue) {
      $scope.weekNumberUsed = newValue;
    }
  });

  $scope.currentWeekActive = function () {
    if (weekService.isCurrentWeek()) {
      $scope.showAllDays = false;
    } else {
      $scope.showAllDays = true;
    }
  };

  $scope.nextWeek = function () {
    if (weekService.addWeek()) {
      $scope.currentWeekActive();
      console.log(`To the next week! ${weekService.getWeekUsed()} year: ${weekService.getYearUsed()}`);
    }
  };

  $scope.currentWeek = function () {
    if (weekService.currentWeek()) {
      $scope.currentWeekActive();
      console.log(`To the current week! ${weekService.getWeekUsed()} year: ${weekService.getYearUsed()}`);
    }
  };

  $scope.previousWeek = function () {
    if (weekService.subtractWeek()) {
      $scope.currentWeekActive();
      console.log(`To the previous week! ${weekService.getWeekUsed()} year: ${weekService.getYearUsed()}`);
    }
  };

  $scope.isOldWeek = function () {
    return weekService.isOldWeek();
  };

  $scope.isNewWeek = function () {
    return weekService.isNewWeek();
  };

  // Bind keybindings to the window to enable right and left arrow navigation
  angular.element($window).on('keydown', (e) => {
    // Check if not using arrow keys in searchfield
    if (document.activeElement.nodeName.toLowerCase() !== 'input') {
      // Go to the next week on right arrow key
      if (e.keyCode === 39) {
        $scope.$apply(() => {
          $scope.nextWeek();
        });
      }
      // Go to the previous week on left arrow key
      if (e.keyCode === 37) {
        $scope.$apply(() => {
          $scope.previousWeek();
        });
      }
    }
  });

  $scope.currentDayDate = function (dayNumber) {
    return dayService.getCurrentDayDate(dayNumber);
  };

  $scope.countLessons = function (day) {
    return lessonService.countLessons(day);
  };

  // Check if the current day is today
  $scope.isCurrentDay = function (dayNumber) {
    return dayService.isCurrentDay(dayNumber);
  };

  // Check if the current day is today, and if it's weekend, select monday
  $scope.isActiveDay = function (dayNumber) {
    return dayService.isActiveDay(dayNumber);
  };

  $scope.teacherDialog = function (teacher) {
    apiService.getPicture(teacher.id, 'large').then((payload) => {
      // The image is a blob; encode it to base64 so it can be put in an <img>
      const FR = new FileReader();
      FR.onload = function (e) {
        teacher.encodedPhoto = e.target.result;
      };
      FR.readAsDataURL(payload.data);
    });

    ngDialog.open({
      template: teacherDialogPartial,
      plain: true,
      data: teacher,
    });
  };

  $scope.calculateLine = function () {
    return dayService.setCalculateLine();
  };

  $interval($scope.calculateLine, 60000); // Refresh every minute
}
