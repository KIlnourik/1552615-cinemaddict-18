import { getRandomInteger, generateRandomElement } from '../utils.js';
import { EMOTIONS, DESCRIPTIONS } from '../const.js';

export const generateComment = () => ({
  id: getRandomInteger(),
  text: generateRandomElement(DESCRIPTIONS),
  emotion: EMOTIONS[getRandomInteger],
  author: null,
  date: null
});
