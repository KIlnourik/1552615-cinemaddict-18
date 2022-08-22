import { getRandomInteger, getRandomFloat } from '../utils.js';
import { MIN_RATING_VALUE, MAX_RATING_VALUE } from '../const.js';

export const generateDescription = () => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];
  const randomIndex = getRandomInteger(0, description.length - 1);

  return description[randomIndex];
};

export const generateFilmCard = () => ({
  poster: null,
  title: null,
  rating: getRandomFloat(MIN_RATING_VALUE, MAX_RATING_VALUE, 1),
  reliseYear: null,
  duration: null,
  genre: null,
  description: generateDescription(),
  commentCount: null,
});
