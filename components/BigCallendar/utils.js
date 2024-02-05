import {useRef, useState} from 'react';
import {Animated, Easing} from 'react-native';
import moment from 'moment';

const m = moment();
const ruConfig = {
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    monthNames: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
  selectedFormat: 'YYYY/MM/DD',
  dateFormat: 'YYYY/MM/DD',
  monthYearFormat: 'YYYY MM',
  timeFormat: 'HH:mm ',
  hour: 'Час',
  minute: 'Минут',
  timeSelect: 'Выбрать',
  timeClose: 'Закрыть',
};
const gregorianConfigs = {
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  selectedFormat: 'YYYY/MM/DD',
  dateFormat: 'YYYY/MM/DD',
  monthYearFormat: 'YYYY MM',
  timeFormat: 'HH:mm',
  hour: 'Hour',
  minute: 'Minute',
  timeSelect: 'Select',
  timeClose: 'Close',
};

class utils {
  constructor({minimumDate, maximumDate, isGregorian, mode, reverse, configs}) {
    this.data = {
      minimumDate,
      maximumDate,
      isGregorian,
      reverse: reverse === 'unset' ? !isGregorian : reverse,
    };
    this.config = isGregorian ? gregorianConfigs : ruConfig;
    this.config = {...this.config, ...configs};
    if (mode === 'time' || mode === 'datepicker') {
      this.config.selectedFormat = this.config.dateFormat + ' ' + this.config.timeFormat;
    }
  }

  get flexDirection() {
    return {flexDirection:  'row'};
  }

  getFormated = (date, formatName = 'selectedFormat') => date.format(this.config[formatName]);

  getFormatedDate = (date = new Date(), format = 'YYYY/MM/DD') => moment(date).format(format);

  getTime = (time) => this.getDate(time).format(this.config.timeFormat);

  getToday = () => this.getFormated(m, 'dateFormat');

  getMonthName = (month) => this.config.monthNames[month];

  toPersianNumber = (value) => {
    return this.toEnglish(String(value))
  };

  toEnglish = (value) => {
    return value
  };

  getDate = (time) => moment(time, this.config.selectedFormat);

  getMonthYearText = (time) => {
    const date = this.getDate(time);
    const year = this.toPersianNumber(date.year());
    const month = this.getMonthName(date.month());
    return `${month} ${year}`;
  };

  checkMonthDisabled = (time) => {
    const {minimumDate, maximumDate} = this.data;
    const date = this.getDate(time);
    let disabled = false;
    if (minimumDate) {
      const lastDayInMonth = date.date(29);
      disabled = lastDayInMonth < this.getDate(minimumDate);
    }
    if (maximumDate && !disabled) {
      const firstDayInMonth = date.date(1);
      disabled = firstDayInMonth > this.getDate(maximumDate);
    }
    return disabled;
  };

  checkArrowMonthDisabled = (time, next) => {
    const date = this.getDate(time);
    return this.checkMonthDisabled(
      this.getFormated(date.add(next ? -1 : 1, 'month')),
    );
  };

  checkYearDisabled = (year, next) => {
    const {minimumDate, maximumDate } = this.data;
    const y = this.getDate(next ? maximumDate : minimumDate).year()
    return next ? year >= y : year <= y;
  };

  checkSelectMonthDisabled = (time, month) => {
    const date = this.getDate(time);
    const dateWithNewMonth = date.month(month);
    return this.checkMonthDisabled(this.getFormated(dateWithNewMonth));
  };

  validYear = (time, year) => {
    const {minimumDate, maximumDate } = this.data;
    const date = this.getDate(time).year(year) ;
    let validDate = this.getFormated(date);
    if (minimumDate && date < this.getDate(minimumDate)) {
      validDate = minimumDate;
    }
    if (maximumDate && date > this.getDate(maximumDate)) {
      validDate = maximumDate;
    }
    return validDate;
  };

  getMonthDays = (time) => {
    const {minimumDate, maximumDate, isGregorian} = this.data;
    let date = this.getDate(time);
    const currentMonthDays = date.daysInMonth()
    const firstDay = date.date(0);
    const dayOfMonth = (firstDay.day() + Number(isGregorian)) % 7;
    return [
      ...new Array(dayOfMonth),
      ...[...new Array(currentMonthDays)].map((i, n) => {
        const thisDay = date.date(n + 1)
        let disabled = false;
        if (minimumDate) {
          disabled = thisDay < this.getDate(minimumDate);
        }
        if (maximumDate && !disabled) {
          disabled = thisDay > this.getDate(maximumDate);
        }

        date = this.getDate(time);
        return {
          dayString: this.toPersianNumber(n + 1),
          day: n ,
          date: this.getFormated( date.date(n + 1)),
          disabled,
        };
      }),
    ];
  };

  useMonthAnimation = (activeDate, distance, onEnd = () => null) => {
    const [lastDate, setLastDate] = useState(activeDate);
    const [changeWay, setChangeWay] = useState(null);
    const monthYearAnimation = useRef(new Animated.Value(0)).current;

    const changeMonthAnimation = (type) => {
      setChangeWay(type);
      setLastDate(activeDate);
      monthYearAnimation.setValue(1);
      Animated.timing(monthYearAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.bezier(0.33, 0.66, 0.54, 1),
      }).start(onEnd);
    };

    const shownAnimation = {
      opacity: monthYearAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
      }),
      transform: [
        {
          translateX: monthYearAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, changeWay === 'NEXT' ? distance : -distance],
          }),
        },
      ],
    };

    const hiddenAnimation = {
      opacity: monthYearAnimation,
      transform: [
        {
          translateX: monthYearAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [changeWay === 'NEXT' ? -distance : distance, 0],
          }),
        },
      ],
    };

    return [{lastDate, shownAnimation, hiddenAnimation}, changeMonthAnimation];
  };
}

export {utils};
