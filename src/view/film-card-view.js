import { createElement } from '../render.js';
import { humanizeYear, generatePoster } from '../utils.js';
import { MAX_DESCRIPTION_LENGTH, TITLES_AND_POSTERS, UNKNOWN_YEAR} from '../const.js';
import CommentModel from '../model/comment-model.js';

const createFilmCardView = (filmCard) => {
  const { title, totalRating, release, duration, genre, description } = filmCard.film_info;

  const year = release.date !== null
    ? humanizeYear(release.date)
    : UNKNOWN_YEAR;

  const filmPoster = generatePoster(title, TITLES_AND_POSTERS);

  const getDescription = (descString, maxLength) => {
    if (descString.length > maxLength) {
      return `${descString.slice(0, maxLength - 1)}...`;
    }
    return descString;
  };

  const commentModel = new CommentModel();
  const commentsFromModel = [...commentModel.comments];

  return `
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre.join(', ')}</span>
      </p>
      <img src="./images/posters/${filmPoster}" alt="" class="film-card__poster">
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
  #element = null;
  #filmCard = null;

  constructor(filmCard) {
    this.#filmCard = filmCard;
  }


  get template() {
    return createFilmCardView(this.#filmCard);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
