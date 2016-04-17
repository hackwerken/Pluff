import teacherDialogPartial from 'partials/dialog-teacher.html';

export default function ($scope, $http, lessonService, $window, $location, $interval, weekService, apiService, dayService, timetableInfo, ngDialog) {
  function parseTimetable(kind, data) {
    $scope.showError = false;
    // Get the title of the timetable and filter some words out of it
    lessonService.setInfo(data.title, kind);

    $scope.week = lessonService.getTimeTable(data);
  }

  function failedTimetable() {
    $scope.showError = true;
    // Fetch a list of classes and teachers if timetable could not be found
    apiService.getSuggestions('User').then((payload) => {
      $scope.autocompleteList = payload.data;
    });
  }

  function fetchTimetable(date) {
    return apiService.getTimeTable(timetableInfo.url, date).then((payload) => (
      parseTimetable(timetableInfo.kind, payload.data)
    ), failedTimetable);
  }

  fetchTimetable(weekService.now());

  $scope.hourBreaks = dayService.getHourBreaks();
  $scope.hourDurations = dayService.getHourDurations();

  // Watch for changes in the weeknumber
  $scope.$watch(() => weekService.getCurrent(), (newValue) => {
    if (newValue) {
      $scope.currentWeekDate = newValue;
    }
  });

  $scope.currentWeekActive = function () {
    if (weekService.isCurrentWeek()) {
      $scope.showAllDays = false;
    } else {
      $scope.showAllDays = true;
    }
  };

  $scope.toNextWeek = function () {
    fetchTimetable(weekService.next());
    $scope.currentWeekActive();
    console.log(`To the next week! ${weekService.getCurrent().format('W')}`);
  };

  $scope.toPresentWeek = function () {
    fetchTimetable(weekService.now());
    $scope.currentWeekActive();
    console.log(`To the current week! ${weekService.getCurrent().format('W')}`);
  };

  $scope.toPreviousWeek = function () {
    const date = weekService.previous();
    if (date) {
      fetchTimetable(date);
      $scope.currentWeekActive();
      console.log(`To the previous week! ${weekService.getCurrent().format('W')}`);
    }
  };

  $scope.isOldWeek = function () {
    return weekService.isBeforeNow();
  };

  // Bind keybindings to the window to enable right and left arrow navigation
  angular.element($window).on('keydown', (e) => {
    // Check if not using arrow keys in searchfield
    if (document.activeElement.nodeName.toLowerCase() !== 'input') {
      // Go to the next week on right arrow key
      if (e.keyCode === 39) {
        $scope.$apply(() => {
          $scope.toNextWeek();
        });
      }
      // Go to the previous week on left arrow key
      if (e.keyCode === 37) {
        $scope.$apply(() => {
          $scope.toPreviousWeek();
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
