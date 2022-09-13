import { generateFilmCard } from '../mock/film.js';
import { getRandomInteger } from '../utils/mocks.js';
import { MAX_FILM_COUNT, MIN_RATING_VALUE} from '../const.js';

export default class FilmCardModel {

  #filmCards = Array.from({length: getRandomInteger(MIN_RATING_VALUE, MAX_FILM_COUNT)}, generateFilmCard);

  get filmCards () {
    return this.#filmCards;
  }
}
