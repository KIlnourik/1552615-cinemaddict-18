import { getRandomInteger, getRandomFloat, generateRandomElement} from '../utils.js';
import { MIN_RATING_VALUE, MAX_RATING_VALUE, GENRES, DURATIONS, TITLES_AND_POSTERS, MAX_YEARS_GAP } from '../const.js';
import { DESCRIPTIONS } from '../const.js';
import dayjs from 'dayjs';

const generateYear = () => {
  const isYear = Boolean(getRandomInteger(0, 1));
  if (!isYear) {
    return null;
  }

  const yearsGap = getRandomInteger(-MAX_YEARS_GAP, MAX_YEARS_GAP);
  return dayjs().add(yearsGap, 'year').toDate();
};

export const generateFilmCard = () => ({
  title: generateRandomElement(Object.keys(TITLES_AND_POSTERS)),
  poster: null,
  rating: getRandomFloat(MIN_RATING_VALUE, MAX_RATING_VALUE, 1),
  releaseYear: generateYear(),
  duration: DURATIONS[getRandomInteger(0, DURATIONS.length - 1)],
  genre: GENRES[getRandomInteger(0, GENRES.length - 1)],
  description: generateRandomElement(DESCRIPTIONS),
  comments: null,
})
