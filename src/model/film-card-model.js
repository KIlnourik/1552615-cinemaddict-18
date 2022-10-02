import Observable from '../framework/observable.js';
import { generateFilmCard } from '../mock/film.js';

export default class FilmCardModel extends Observable{
  #filmsApiSrevice = null;
  #filmCards = Array.from({length: 25}, generateFilmCard);

  constructor(filmsApiServer) {
    super();
    this.#filmsApiSrevice = filmsApiServer;

    this.#filmsApiSrevice.filmCards.then((filmCards) => {
      console.log(filmCards);
    });
  }

  get filmCards () {
    return this.#filmCards;
  }

  set filmCards (filmCards) {
    this.#filmCards = filmCards;
  }

  updateFilmCard = (updateType, update) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting filmcard');
    }

    this.#filmCards = [
      ...this.#filmCards.slice(0, index),
      update,
      ...this.#filmCards.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

}
