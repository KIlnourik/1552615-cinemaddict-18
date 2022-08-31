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

const generateRandomElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

const getPoster = (filmTitle, obj) => {
  if (Object.hasOwn(obj, filmTitle)) {
    return obj[filmTitle];
  }
  return null;
};

const getArrayFromRandomElements = (arr) => {
  const randomInt = getRandomInteger(1, arr.length - 1);
  const randomLengthArray = new Array(randomInt).fill(null).map(() => generateRandomElement(arr));
  return Array.from(new Set(randomLengthArray));
};

const getRuntimeInHours = (runtime) => {
  const hours = Math.trunc(runtime / 60);
  if (hours === 0) {
    return `${runtime % 60}m`;
  }
  return `${Math.trunc(runtime / 60)}h ${runtime % 60}m`;
};

const humanizeYear = (date) => dayjs(date).format('YYYY');
const humanizeCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');
const humanizeReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');

export {
  getRandomInteger,
  getRandomFloat,
  generateRandomElement,
  getPoster,
  getRuntimeInHours,
  getArrayFromRandomElements,
  humanizeCommentDate,
  humanizeReleaseDate,
  humanizeYear
};
