import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class CommentModel extends Observable {
  #comments = [];
  #commentsApiService = null;

  constructor(commentsApiServer) {
    super();
    this.#commentsApiService = commentsApiServer;
  }

  get comments() {
    return this.#comments;
  }

  init = async (filmCardId) => {
    try {
      this.#comments = await this.#commentsApiService.get(filmCardId);
      // return this.#comments;
    } catch {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT);

  };


  addСomment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteСomment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

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
