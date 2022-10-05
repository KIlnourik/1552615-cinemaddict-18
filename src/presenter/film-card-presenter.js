import FilmCardView from '../view/film-card-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import { render, remove, replace } from '../framework/render.js';
import { Classes, UserAction, UpdateType } from '../const.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;
  #filmCardComponent = null;
  #filmPopupComponent = null;
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
    const prevFilmPopup = this.#filmPopupComponent;

    this.#filmCardComponent = new FilmCardView(this.#filmCard);
    this.#filmPopupComponent = new FilmPopupView(this.#filmCard, this.#filmComments);

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
      replace(this.#filmPopupComponent, prevFilmPopup);
      this.#closePopup();
      this.#showPopup();
    }

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
    // this.#closePopup();
  };

  setDeleting = () => {
    this.#filmCardComponent.updateElement({
      isDeleting: true
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#filmPopupComponent.updateElement({
        isDeleting: false,
      });
    };
    this.#filmPopupComponent.shake(resetFormState);
  };

  #showPopup = async () => {
    const prevPopup = document.querySelector(Classes.POPUP_CLASS);
    if (prevPopup) {
      document.body.removeChild(prevPopup);
    }
    await this.#commentsModel.get(this.#filmCard.id);
    render(this.#filmPopupComponent, document.body);
    document.body.classList.add('hide-overflow');

    this.#filmPopupComponent.setClickHandler(() => {
      this.#closePopup();
    });

    this.#filmPopupComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmPopupComponent.setMarkAsWatchedClickHandler(this.#watchedClickHandler);
    this.#filmPopupComponent.setAddCommentHandler(this.#commentAddHandler);
    this.#filmPopupComponent.setDeleteClickHandler(this.#deleteClickHandler);
    this.#isPopup = true;
  };

  #closePopup = async () => {
    remove(this.#filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    this.#filmPopupComponent.reset(this.#filmCard, await this.#commentsModel.get(this.#filmCard.id));
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
