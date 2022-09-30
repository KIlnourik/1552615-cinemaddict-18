
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmsFiltersView from '../view/films-filters-view.js';
import SortFiltersView from '../view/sort-filters-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmsView from '../view/no-films-view.js';

import { FILMS_IN_LIST_COUNT, SortType } from '../const.js';
import { render, remove } from '../framework/render.js';

import { generateFilter } from '../mock/filter.js';
import { commentFilter, sortByDate, sortByRating, UpdateType, UserAction } from '../utils/common.js';
import FilmCardPresenter from './film-card-presenter.js';

export default class FilmPresenter {
  #filmsContainer = new FilmsView();
  #filmsList = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #mainContainer = null;
  #filmCardsModel = null;
  #commentModel = null;
  #renderedFilmCardsCount = FILMS_IN_LIST_COUNT;

  #filter = null;

  #filterFilmsComponent = null;
  #sortFilterComponent = new SortFiltersView();

  #filmCardPresenter = new Map();

  #currentSortType = SortType.DEFAULT;

  constructor(mainContainer, filmCardsModel, commentModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#commentModel = commentModel;
    this.#filmCardsModel.addObserver(this.#modelEventHandler);
    this.#commentModel.addObserver(this.#modelEventHandler);
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

  get comments () {
    return this.#commentModel.comments;
  }

  init = () => {
    this.#filter = generateFilter(this.#filmCardsModel.filmCards);
    this.#filterFilmsComponent = new FilmsFiltersView(this.#filter);

    this.#renderFilmList();
  };

  #viewActionHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE:
        this.#filmCardsModel.update(updateType, update);
        break;
      case UserAction.ADD:
        this.#filmCardsModel.add(updateType, update);
        break;
      case UserAction.DELETE:
        this.#filmCardsModel.delete(updateType, update);
        break;
    }
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmCardPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        break;
    }
  };


  #showMoreButtonClickHandler = () => {
    const filmCardsCount = this.filmCards.length;
    this.filmCards
      .slice(filmCardsCount, this.#renderedFilmCardsCount + FILMS_IN_LIST_COUNT)
      .forEach((filmCard) => this.#renderFilms(filmCard, commentFilter(filmCard, this.comments), this.#filmsListContainer.element));

    this.#renderedFilmCardsCount += FILMS_IN_LIST_COUNT;

    if (this.#renderedFilmCardsCount >= filmCardsCount) {
      remove(this.#showMoreButtonComponent);
    }
  };


  #sortFilterTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearFilmList();
    this.#renderFilmList();
  };

  #renderFilters = () => {
    render(this.#filterFilmsComponent, this.#mainContainer);
  };

  #renderSort = () => {
    render(this.#sortFilterComponent, this.#mainContainer);
    this.#sortFilterComponent.setSortTypeChangeHandler(this.#sortFilterTypeChangeHandler);
  };

  #renderNoFilms = () => {
    render(new NoFilmsView(), this.#filmsContainer.element);
  };

  #renderFilmCards = () => {
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    for (let i = 0; i < Math.min(this.filmCards.length, FILMS_IN_LIST_COUNT); i++) {
      this.#renderFilms(this.filmCards[i], this.comments, this.#filmsListContainer.element);
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsList.element);
    this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);
  };

  #renderFilmList = () => {

    this.#renderFilters();
    this.#renderSort();
    render(this.#filmsContainer, this.#mainContainer);

    if (this.filmCards.length === 0) {
      this.#renderNoFilms();
    } else {
      this.#renderFilmCards();
    }

    if (this.filmCards.length > FILMS_IN_LIST_COUNT) {
      this.#renderShowMoreButton();
    }
  };

  #clearFilmList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#renderedFilmCardsCount = FILMS_IN_LIST_COUNT;
    remove(this.#showMoreButtonComponent);
  };

  #renderFilms = (filmCard, filmComments, container) => {
    const filmCardPresenter = new FilmCardPresenter(container, this.#viewActionHandler);
    filmCardPresenter.init(filmCard, commentFilter(filmCard, filmComments));
    this.#filmCardPresenter.set(filmCard.id, filmCardPresenter);
  };
}
