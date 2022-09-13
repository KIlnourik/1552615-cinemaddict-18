import { getRandomInteger, generateRandomElement, getArrayFromRandomElements, generateDate } from '../utils/mocks.js';
import { EMOTIONS, DESCRIPTIONS, WRITERS, MIN_RATING_VALUE, MAX_COMMENT_COUNT } from '../const.js';

export const generateComment = () => ({
  id: getRandomInteger(MIN_RATING_VALUE, MAX_COMMENT_COUNT),
  author: getArrayFromRandomElements(WRITERS),
  comment: generateRandomElement(DESCRIPTIONS),
  date: generateDate(),
  emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
});
