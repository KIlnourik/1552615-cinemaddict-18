
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsFiltersView from '../view/films-filters-view.js';
import SortFiltersView from '../view/sort-filters-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmsView from '../view/no-films-view.js';
import { FILMS_IN_LIST_COUNT, SortType, UpdateType, UserAction } from '../const.js';
import { render, remove } from '../framework/render.js';
import { sortByDate, sortByRating } from '../utils/common.js';
import FilmCardPresenter from './film-card-presenter.js';

export default class FilmPresenter {
  #filmsContainer = new FilmsView();
  #filmsList = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #showMoreButtonComponent = null;
  #noFilmCardsComponent = new NoFilmsView();
  #mainContainer = null;
  #filmCardsModel = null;
  #commentModel = null;
  #renderedFilmCardsCount = FILMS_IN_LIST_COUNT;
  #filter = null;
  #filterFilmsComponent = null;
  #sortFilterComponent = null;
  #filmCardPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(mainContainer, filmCardsModel, commentModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#commentModel = commentModel;
    this.#filmCardsModel.addObserver(this.#modelEventHandler);
  }

  get filmCards() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmCardsModel.filmCards].sort(sortByDate);
      case SortType.RATING:
        return [...this.#filmCardsModel.filmCards].sort(sortByRating);
      default:
    }
    return this.#filmCardsModel.filmCards;
  }

  get comments() {
    return this.#commentModel.comments;
  }

  init = () => {
    this.#renderFilmList();
  };

  #viewActionHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILMCARD:
        this.#filmCardsModel.updateFilmCard(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentModel.addСomment(updateType, update.comment);
        this.#filmCardsModel.updateFilmCard(updateType, update.filmCard);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentModel.deleteСomment(updateType, update.commentId);
        this.#filmCardsModel.updateFilmCard(updateType, update.filmCard);
        break;
    }
  };

  #modelEventHandler = (updateType, filmCard) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCardPresenter.get(filmCard.id).init(filmCard, this.comments);
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmList();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmList({ resetRenderedFilmCardsCount: true, resetSortType: true });
        this.#renderFilmList();
        break;
    }
  };

  #showMoreButtonClickHandler = () => {
    const filmCardsCount = this.filmCards.length;
    const newRenderedFilmCardsCount = Math.min(filmCardsCount, this.#renderedFilmCardsCount + FILMS_IN_LIST_COUNT);
    const filmCards = this.filmCards.slice(this.#renderedFilmCardsCount, newRenderedFilmCardsCount);
    this.#renderFilmCards(filmCards, this.comments);

    this.#renderedFilmCardsCount = newRenderedFilmCardsCount;

    if (this.#renderedFilmCardsCount >= filmCardsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #sortFilterTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearFilmList({ resetRenderedFilmCardsCount: true });
    this.#renderFilmList();
  };

  #renderFilters = () => {
    render(new FilmsFiltersView(filters, 'all'), this.#mainContainer);
  };

  #renderSort = () => {
    this.#sortFilterComponent = new SortFiltersView(this.#currentSortType);
    this.#sortFilterComponent.setSortTypeChangeHandler(this.#sortFilterTypeChangeHandler);
    render(this.#sortFilterComponent, this.#mainContainer);
  };

  #renderNoFilms = () => {
    render(this.#noFilmCardsComponent, this.#filmsContainer.element);
  };

  #renderFilmCard = (filmCard, filmComments) => {
    const filmCardComponent = new FilmCardPresenter(this.#filmsListContainer.element, this.#viewActionHandler);
    filmCardComponent.init(filmCard, filmComments);
    this.#filmCardPresenter.set(filmCard.id, filmCardComponent);
  };

  #renderFilmCards = (filmCards, filmComments) => {
    filmCards.forEach((filmCard) => this.#renderFilmCard(filmCard, filmComments));
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);
    render(this.#showMoreButtonComponent, this.#filmsList.element);
  };

  #renderFilmList = () => {

    const filmCards = this.filmCards;
    const filmCardsCount = filmCards.length;
    this.#renderFilters();
    this.#renderSort();
    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    if (this.filmCards.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilmCards(filmCards.slice(0, Math.min(filmCardsCount, this.#renderedFilmCardsCount)), this.comments);

    if (this.filmCards.length > this.#renderedFilmCardsCount) {
      this.#renderShowMoreButton();
    }
  };

  #clearFilmList = ({ resetRenderedFilmCardsCount = false, resetSortType = false } = {}) => {
    const filmCardsCount = this.filmCards.length;
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    remove(this.#filterFilmsComponent);
    remove(this.#sortFilterComponent);
    remove(this.#noFilmCardsComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmCardsCount) {
      this.#renderedFilmCardsCount = FILMS_IN_LIST_COUNT;
    } else {
      this.#renderedFilmCardsCount = Math.min(filmCardsCount, this.#renderedFilmCardsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

}
