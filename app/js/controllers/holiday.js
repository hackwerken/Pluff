appCtrls.controller('HolidayCtrl', function($scope, holidayService) {
  // Load the holiday JSON and insert it in the scope
  holidayService.getHolidays().then(function(payload) {
    $scope.holidays = payload;
  });

});
