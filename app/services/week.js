import moment from 'moment';

export default function () {
  const time = moment();
  let current;
  let now;

  // Set default weeknumber. In the weekend, use the next week number
  if (time.day() === 0 || time.day() === 6) {
    now = time.add(2, 'd').startOf('isoweek');
  } else {
    now = time.startOf('isoweek');
  }

  return {
    isBeforeNow() {
      return current.unix() <= now.unix();
    },
    previous() {
      if (!this.isBeforeNow()) {
        return current.subtract(7, 'd');
      }
      return false;
    },
    next() {
      current.add(7, 'd');
      return current;
    },
    now() {
      current = now.clone();
      return current;
    },
    getCurrent() {
      return current;
    },
    isCurrentWeek() {
      return current.isSame(now);
    },
  };
}
