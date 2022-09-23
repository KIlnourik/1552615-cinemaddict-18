import { getRandomInteger, generateRandomElement, getArrayFromRandomElements, generateDate } from '../utils/mocks.js';
import { EMOTIONS, DESCRIPTIONS, WRITERS } from '../const.js';
import { nanoid } from 'nanoid';

export const generateComment = () => ({
  id: nanoid(),
  author: getArrayFromRandomElements(WRITERS),
  comment: generateRandomElement(DESCRIPTIONS),
  date: generateDate(),
  emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
});
