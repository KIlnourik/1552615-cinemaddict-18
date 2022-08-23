import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// Функция получения случайного числа с плавающей точкой
const getRandomFloat = (min, max, numbsAfterPoint) =>{
  if (min < 0 || max < 0) {
    return -1;
  }

  if (max < min) {
    [min, max] = [max, min];
  }
  return (Math.random() * (max - min + 1) + min).toFixed(numbsAfterPoint);
};

const humanizeYear = (date) => dayjs(date).format('YYYY');
const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

export {getRandomInteger, getRandomFloat, humanizeDate, humanizeYear};
