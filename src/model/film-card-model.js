import { generateFilmCard } from '../mock/film.js';
import { FILMS_IN_LIST_COUNT } from '../const.js';

export default class FilmCardModel {

  filmCards = Array.from({length: FILMS_IN_LIST_COUNT}, generateFilmCard);

  getFilmCards = () => this.filmCards;
}
