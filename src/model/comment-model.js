import Observable from '../framework/observable.js';

export default class CommentModel extends Observable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get = async (filmId) => {
    this.#comments = await this.#apiService.get(filmId);
    return this.#comments;
  };

  add = async (updateType, update, film) => {
    try {
      const newComment = await this.#apiService.add(update, film);
      this.#comments = [newComment, ...this.#comments];
      this._notify(updateType, newComment);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  delete = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.delete(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };

}
