import { getRandomInteger, getRandomFloat, generateRandomElement, getArrayFromRandomElements, generateDate } from '../utils/mocks.js';
import { MIN_RATING_VALUE, MAX_RATING_VALUE, GENRES, TITLES_AND_POSTERS,MAX_COMMENT_COUNT, WRITERS, AGE_RATINGS, DIRECTORS, ACTORS,DESCRIPTIONS } from '../const.js';

const getArrayFromRandomIntegers = () => {
  const randomArray = Array.from({length: getRandomInteger(0, MAX_COMMENT_COUNT)}, getRandomInteger);
  return getArrayFromRandomElements(randomArray);
};

export const generateFilmCard = () => ({
  id: getRandomInteger,
  comments: getArrayFromRandomIntegers(),
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
    watchlist: Boolean(getRandomInteger(0, 1)),
    alreadyWatched: Boolean(getRandomInteger(0, 1)),
    watchingDate: generateDate(),
    favorite: Boolean(getRandomInteger(0, 1)),
  },
});
