import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render } from '../framework/render.js';

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

    this.#filmCardComponent = new FilmCardView(filmCard);
    this.#filmPopup = new FilmPopupView(filmCard, filmComments);


    this.#filmCardComponent.setClickHandler(() => {
      this.#showPopup();
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });
    this.#filmPopup.setClickHandler(() => {
      this.#closePopup();
    });

    render(this.#filmCardComponent, this.#filmsListContainer);
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
