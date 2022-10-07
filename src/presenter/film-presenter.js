import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import SortFiltersView from '../view/sort-filters-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmsView from '../view/no-films-view.js';
import LoadingView from '../view/loading-view.js';
import FilmCardPresenter from './film-card-presenter.js';
import FilmPopupPresenter from './film-popup-presenter.js';
import UserRankView from '../view/user-rank-view.js';
import StatisticView from '../view/statistic-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import { FILMS_IN_LIST_COUNT, SortType, UpdateType, UserAction, FilterType, TimeLimit } from '../const.js';
import { render, remove, replace } from '../framework/render.js';
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
  #commentsModel = null;
  #renderedFilmCardsCount = FILMS_IN_LIST_COUNT;
  #sortFilterComponent = null;
  #filmCardPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterModel = null;
  #filterComponent = null;
  #filterType = FilterType.All;
  #isLoading = true;
  #loadingComponent = null;
  #statisticComponent = null;
  #userRankComponent = null;
  #filmPopupPresenter = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(mainContainer, filmCardsModel, commentsModel, filterModel, filterPresenter) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;
    this.#filmCardsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#filterComponent = filterPresenter;
    this.#filmPopupPresenter = new FilmPopupPresenter(this.#filmCardsModel, this.#commentsModel);
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

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_FILMCARD:
        try {
          await this.#filmCardsModel.updateFilmCard(updateType, update);
        } catch (err) {
          this.#filmCardPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          this.#commentsModel.add(updateType, update.comment, update.filmCard);
          this.#filmCardsModel.updateFilmCard(updateType, update.filmCard);
        } catch (err) {
          this.#filmCardPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmCardPresenter.get(update.filmCard.id).setDeleting();
        try {
          await this.#commentsModel.delete(updateType, update.commentId);
          this.#filmCardsModel.updateFilmCard(updateType, update.filmCard);
        } catch (err) {
          this.#filmCardPresenter.get(update.filmCard.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = async (updateType, filmCard) => {
    let comments;
    switch (updateType) {
      case UpdateType.PATCH:
        comments = await this.#commentsModel.get(filmCard.id);
        this.#filmCardPresenter.get(filmCard.id).init(filmCard, comments);
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
    this.#renderFilmCards(filmCards);

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
    render(this.#sortFilterComponent, this.#mainContainer);
    this.#sortFilterComponent.setSortTypeChangeHandler(this.#sortFilterTypeChangeHandler);
  };

  #renderNoFilms = () => {
    this.#noFilmCardsComponent = new NoFilmsView(this.#filterType);
    render(this.#noFilmCardsComponent, this.#filmsContainer.element);
  };

  #renderFilmCard = async (filmCard) => {
    const filmCardComponent = new FilmCardPresenter(this.#filmsListContainer.element, this.#viewActionHandler, this.#commentsModel, this.#filmPopupPresenter);
    filmCardComponent.init(filmCard);
    this.#filmCardPresenter.set(filmCard.id, filmCardComponent);
  };

  #renderFilmCards = (filmCards) => {
    filmCards.forEach((filmCard) => this.#renderFilmCard(filmCard));
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);
    render(this.#showMoreButtonComponent, this.#filmsList.element);
  };

  #renderFilmList = () => {
    const filmCards = this.filmCards;
    const filmCardsCount = filmCards.length;

    this.#renderUserRank();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderSort();
    render(this.#filmsContainer, this.#mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    if (this.filmCards.length === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilmCards(filmCards.slice(0, Math.min(filmCardsCount, this.#renderedFilmCardsCount)));

    if (this.filmCards.length > this.#renderedFilmCardsCount) {
      this.#renderShowMoreButton();
    }
    this.#renderStatistic();
  };

  #clearFilmList = ({ resetRenderedFilmCardsCount = false, resetSortType = false } = {}) => {
    const filmCardsCount = this.filmCards.length;
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
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

  #renderLoading = () => {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#filmsList.element);
  };
}
