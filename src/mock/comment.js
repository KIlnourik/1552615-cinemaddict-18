import { getRandomInteger } from '../utils.js';
import { generateDescription } from './film.js';
import { EMOTIONS } from '../const.js';
import CommentDeleteButtonView from '../view/comment-delete-button-view.js';


export const generateComment = () => ({
  id: getRandomInteger(),
  text: generateDescription(),
  emotion: EMOTIONS[getRandomInteger],
  author: null,
  date: null,
  deleteButton: new CommentDeleteButtonView(),
});
