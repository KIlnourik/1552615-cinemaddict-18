
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
// import FilmTopRatedListView from '../view/film-top-rated-view.js';
// import FilmMostCommentedView from '../view/film-most-commented-view.js';
import FilmsFiltersView from '../view/films-filters-view.js';
import SortFiltersView from '../view/sort-filters-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmsView from '../view/no-films-view.js';

import { FILMS_IN_LIST_COUNT, SortType } from '../const.js';
import { render, remove } from '../framework/render.js';

import { generateFilter } from '../mock/filter.js';
import { commentFilter, updateFilmCard, sortByDate, sortByRating } from '../utils/common.js';
import FilmCardPresenter from './film-card-presenter.js';

export default class FilmPresenter {
  #filmsContainer = new FilmsView();
  #filmsList = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #mainContainer = null;
  #filmCardsModel = null;
  #commentModel = null;
  #filmCards = [];
  #renderedFilmCardsCount = FILMS_IN_LIST_COUNT;

  #filter = null;
  #filmComments = [];

  #filterFilmsComponent = null;
  #sortFilterComponent = new SortFiltersView();

  #filmCardPresenter = new Map();

  #currentSortType = SortType.DEFAULT;
  #sourcedFilmCards = [];

  constructor(mainContainer, filmCardsModel, commentModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#commentModel = commentModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmCardsModel.filmCards];
    this.#filter = generateFilter(this.#filmCards);
    this.#filmComments = [...this.#commentModel.comments];

    this.#sourcedFilmCards = [...this.#filmCardsModel.filmCards];
    this.#filterFilmsComponent = new FilmsFiltersView(this.#filter);

    this.#renderFilmList();
  };

  #filmCardChangeHandler = (updatedFilmCard) => {
    this.#filmCards = updateFilmCard(this.#filmCards, updatedFilmCard);
    this.#sourcedFilmCards = updateFilmCard(this.#sourcedFilmCards, updatedFilmCard);
    this.#filmCardPresenter.get(updatedFilmCard.id).init(updatedFilmCard, commentFilter(updatedFilmCard, this.#filmComments));
  };

  #showMoreButtonClickHandler = () => {
    this.#filmCards
      .slice(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + FILMS_IN_LIST_COUNT)
      .forEach((filmCard) => this.#renderFilms(filmCard, commentFilter(filmCard, this.#filmComments), this.#filmsListContainer.element));

    this.#renderedFilmCardsCount += FILMS_IN_LIST_COUNT;

    if (this.#renderedFilmCardsCount >= this.#filmCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #sortFilmCards = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#filmCards.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#filmCards.sort(sortByRating);
        break;
      default:
        this.#filmCards = [...this.#sourcedFilmCards];
    }
    this.#currentSortType = sortType;
  };

  #sortFilterTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortFilmCards(sortType);
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

    for (let i = 0; i < Math.min(this.#filmCards.length, FILMS_IN_LIST_COUNT); i++) {
      this.#renderFilms(this.#filmCards[i], this.#filmComments, this.#filmsListContainer.element);
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

    if (this.#filmCards.length === 0) {
      this.#renderNoFilms();
    } else {
      this.#renderFilmCards();
    }

    if (this.#filmCards.length > FILMS_IN_LIST_COUNT) {
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
    const filmCardPresenter = new FilmCardPresenter(container, this.#filmCardChangeHandler);
    filmCardPresenter.init(filmCard, commentFilter(filmCard, filmComments));
    this.#filmCardPresenter.set(filmCard.id, filmCardPresenter);
  };
}
