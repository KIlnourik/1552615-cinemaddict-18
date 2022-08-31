import { getRandomInteger, generateRandomElement } from '../utils.js';
import { EMOTIONS, DESCRIPTIONS } from '../const.js';

export const generateComment = () => ({
  id: getRandomInteger(),
  author: null,
  comment: generateRandomElement(DESCRIPTIONS),
  date: null,
  emotion: EMOTIONS[getRandomInteger],
});
