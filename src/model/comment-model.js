import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../utils/mocks.js';
import { MAX_COMMENT_COUNT } from '../const.js';

export default class CommentModel {
  #comments = Array.from({length: getRandomInteger(0, MAX_COMMENT_COUNT)}, generateComment);

  get comments () {
    return this.#comments;
  }
}
