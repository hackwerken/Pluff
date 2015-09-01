appServices.factory('roomService', function($log, $q, apiService) {
  return {
    getFreeRooms: function() {
      var deffered = $q.defer();

      apiService.getRoomOccupancy('today')
        .then(function(payload) {
          var data = [];
          // Filter all rooms in this array
          var filterRooms = ['?', 'eindhoven', 'helmond', 'extern'];

          // Loop through each room
          payload.data.forEach(function(room) {
            var hourData = [];

            if (!(filterRooms.indexOf(room.roomId) > -1)) {

              // Loop trough all hours and check if the room is free on that hour
              // Return true if the room is occupied
              for (var hour = 1; hour < 15; hour++) {
                var hourExp = Math.pow(2, hour - 1);

                if (room.mask & hourExp) {
                  hourData.push(true);
                } else {
                  hourData.push(false);
                }
              }

              data.push({
                name: room.roomId,
                hours: hourData
              });

            }
          });

          deffered.resolve(data);
        }, function(msg, code) {
          deffered.reject(msg);
          $log.error(msg, code);
        });

      return deffered.promise;
    }
  };
});
