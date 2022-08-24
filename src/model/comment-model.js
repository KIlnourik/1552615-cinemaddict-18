import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../utils.js';
import { MAX_COMMENT_COUNT } from '../const.js';

export default class CommentModel {
  comments = Array.from({length: getRandomInteger(0, MAX_COMMENT_COUNT)}, generateComment);

  getComments = () => this.comments;
}
