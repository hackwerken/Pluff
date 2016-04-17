import moment from 'moment';
import generateColor from './lesson/generateColor';
import emptyWeek from './lesson/emptyWeek';

export default function () {
  const data = {};

  function getTeacher(teachers, teacherAbbr) {
    return teachers.find((teacher) => {
      // Some lessons don't have a teacher
      if (teacher !== null) {
        return teacher.personalTitle.toLowerCase() === teacherAbbr;
      }
      return null;
    });
  }

  // Parse the timetable title
  let tableInfo;
  data.setInfo = function (title, kind) {
    tableInfo = {
      // We only want a small part of the title.
      title: title ? title.replace(/Rooster |Schedule /, '').replace(/\((.*)\)$/, '') : '',
      kind,
    };

    return tableInfo;
  };

  data.getInfo = function () {
    return tableInfo;
  };

  // Count the lessons in the day
  data.countLessons = function (day) {
    let totalLessons = 0;

    day.forEach((hour) => {
      const hourCount = parseInt(hour.lessons.length);
      totalLessons = totalLessons + hourCount;
    });

    return totalLessons;
  };

  data.getTimeTable = function (payload) {
    const week = emptyWeek();

    // Filter all subjects in this array
    const filterSubjects = ['delta'];

    // Process the timetable data
    payload.data.forEach((lesson) => {
      const start = moment(lesson.start);
      const end = moment(lesson.end);
      const startDaynumber = start.format('d'); // Output: daynumber of week (1 - 5), 1 = Monday

      // Convert mask to binary and get the length to minimize needed loops
      const hourLength = lesson.hoursMask.toString(2).length;

      // Iterate over every possible hour and check if there's a lesson in it
      for (let hourNumber = 1; hourNumber <= hourLength; hourNumber++) {
        // Get the exponent of the hourNumber (current hour) (^2 - 1)
        // Equalize the current hour with the mask
        const hourExp = Math.pow(2, hourNumber - 1);

        // Check if the current hour (hourNumber) is in the mask
        // And if the subject isn't in the filterSubjects array
        // Ex.: if a mask is 12, the binary code of it is 1100. This means that the lesson is in the third and fourth hour
        if (lesson.hoursMask & hourExp && !(filterSubjects.indexOf(lesson.subject) > -1)) {
          // Reformat the lesson data to include only what is needed
          const lessonData = {
            start: start.format('H:mm'),
            end: end.format('H:mm'),
            date: start.format('YYYY-MM-DD'),
            teacher: getTeacher(payload.teachers, lesson.teacherAbbreviation),
            subject: lesson.subject.toLowerCase(),
            room: lesson.room,
            description: lesson.description,
            classes: lesson.classes,
            color: generateColor(lesson.subject),
          };

          // Select the current hour and push the new lesson to it
          // Array keys are zero based, and skipping the first key results in a hell
          week[(startDaynumber - 1)][(hourNumber - 1)].lessons.push(lessonData);
        }
      }
    });

    return week;
  };

  return data;
}
