appCtrls.controller('RoomCtrl', function($scope, roomService, moment) {
  // Load all the rooms with occupied information if it isn't sunday (API gives an error on sundays)
  var isSunday = moment().day() === 0;

  if (!isSunday) {
    roomService.getFreeRooms().then(function(payload) {
      $scope.rooms = payload;
    });
  }

});
