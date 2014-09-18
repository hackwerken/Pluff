'use strict';

/* Controllers */
angular.module('pluffApp.controllers', [])
  .controller('TimeTableCtrl', TimeTableCtrl);

function TimeTableCtrl($scope, $http, $routeParams, hourService, $window) {
  $scope.tableData = false;

  $scope.days = [
    {number: 1, spelled: 'Maandag'},
    {number: 2, spelled: 'Dinsdag'},
    {number: 3, spelled: 'Woensdag'},
    {number: 4, spelled: 'Donderdag'},
    {number: 5, spelled: 'Vrijdag'}
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
    // If there's something filled in (teacher, room or class)
    if ($routeParams.query) {
      console.log('Er is wat ingevuld: ' + $routeParams.query);

      return '/query/' + $routeParams.query;
    }
    else {
      return '/me';
    }
  }

  // Get the personal schedule from the API
  // TODO: Only pull the timetables for this week (calculate the difference between selected week and current week)
  $http.jsonp(APIconfig.url('/Schedule' + $scope.input() + '?includeTeacher=false&daysAhead=90'))
    .success(function(data, status) {
      $scope.tableData = data.data; // sorry for the awful names it's late okay?
      $scope.tableName = data.title;
    })
    .error(function(data, status) {
      // Redirect to FHICT loginpage if there's an error, because the user probably isn't logged in
      // TODO: Check if it's a 'normal' error or auth error
      // TODO: Redirect back to Pluff
      window.location = 'https://portal.fhict.nl/CookieAuth.dll?GetLogon?reason=0&formdir=6';

      // TODO: Create a nice error page
    });

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
}
