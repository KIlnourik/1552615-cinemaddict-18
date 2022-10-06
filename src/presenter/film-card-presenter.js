import FilmCardView from '../view/film-card-view.js';
import { render, remove, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';

export default class FilmCardPresenter {
  #filmsListContainer = null;
  #changeData = null;
  #filmCardComponent = null;
  #commentsModel = null;

  #filmCard = null;
  #filmPopupPresenter = null;

  constructor(filmsListContainer, changeData, commentsModel, filmPopupPresenter) {
    this.#filmsListContainer = filmsListContainer;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
    this.#filmPopupPresenter = filmPopupPresenter;
  }

  init = (filmCard) => {
    this.#filmCard = filmCard;

    const prevFilmCardComponent = this.#filmCardComponent;

    this.#filmCardComponent = new FilmCardView(this.#filmCard);

    this.#filmCardComponent.setClickHandler(() => {
      this.#filmPopupPresenter.init(this.#filmCard);
    });

    this.#filmCardComponent.setFavoriteClickHandler(this.#favoriteClickHandler);
    this.#filmCardComponent.setWatchlistClickHandler(this.#watchlistClickHandler);
    this.#filmCardComponent.setMarkAsWatchedClickHandler(this.#watchedClickHandler);

    if (prevFilmCardComponent === null) {
      render(this.#filmCardComponent, this.#filmsListContainer);
      return;
    } else {
      replace(this.#filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  };

  destroy = () => {
    remove(this.#filmCardComponent);
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
}
