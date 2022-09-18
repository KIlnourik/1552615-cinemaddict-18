import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove } from '../framework/render.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;

  #filmCardComponent = null;
  #filmPopup = null;

  #filmCard = null;
  #filmComments = null;

  constructor(filmsListContainer) {
    this.#filmsListContainer = filmsListContainer;
  }

  init = (filmCard, filmComments) => {
    this.#filmCard = filmCard;
    this.#filmComments = filmComments;

    const prevFilmCardComponent = this.#filmCardComponent;
    const prevFilmPopup = this.#filmPopup;

    this.#filmCardComponent = new FilmCardView(this.#filmCard);
    this.#filmPopup = new FilmPopupView(this.#filmCard, this.#filmComments);

    this.#filmCardComponent.setClickHandler(() => {
      this.#showPopup();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmPopup.setClickHandler(() => {
      this.#closePopup();
    });

    if (prevFilmCardComponent === null || prevFilmPopup === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmPopup);

  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopup);
  };

  #showPopup = () => {
    document.body.appendChild(this.#filmPopup.element);
    document.body.classList.add('hide-overflow');
  };

  #closePopup = () => {
    document.body.removeChild(this.#filmPopup.element);
    document.body.classList.remove('hide-overflow');
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

}
