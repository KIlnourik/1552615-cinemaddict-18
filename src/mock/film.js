import { getRandomInteger, getRandomFloat } from '../utils.js';
import { MIN_RATING_VALUE, MAX_RATING_VALUE, TITLES_AND_POSTERS, GENRES, DURATIONS } from '../const.js';

export const generateDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  ];
  const randomIndex = getRandomInteger(0, description.length - 1);

  return description[randomIndex];
};

const generateTitle = (obj) => {
  const titles = Object.keys(obj);
  const randomIndex = getRandomInteger(0, titles.length - 1);
  return titles[randomIndex];
};

const generatePoster = (filmTitle, obj) => {
  if (Object.hasOwn(obj, filmTitle)) {
    return obj[filmTitle];
  }
  return null;
};

export const generateFilmCard = () => ({
  poster: generatePoster(generateTitle(TITLES_AND_POSTERS), TITLES_AND_POSTERS),
  title: generateTitle(TITLES_AND_POSTERS),
  rating: getRandomFloat(MIN_RATING_VALUE, MAX_RATING_VALUE, 1),
  reliseYear: null,
  duration: DURATIONS[getRandomInteger(0, DURATIONS.length - 1)],
  genre: GENRES[getRandomInteger(0, GENRES.length - 1)],
  description: generateDescription(),
  comments: null,
});
