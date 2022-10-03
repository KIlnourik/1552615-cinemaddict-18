import AbstractView from '../framework/view/abstract-view.js';
import { humanizeYear, getRuntimeInHours, setActiveClass } from '../utils/common.js';
import { MAX_DESCRIPTION_LENGTH, UNKNOWN_YEAR} from '../const.js';

const createFilmCardView = (filmCard) => {
  const { title, totalRating, poster, release, runtime, genre, description } = filmCard.filmInfo;
  const { watchlist, alreadyWatched, favorite } = filmCard.userDetails;

  const year = release.date !== null
    ? humanizeYear(release.date)
    : UNKNOWN_YEAR;

  const getDescription = (descString, maxLength) => {
    if (descString.length > maxLength) {
      return `${descString.slice(0, maxLength - 1)}...`;
    }
    return descString;
  };

  return `
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${getRuntimeInHours(runtime)}</span>
        <span class="film-card__genre">${genre.join(', ')}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getDescription(description, MAX_DESCRIPTION_LENGTH)}</p>
      <span class="film-card__comments">${filmCard.comments.length}</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${setActiveClass(watchlist, 'film-card__controls-item--active')}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${setActiveClass(alreadyWatched, 'film-card__controls-item--active')}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${setActiveClass(favorite, 'film-card__controls-item--active')}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView{
  #filmCard = null;

  constructor(filmCard) {
    super();
    this.#filmCard = filmCard;
  }

  get template() {
    return createFilmCardView(this.#filmCard);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setMarkAsWatchedClickHandler = (callback) => {
    this._callback.markAsWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#markAsWatchedClickHandler);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #markAsWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsWatchedClick();
  };


  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
