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
    } catch {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT);
  };


  addСomment = async (updateType, update) => {
    try {
      const newComment = await this.#commentsApiService.addComment(update);
      this.#comments = [newComment, ...this.#comments];
      this._notify(updateType, newComment);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteСomment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }


    try {
      await this.#commentsApiService.deleteСomment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
