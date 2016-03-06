export default function ($scope, holidayService) {
  // Load the holiday JSON and insert it in the scope
  holidayService.getHolidays().then((payload) => {
    $scope.holidays = payload;
  });
}
