import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove, replace } from '../framework/render.js';
import { POPUP_CLASS } from '../const.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;
  #filmCardComponent = null;
  #filmPopup = null;

  #filmCard = null;
  #filmComments = null;
  #prevFilmPopup = null;
  #body = null;

  constructor(filmsListContainer, changeData) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
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

    this.#filmCardComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmCardComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmCardComponent.setMarkAsWatchedClickHandler(this.#watchedClickHandler);


    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    }

    if (this.#filmsListContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (document.body.contains(prevFilmPopup.element)) {
      this.#closePopup();
      this.#showPopup();
    }

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopup);
  };

  #showPopup = () => {
    const popup = document.querySelector(POPUP_CLASS);
    if (popup) {
      document.body.removeChild(popup);
    }
    render(this.#filmPopup, document.body);
    document.body.classList.add('hide-overflow');

    this.#filmPopup.setClickHandler(() => {
      this.#closePopup();
    });

    this.#filmPopup.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmPopup.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmPopup.setMarkAsWatchedClickHandler(this.#watchedClickHandler);
  };

  #closePopup = () => {
    remove(this.#filmPopup, document.body);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #favoriteClickHandler = () => {
    this.#changeData({ ...this.#filmCard, userDetails: { ...this.#filmCard.userDetails, favorite: !this.#filmCard.userDetails.favorite } });
  };

  #watchedClickHandler = () => {
    this.#changeData({ ...this.#filmCard, userDetails: { ...this.#filmCard.userDetails, alreadyWatched: !this.#filmCard.userDetails.alreadyWatched } });
  };

  #watchlistClickHandler = () => {
    this.#changeData({ ...this.#filmCard, userDetails: { ...this.#filmCard.userDetails, watchlist: !this.#filmCard.userDetails.watchlist } });
  };

}
