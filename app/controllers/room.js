import moment from 'moment';

export default function ($scope, roomService, dayService) {
  // Load all the rooms with occupied information if it isn't sunday (API gives an error on sundays)
  const isSunday = moment().day() === 0;

  $scope.hours = dayService.getHourNumbers();

  if (!isSunday) {
    roomService.getFreeRooms().then((payload) => {
      $scope.rooms = payload;
    });
  }
}
