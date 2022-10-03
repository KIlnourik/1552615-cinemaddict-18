import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import SortFiltersView from '../view/sort-filters-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmsView from '../view/no-films-view.js';
import FilterPresenter from './filter-presenter.js';
import FilmCardPresenter from './film-card-presenter.js';
import LoadingView from '../view/loading-view.js';
import UserRankView from '../view/user-rank-view.js';
import StatisticView from '../view/statistic-view.js';

import { FILMS_IN_LIST_COUNT, SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import { sortByDate, sortByRating, filter } from '../utils/common.js';

const siteHeader = document.querySelector('.header');
const siteFooterStatistic = document.querySelector('.footer__statistics');

export default class FilmPresenter {
  #filmsContainer = new FilmsView();
  #filmsList = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #showMoreButtonComponent = null;
  #noFilmCardsComponent = null;
  #mainContainer = null;
  #filmCardsModel = null;
  #commentModel = null;
  #renderedFilmCardsCount = FILMS_IN_LIST_COUNT;
  #sortFilterComponent = null;
  #filmCardPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterModel = null;
  #filterComponent = null;
  #loadingComponent = new LoadingView();
  #filterType = FilterType.All;
  #isLoading = true;
  #statisticComponent = null;
  #userRankComponent = null;

  constructor(mainContainer, filmCardsModel, commentModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;
    this.#filmCardsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filmCards() {
    this.#filterType = this.#filterModel.filters;
    const filmCards = this.#filmCardsModel.filmCards;
    const filteredFilmCards = filter[this.#filterType](filmCards);
    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilmCards.sort(sortByDate);
      case SortType.RATING:
        return filteredFilmCards.sort(sortByRating);
    }
    return filteredFilmCards;
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
        this.#filmCardPresenter.get(filmCard.id).init(filmCard, this.#commentModel);
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmList();
        break;
      case UpdateType.MAJOR:
        this.#clearFilmList({ resetRenderedFilmCardsCount: true, resetSortType: true });
        this.#renderFilmList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

  #renderUserRank = () => {
    const prevUserRankComponent = this.#userRankComponent;

    this.#userRankComponent = new UserRankView(this.#filmCardsModel.filmCards);

    if (prevUserRankComponent === null) {
      render(this.#userRankComponent, siteHeader);
      return;
    }

    replace(this.#userRankComponent, prevUserRankComponent);
    remove(prevUserRankComponent);
  };

  #renderStatistic = () => {
    const prevStatisticComponent = this.#statisticComponent;

    this.#statisticComponent = new StatisticView(this.#filmCardsModel.filmCards);

    if (prevStatisticComponent === null) {
      render(this.#statisticComponent, siteFooterStatistic);
      return;
    }

    replace(this.#statisticComponent, prevStatisticComponent);
    remove(prevStatisticComponent);
  };

  #renderSort = () => {
    this.#sortFilterComponent = new SortFiltersView(this.#currentSortType);
    this.#sortFilterComponent.setSortTypeChangeHandler(this.#sortFilterTypeChangeHandler);
    render(this.#sortFilterComponent, this.#mainContainer);
  };

  #renderNoFilms = () => {
    this.#noFilmCardsComponent = new NoFilmsView(this.#filterType);
    render(this.#noFilmCardsComponent, this.#filmsContainer.element);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsList.element, RenderPosition.AFTERBEGIN);
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
    console.log(this.#commentModel.loadComments(1));
    const filmCards = this.filmCards;
    const filmCardsCount = filmCards.length;
    this.#renderUserRank();
    this.#filterComponent = new FilterPresenter(this.#mainContainer, this.#filterModel, this.#filmCardsModel);
    this.#filterComponent.init();
    if (this.#isLoading) {
      this.#renderLoading();
    }

    this.#renderSort();
    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    if (this.filmCards.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilmCards(filmCards.slice(0, Math.min(filmCardsCount, this.#renderedFilmCardsCount)), this.#commentModel);

    if (this.filmCards.length > this.#renderedFilmCardsCount) {
      this.#renderShowMoreButton();
    }

    this.#renderStatistic();
  };

  #clearFilmList = ({ resetRenderedFilmCardsCount = false, resetSortType = false } = {}) => {
    const filmCardsCount = this.filmCards.length;
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#filterComponent.remove();
    remove(this.#sortFilterComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#loadingComponent);

    if (resetRenderedFilmCardsCount) {
      this.#renderedFilmCardsCount = FILMS_IN_LIST_COUNT;
    } else {
      this.#renderedFilmCardsCount = Math.min(filmCardsCount, this.#renderedFilmCardsCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (this.#noFilmCardsComponent) {
      remove(this.#noFilmCardsComponent);
    }
  };

}
