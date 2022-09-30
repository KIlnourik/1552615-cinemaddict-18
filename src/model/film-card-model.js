import Observable from '../framework/observable.js';
import { generateFilmCard } from '../mock/film.js';
import { getRandomInteger } from '../utils/mocks.js';
import { MAX_COMMENT_COUNT, MIN_RATING_VALUE} from '../const.js';

export default class FilmCardModel extends Observable{

  #filmCards = Array.from({length: getRandomInteger(MIN_RATING_VALUE, MAX_COMMENT_COUNT)}, generateFilmCard);

  get filmCards () {
    return this.#filmCards;
  }

  updateFilmCard = (updateType, update) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#filmCards = [
      ...this.#filmCards.slice(0, index),
      update,
      ...this.#filmCards.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

}
