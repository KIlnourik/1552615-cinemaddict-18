import { generateFilmCard } from '../mock/film.js';
import { MAX_DAYS_GAP } from '../const.js';

export default class FilmCardModel {

  #filmCards = Array.from({length: MAX_DAYS_GAP}, generateFilmCard);

  get filmCards () {
    return this.#filmCards;
  }
}
