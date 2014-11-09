appServices.factory('roomService', function($http, $log, $q, dataService) {
  return {
    getFreeRooms: function() {
      var deffered = $q.defer();

      $http.jsonp(dataService.getConfig().url('/schedule/rooms/occupancy/today'))
        .success(function(payload) {
          var data = [];

          // Filter all rooms in this array
          var filterRooms = ['?', 'eindhoven', 'helmond'];

          // Loop through each room
          payload.forEach(function(room) {
            var hourData = [];

            if (!(filterRooms.indexOf(room.room) > -1)) {

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
                name: room.room,
                hours: hourData
              });

            }
          });

          deffered.resolve(data);
        })
        .error(function(msg, code) {
          deffered.reject(msg);
          $log.error(msg, code);
        });

      return deffered.promise;
    }
  };
});
