import { getRandomInteger, getRandomFloat, generateRandomElement, getArrayFromRandomElements } from '../utils/mocks.js';
import { MIN_RATING_VALUE, MAX_RATING_VALUE, GENRES, TITLES_AND_POSTERS, MAX_DAYS_GAP,MAX_COMMENT_COUNT, WRITERS, AGE_RATINGS, DIRECTORS, ACTORS,DESCRIPTIONS } from '../const.js';
import dayjs from 'dayjs';

const generateDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));
  if (!isDate) {
    return null;
  }

  const daysGap = getRandomInteger(-MAX_DAYS_GAP, MAX_DAYS_GAP);
  return dayjs().add(daysGap, 'year').toDate();
};

export const generateFilmCard = () => ({
  id: getRandomInteger,
  comments: [],
  filmInfo: {
    title: generateRandomElement(Object.keys(TITLES_AND_POSTERS)),
    alternativeTitle: null,
    totalRating: getRandomFloat(MIN_RATING_VALUE, MAX_RATING_VALUE, 1),
    poster: null,
    ageRating: generateRandomElement(AGE_RATINGS),
    director: generateRandomElement(DIRECTORS),
    writers: getArrayFromRandomElements(WRITERS),
    actors: getArrayFromRandomElements(ACTORS),
    release: {
      date: generateDate(),
      releaseCountry: null,
    },
    runtime: getRandomInteger(MIN_RATING_VALUE, MAX_COMMENT_COUNT),
    genre: getArrayFromRandomElements(GENRES),
    description: generateRandomElement(DESCRIPTIONS),
  },
  userDetails: {
    watchlist: false,
    alreadeyWatched: true,
    watchindDate: null,
    favourite: false,
  },
});
