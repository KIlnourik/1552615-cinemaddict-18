import FilmPopupView from '../view/film-popup-view.js';
import { render, remove, replace } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import { UserAction, UpdateType, TimeLimit } from '../const.js';

export default class FilmPopupPresenter {
  #commentsModel = null;
  #filmsModel = null;
  #filmPopupComponent = null;
  #filmCard = null;
  #filmComments = null;
  #isPopup = false;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(filmsModel, commentsModel) {
    this.#commentsModel = commentsModel;
    this.#filmsModel = filmsModel;
  }

  init = async (filmCard) => {
    this.#filmCard = filmCard;
    this.#filmComments = await this.#commentsModel.get(this.#filmCard.id);
    const prevFilmPopup = this.#filmPopupComponent;
    this.#filmPopupComponent = new FilmPopupView(this.#filmCard, this.#filmComments);

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#commentsModel.addObserver(this.#modelEventHandler);

    this.#showPopup();
    document.addEventListener('keydown', this.#escKeyDownHandler);

    if (prevFilmPopup === null || !this.#isPopup) {
      this.#renderPopup();
    } else {
      replace(this.#filmPopupComponent, prevFilmPopup);
    }
  };

  destroy = () => {
    remove(this.#filmPopupComponent);
  };

  #resetFormState = () => {
    this.#filmPopupComponent.updateElement({
      filmCard: this.#filmCard,
      filmComments: this.#filmComments,
      deletingCommentId: null,
    });
  };


  #showPopup = async () => {
    await this.#commentsModel.get(this.#filmCard.id);
    this.#filmPopupComponent.setClickHandler(() => {
      this.#closePopup();
    });
    this.#renderPopup();
    this.#filmPopupComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmPopupComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmPopupComponent.setMarkAsWatchedClickHandler(this.#watchedClickHandler);
    this.#filmPopupComponent.setAddCommentHandler(this.#commentAddHandler);
    this.#filmPopupComponent.setDeleteClickHandler(this.#deleteClickHandler);
  };

  #renderPopup = () => {
    render(this.#filmPopupComponent, document.body);
    document.body.classList.add('hide-overflow');
    this.#isPopup = true;
  };

  #closePopup = async () => {
    const comments = await this.#commentsModel.get(this.#filmCard.id);
    remove(this.#filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    this.#filmPopupComponent.reset(this.#filmCard, comments);
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
    this.#viewActionHandler(
      UserAction.UPDATE_FILMCARD,
      UpdateType.MINOR,
      filmCard
    );
  };

  #watchedClickHandler = () => {
    const changedData = !this.#filmCard.userDetails.alreadyWatched;
    this.#filmCard.userDetails.alreadyWatched = changedData;
    const filmCard = this.#filmCard;
    this.#viewActionHandler(
      UserAction.UPDATE_FILMCARD,
      UpdateType.MINOR,
      filmCard
    );
  };

  #watchlistClickHandler = () => {
    const changedData = !this.#filmCard.userDetails.watchlist;
    this.#filmCard.userDetails.watchlist = changedData;
    const filmCard = this.#filmCard;
    this.#viewActionHandler(
      UserAction.UPDATE_FILMCARD,
      UpdateType.MINOR,
      filmCard
    );
  };

  #commentAddHandler = (comment) => {
    this.#filmCard.comments.push(comment.id);
    const filmCard = this.#filmCard;
    this.#viewActionHandler(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      { comment, filmCard }
    );
  };

  #deleteClickHandler = (commentId) => {
    const index = this.#filmCard.comments.findIndex((id) => commentId === id);
    this.#filmCard.comments.splice(index, 1);
    const filmCard = this.#filmCard;
    this.#viewActionHandler(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      { commentId, filmCard },
    );
  };

  #modelEventHandler = () => {
    this.#updatePopup();
  };

  #updatePopup = async () => {
    const comments = await this.#commentsModel.get(this.#filmCard.id);
    this.#filmPopupComponent.updateElement({
      filmCard: this.#filmCard,
      filmComments: comments,
    });
  };

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_FILMCARD:
        try {
          await this.#filmsModel.updateFilmCard(updateType, update);
        } catch (err) {
          this.#filmPopupComponent.shakePopupButton();
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          this.#commentsModel.add(updateType, update.comment, update.filmCard);
          this.#filmsModel.updateFilmCard(updateType, update.filmCard);
        } catch (err) {
          this.#filmPopupComponent.shakePopupInput(this.#resetFormState);
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          this.#filmPopupComponent.updateElement({ deletingCommentId: update.commentId });
          await this.#commentsModel.delete(updateType, update.commentId);
          this.#filmsModel.updateFilmCard(updateType, update.filmCard);
        } catch (err) {
          this.#filmPopupComponent.shakeDeletingComment(this.#resetFormState);
        }
        break;
    }
    this.#uiBlocker.unblock();
  };
}
