import { getRandomInteger, generateRandomElement, getArrayFromRandomElements, generateDate } from '../utils/mocks.js';
import { EMOTIONS, DESCRIPTIONS, WRITERS } from '../const.js';

export const generateComment = () => ({
  id: getRandomInteger(0, 100),
  author: getArrayFromRandomElements(WRITERS),
  comment: generateRandomElement(DESCRIPTIONS),
  date: generateDate(),
  emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
});
