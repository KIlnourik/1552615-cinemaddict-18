// Константы, используемые в проекте
const FILMS_IN_LIST_COUNT = 5;
const MAX_DESCRIPTION_LENGTH = 140;
const MIN_IN_HOUR = 60;
const UserRatings = {
  NOVICE: {
    rating: 'Novice',
    min: 1,
    max: 10,
  },
  FAN: {
    rating: 'Fan',
    min: 11,
    max: 20,
  },
  MOVIE_BUFF: {
    rating: 'Movie buff',
    min: 21,
    max: null,
  }
};
const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const Classes = {
  POPUP_CLASS: '.film-details',
  SORT_BUTTON: '.sort__button',
  SHAKE_CLASS: 'shake',
  POPUP_BTN_CLASS: '.film-details__controls',
  POPUP_COMMENTS_CLASS: '.film-details__comments-list',
  POPUP_FORM_INPUT_CLASS: '.film-details__new-comment',
};

const Emojis = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const UserAction = {
  UPDATE_FILMCARD: 'UPDATE_FILMCARD',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const NoFilmsType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

const AUTHORIZATION = 'Basic fgdgfd33l1saffas55';
const END_POINT = 'https://18.ecmascript.pages.academy/cinemaddict';
const TimeLimit = {
  LOWER_LIMIT: 300,
  UPPER_LIMIT: 800
};

const SHAKE_ANIMATION_TIMEOUT = 300;

export {
  FILMS_IN_LIST_COUNT,
  MAX_DESCRIPTION_LENGTH,
  MIN_IN_HOUR,
  FilterType,
  UserRatings,
  Classes,
  SortType,
  Emojis,
  UpdateType,
  UserAction,
  NoFilmsType,
  Method,
  END_POINT,
  AUTHORIZATION,
  TimeLimit,
  SHAKE_ANIMATION_TIMEOUT,
};
