import dayjs from 'dayjs';
import { MIN_IN_HOUR, FilterType, TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT } from '../const.js';

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
  [FilterType.ALL]: (filmCards) => filmCards.length,
  [FilterType.WATCHLIST]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.watchlist),
  [FilterType.HISTORY]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.favorite),
};

const commentFilter = (filmCard, comments) => comments.filter((comment) => filmCard.comments.includes(comment.id));

const watchedFilmsFilter = (filmCards) => filmCards.filter((filmCard) => filmCard.userDetails.alreadyWatched).length;

const theMostTopRatedFilmSort = (filmCards) => filmCards.slice().sort((a, b) => {
  if (a.filmInfo.totalRating < b.filmInfo.totalRating) {
    return 1;
  }
  if (a.filmInfo.totalRating > b.filmInfo.totalRating) {
    return -1;
  }
  return 0;
}).slice(0, TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT);

const theMostCommentedFilmSort = (filmCards) => filmCards.slice().sort((a, b) => {
  if (a.comments.length < b.comments.length) {
    return 1;
  }
  if (a.comments.length > b.comments.length) {
    return -1;
  }
  return 0;
}).slice(0, TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT);

const getTheTwoMostFilms = (filmCards, parameter) => {
  switch (parameter) {
    case 'rating':
      return theMostTopRatedFilmSort(filmCards);
    case 'comments':
      return theMostCommentedFilmSort(filmCards);
  }
};

const updateFilmCard = (filmCards, update) => {
  const index = filmCards.findIndex((filmCard) => filmCard.id === update.id);

  if (index === -1) {
    return filmCards;
  }

  return [
    ...filmCards.slice(0, index),
    update,
    ...filmCards.slice(index + 1)
  ];
};

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

const sortFilmCardsDown = (filmA, filmB) => {
  const weight = getWeightForNullDate(filmA.release.date, filmB.release.date);

  return weight ?? dayjs(filmB.release.date).diff(dayjs(filmA.release.date));
};

const sortRating = (ratingA, ratingB) => {
  if (ratingA < ratingB) {
    return 1;
  }
  if (ratingA > ratingB) {
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
  getTheTwoMostFilms,
  updateFilmCard,
  setActiveClass,
  sortFilmCardsDown,
  sortRating,
};
