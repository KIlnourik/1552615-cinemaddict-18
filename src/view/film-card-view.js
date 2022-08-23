import { createElement } from '../render.js';
import { humanizeYear } from '../utils.js';
import { MAX_DESCRIPTION_LENGTH } from '../const.js';
import CommentModel from '../model/comment-model.js';

const createFilmCardView = (filmCard) => {
  const {poster, title, rating, relizeYear, duration, genre, description} = filmCard;

  const year = relizeYear !== null
    ? humanizeYear(relizeYear)
    : 'unknown';

  const getDescription = (descString, maxLength) => {
    if (descString.length > maxLength) {
      return `${descString.slice(0, maxLength - 1)}...`;
    }
    return descString;
  };

  const commentModel = new CommentModel();
  const commentsFromModel = [...commentModel.getComments()];

  return `
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getDescription(description, MAX_DESCRIPTION_LENGTH)}</p>
      <span class="film-card__comments">${commentsFromModel.length}</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView {
  constructor(filmCard) {
    this.filmCard = filmCard;
  }

  getTemplate() {
    return createFilmCardView(this.filmCard);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
