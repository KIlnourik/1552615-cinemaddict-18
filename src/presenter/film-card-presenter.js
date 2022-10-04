import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove, replace } from '../framework/render.js';
import { Classes, UserAction, UpdateType } from '../const.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;
  #filmCardComponent = null;
  #filmPopup = null;
  #commentsModel = null;

  #filmCard = null;
  #filmComments = null;
  #isPopup = false;

  constructor(filmsListContainer, changeData, commentsModel) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
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
  };

  setSaving = () => {
    this.#filmCardComponent.updateElement({
      isDisabled: true
    });
  };

  #showPopup = async () => {
    const prevPopup = document.querySelector(Classes.POPUP_CLASS);
    await this.#commentsModel.get(this.#filmCard.id);
    if (prevPopup) {
      this.#closePopup();
    }
    render(this.#filmPopup, document.body);
    document.body.classList.add('hide-overflow');

    this.#filmPopup.setClickHandler(() => {
      this.#closePopup();
    });

    this.#filmPopup.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmPopup.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmPopup.setMarkAsWatchedClickHandler(this.#watchedClickHandler);
    this.#filmPopup.setAddCommentHandler(this.#commentAddHandler);
    this.#filmPopup.setDeleteClickHandler(this.#deleteClickHandler);
    this.#isPopup = true;
  };

  #closePopup = async () => {
    remove(this.#filmPopup);
    document.body.classList.remove('hide-overflow');
    this.#filmPopup.reset(this.#filmCard, await this.#commentsModel.get(this.#filmCard.id));
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isPopup = false;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #favoriteClickHandler = () => {
    const changedData = !this.#filmCard.userDetails.favorite;
    this.#filmCard.userDetails.favorite = changedData;
    const filmCard = this.#filmCard;
    this.#changeData(
      UserAction.UPDATE_FILMCARD,
      UpdateType.MINOR,
      filmCard
    );
  };

  #watchedClickHandler = () => {
    const changedData = !this.#filmCard.userDetails.alreadyWatched;
    this.#filmCard.userDetails.alreadyWatched = changedData;
    const filmCard = this.#filmCard;
    this.#changeData(
      UserAction.UPDATE_FILMCARD,
      UpdateType.MINOR,
      filmCard
    );
  };

  #watchlistClickHandler = () => {
    const changedData = !this.#filmCard.userDetails.watchlist;
    this.#filmCard.userDetails.watchlist = changedData;
    const filmCard = this.#filmCard;
    this.#changeData(
      UserAction.UPDATE_FILMCARD,
      UpdateType.MINOR,
      filmCard
    );
  };

  #commentAddHandler = (comment) => {
    this.#filmCard.comments.push(comment.id);
    const filmCard = this.#filmCard;
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      { comment, filmCard }
    );
  };

  #deleteClickHandler = (commentId) => {
    const index = this.#filmCard.comments.findIndex((id) => commentId === id);
    this.#filmCard.comments.splice(index, 1);
    const filmCard = this.#filmCard;
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      { commentId, filmCard },
    );
  };
}
