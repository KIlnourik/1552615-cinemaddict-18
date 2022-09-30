import Observable from '../framework/observable.js';
import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../utils/mocks.js';
import { MAX_COMMENT_COUNT } from '../const.js';

export default class CommentModel extends Observable{
  #comments = Array.from({length: getRandomInteger(0, MAX_COMMENT_COUNT)}, generateComment);


  get comments () {
    return this.#comments;
  }


  addСomment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteСomment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };


}
