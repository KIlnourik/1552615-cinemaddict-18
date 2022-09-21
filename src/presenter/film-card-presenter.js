import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove, replace } from '../framework/render.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;
  #filmCardComponent = null;
  #filmPopup = null;

  #filmCard = null;
  #filmComments = null;
  #prevFilmPopup = null;
  #changePopup = null;
  #body = null;

  constructor(filmsListContainer, changeData, changePopup) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#changePopup = changePopup;
  }

  init = (filmCard, filmComments) => {
    this.#filmCard = filmCard;
    this.#filmComments = filmComments;

    const prevFilmCardComponent = this.#filmCardComponent;
    this.#body = document.body;
    this.#prevFilmPopup = this.#filmPopup;

    this.#filmCardComponent = new FilmCardView(this.#filmCard);
    this.#filmPopup = new FilmPopupView(this.#filmCard, this.#filmComments);

    this.#filmCardComponent.setClickHandler(() => {
      this.#showPopup(this.#filmPopup);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#filmCardComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmCardComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmCardComponent.setMarkAsWatchedClickHandler(this.#watchedClickHandler);


    this.#filmPopup.setClickHandler(() => {
      this.#closePopup();
    });
    this.#filmPopup.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmPopup.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmPopup.setMarkAsWatchedClickHandler(this.#watchedClickHandler);

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    }

    if (this.#filmsListContainer.contains(prevFilmCardComponent.element)) {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    if (this.#body.contains(this.#prevFilmPopup.element)) {
      replace(this.#filmPopup, this.#prevFilmPopup);
    }

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    remove(this.#filmPopup);
  };

  changePopup = () => {
    if (this.#body.contains(this.#prevFilmPopup.element)) {
      remove(this.#prevFilmPopup);
      render(this.#filmPopup, this.#body);
    }
  };

  #showPopup = () => {
    render(this.#filmPopup, this.#body);
    this.#body.classList.add('hide-overflow');
  };

  #closePopup = () => {
    remove(this.#filmPopup, this.#body);
    this.#body.classList.remove('hide-overflow');
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
