import { getRandomInteger, getRandomFloat, generateRandomElement} from '../utils.js';
import { MIN_RATING_VALUE, MAX_RATING_VALUE, GENRES, DURATIONS, TITLES_AND_POSTERS, MAX_DAYS_GAP } from '../const.js';
import { DESCRIPTIONS } from '../const.js';
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
  'id': getRandomInteger,
  'comments': [],
  'film_info': {
    'title': generateRandomElement(Object.keys(TITLES_AND_POSTERS)),
    'alternative_title': null,
    'totalRating': getRandomFloat(MIN_RATING_VALUE, MAX_RATING_VALUE, 1),
    'poster': null,
    'ageRating': null,
    'director': null,
    'writers': [],
    'actors': [],
    'release': {
      'date': generateDate(),
      'release_country': null,
    },
    'runtime': DURATIONS[getRandomInteger(0, DURATIONS.length - 1)],
    'genre': [GENRES[getRandomInteger(0, GENRES.length - 1)]],
    'description': generateRandomElement(DESCRIPTIONS),
  },
  'user_details': {
    'watchlist': false,
    'alreadey_watched': true,
    'watchind_date': null,
    'favourite': false,
  },
});
