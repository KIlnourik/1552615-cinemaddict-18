// Константы, используемые в проекте
const FILMS_IN_LIST_COUNT = 5;
const TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT = 2;
const MAX_DESCRIPTION_LENGTH = 140;
const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
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

// Константы для моковых данных
const MIN_RATING_VALUE = 0;
const MAX_RATING_VALUE = 10;
const MAX_COMMENT_COUNT = 100;
const MAX_FILM_COUNT = 25;
const TITLES_AND_POSTERS = {
  'Made For Each Other': 'made-for-each-other.png',
  'Sagebrush trail': 'sagebrush-trail.jpg',
  'The dance of life': 'the-dance-of-life.jpg',
  'The great flmarion': 'the-great-flamarion.jpg',
  'Popeye meets Sinbad': 'popeye-meets-sinbad.png',
};
const GENRES = ['Drama', 'Comedy', 'Horror', 'Adventure', 'Fantasy'];
const UNKNOWN_YEAR = 'Unknown';
const MAX_DAYS_GAP = 7;
const AGE_RATINGS = ['6+', '12+', '16+', '18+'];
const WRITERS = [
  'Ernest Hemingway',
  'Pikachu',
  'Stephen Edwin King',
  'Erich Maria Remarque',
  'Daniel Keyes',
  'George Orwell'
];
const DIRECTORS = [
  'Christopher Nolan',
  'Coen brothers',
  'Guillermo del Toro',
  'Wes Anderson'
];
const ACTORS = [
  'Jackie Chan',
  'Clint Eastwood',
  'Somebody who we really dont know',
];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

export {
  FILMS_IN_LIST_COUNT,
  TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT,
  MAX_DESCRIPTION_LENGTH,
  EMOTIONS,
  MIN_RATING_VALUE,
  MAX_RATING_VALUE,
  MAX_COMMENT_COUNT,
  MAX_FILM_COUNT,
  MIN_IN_HOUR,
  FilterType,
  TITLES_AND_POSTERS,
  GENRES,
  AGE_RATINGS,
  WRITERS,
  DIRECTORS,
  ACTORS,
  UNKNOWN_YEAR,
  MAX_DAYS_GAP,
  DESCRIPTIONS,
  UserRatings
};
