import dayjs from 'dayjs';
import { MIN_IN_HOUR, FilterType} from '../const.js';

// Функции применяемые в проекте
const getRuntimeInHours = (runtime) => {
  const hours = Math.trunc(runtime / MIN_IN_HOUR);
  if (hours === 0) {
    return `${runtime % MIN_IN_HOUR}m`;
  }
  return `${Math.trunc(runtime / MIN_IN_HOUR)}h ${runtime % MIN_IN_HOUR}m`;
};

const humanizeYear = (date) => dayjs(date).format('YYYY');
const humanizeCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');
const humanizeReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');

const filter = {
  [FilterType.ALL]: (filmCards) => filmCards,
  [FilterType.WATCHLIST]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.watchlist),
  [FilterType.HISTORY]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.favorite),
};

const commentFilter = (filmCard, comments) => comments.filter((comment) => filmCard.comments.includes(comment.id));

const watchedFilmsFilter = (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.alreadyWatched).length;

const setActiveClass = (value, activeClass) => (value) ? activeClass : '';

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortByDate = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.filmInfo.release.date, filmB.filmInfo.release.date);

  return weight ?? dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

const sortByRating = (filmA, filmB) => {
  if (filmA.filmInfo.totalRating < filmB.filmInfo.totalRating) {
    return 1;
  }
  if (filmA.filmInfo.totalRating > filmB.filmInfo.totalRating) {
    return -1;
  }
  return 0;
};

export {
  getRuntimeInHours,
  humanizeCommentDate,
  humanizeReleaseDate,
  humanizeYear,
  filter,
  commentFilter,
  watchedFilmsFilter,
  setActiveClass,
  sortByDate,
  sortByRating,
};
