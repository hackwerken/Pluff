export default function ($log, $q, apiService) {
  return {
    getFreeRooms() {
      const deffered = $q.defer();

      apiService.getRoomOccupancy('today')
        .then((payload) => {
          const data = [];
          // Filter all rooms in this array
          const filterRooms = ['?', 'eindhoven', 'helmond', 'extern'];

          // Loop through each room
          payload.data.forEach((room) => {
            const hourData = [];

            if (!(filterRooms.indexOf(room.roomId) > -1)) {
              // Loop trough all hours and check if the room is free on that hour
              // Return true if the room is occupied
              for (let hour = 1; hour < 15; hour++) {
                const hourExp = Math.pow(2, hour - 1);

                if (room.mask & hourExp) {
                  hourData.push(true);
                } else {
                  hourData.push(false);
                }
              }

              data.push({
                name: room.roomId,
                hours: hourData,
              });
            }
          });

          deffered.resolve(data);
        }, (msg, code) => {
          deffered.reject(msg);
          $log.error(msg, code);
        });

      return deffered.promise;
    },
  };
}
