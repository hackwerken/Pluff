appServices.factory('lessonService', function(moment) {
  var data = {};

  function getTeacher(teachers, teacherAbbr) {
    return teachers.filter(function(teacher) {
      return teacher.personalTitle.toLowerCase() === teacherAbbr;
    })[0];
  }

  // Parse the timetable title
  var tableInfo;
  data.setInfo = function(title, kind) {
    tableInfo = {
      // We only want a small part of the title.
      title: title.replace(/Rooster |Schedule /, '').replace(/\((.*)\)$/, ''),
      kind: kind
    };

    return tableInfo;
  };

  data.getInfo = function() {
    return tableInfo;
  };

  // Count the lessons in the day
  data.countLessons = function(day) {
    var totalLessons = 0;

    day.forEach(function(hour) {
      var hourCount = parseInt(hour.lessons.length);
      totalLessons = totalLessons + hourCount;
    });

    return totalLessons;
  };

  // Generate a color based on a string
  data.generateColor = function(name, total) {
    // Generator seed, must leave a hex of at least 1000 (so 4096 or above)
    total = total || 4096;

    // Loop every character and multiply with the generator seed
    for (var i = 0; i < name.length; i++) {
      total = total * name.charCodeAt(i);
    }

    // Convert total to hex
    total = total.toString(16);

    // Variables
    var minSaturation = 50;
    var minLightness = 35;
    var maxLightness = 47;

    // Calculate values
    var hue = parseInt(total.substring(0, 3), 16) % 360;
    var saturation = parseInt(total.substring(1, 3), 16) % (99 - minSaturation) + minSaturation;
    var lightness = parseInt(total.substring(2, 4), 16) % (maxLightness - minLightness + 1) + minLightness;

    // Output to the HSL color format
    var color = 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)';
    return color;
  };

  data.getTimeTable = function(payload) {
    var weeks = [];

    // Create 52 empty weeks, create within every week 5 days (Mo - Fr) and 14 hours
    // TODO: Seperate from the rest
    for (var week = 0; week < 52; week++) {
      weeks[week] = [];

      for (var day = 0; day < 5; day++) {
        weeks[week][day] = [];

        for (var hour = 0; hour < 14; hour++) {
          weeks[week][day][hour] = {
            number: (hour + 1),
            lessons: []
          };
        }
      }
    }

    // Filter all subjects in this array
    var filterSubjects = ['delta'];

    // Process the timetable data
    payload.data.forEach(function(lesson) {
      var start = moment(lesson.start);
      var end = moment(lesson.end);
      var startWeeknumber = start.format('w'); // Output: weeknumber (without leading zero)
      var startDaynumber = start.format('d'); // Output: daynumber of week (1 - 5), 1 = Monday

      // Convert mask to binary and get the length to minimize needed loops
      var hourLength = lesson.hoursMask.toString(2).length;

      // Iterate over every possible hour and check if there's a lesson in it
      for (var hourNumber = 1; hourNumber <= hourLength; hourNumber++) {
        // Get the exponent of the hourNumber (current hour) (^2 - 1)
        // Equalize the current hour with the mask
        var hourExp = Math.pow(2, hourNumber - 1);

        // Check if the current hour (hourNumber) is in the mask
        // And if the subject isn't in the filterSubjects array
        // Ex.: if a mask is 12, the binary code of it is 1100. This means that the lesson is in the third and fourth hour
        if (lesson.hoursMask & hourExp && !(filterSubjects.indexOf(lesson.subject) > -1)) {
          // Reformat the lesson data to include only what is needed
          var lessonData = {
            start: start.format('H:mm'),
            end: end.format('H:mm'),
            date: start.format('YYYY-MM-DD'),
            teacher: getTeacher(payload.teachers, lesson.teacherAbbreviation),
            subject: lesson.subject.toLowerCase(),
            room: lesson.room,
            description: lesson.description,
            classes: lesson.classes,
            color: data.generateColor(lesson.subject)
          };

          // Select the current hour and push the new lesson to it
          // Array keys are zero based, and skipping the first key results in a hell
          weeks[(startWeeknumber - 1)][(startDaynumber - 1)][(hourNumber - 1)].lessons.push(lessonData);
        }
      }
    });

    return weeks;
  };

  return data;
});
