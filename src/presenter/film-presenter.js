
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmTopRatedListView from '../view/film-top-rated-view.js';
import FilmMostCommentedView from '../view/film-most-commented-view.js';
import FilmsFiltersView from '../view/films-filters-view.js';
import SortFiltersView from '../view/sort-filters-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import NoFilmsView from '../view/no-films-view.js';

import { TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT, FILMS_IN_LIST_COUNT } from '../const.js';
import { render, remove } from '../framework/render.js';

import { generateFilter } from '../mock/filter.js';
import { commentFilter } from '../utils/common.js';
import FilmCardPresenter from './film-card-presenter.js';

export default class FilmPresenter {
  #filmsContainer = new FilmsView();
  #filmsList = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #topRatedList = new FilmTopRatedListView();
  #topRatedListContainer = new FilmListContainerView();
  #mostCommentedList = new FilmMostCommentedView();
  #mostCommentedListContainer = new FilmListContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #mainContainer = null;
  #filmCardsModel = null;
  #commentModel = null;
  #filmCards = [];
  #renderedFilmCardsCount = FILMS_IN_LIST_COUNT;

  #filter = null;
  #filmComments = [];

  #sortFilterComponent = new SortFiltersView();


  constructor(mainContainer, filmCardsModel, commentModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#commentModel = commentModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmCardsModel.filmCards];
    this.#filter = generateFilter(this.#filmCards);
    this.#filmComments = [...this.#commentModel.comments];

    this.#renderFilmList();
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

    this.#renderTopRatedFilms();
    this.#renderMostCommentedList();
  };

  #renderFilters = () => {
    const filterFilmsComponent = new FilmsFiltersView(this.#filter);
    render(filterFilmsComponent, this.#mainContainer);
  };

  #renderSort = () => {
    render(this.#sortFilterComponent, this.#mainContainer);
  };

  #renderNoFilms = () => {
    render(new NoFilmsView(), this.#filmsContainer.element);
  };

  #renderFilmCards = () => {
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    for (let i = 0; i < Math.min(this.#filmCards.length, FILMS_IN_LIST_COUNT); i++) {
      this.#renderFilms(this.#filmCards[i], commentFilter(this.#filmCards[i], this.#filmComments));
    }
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsList.element);
    this.#showMoreButtonComponent.setClickHandler(this.#showMoreButtonClickHandler);
  };

  #renderTopRatedFilms = () => {
    render(this.#topRatedList, this.#filmsContainer.element);
    render(this.#topRatedListContainer, this.#topRatedList.element);
    for (let i = 0; i < TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT; i++) {
      render(new FilmCardView(this.#filmCards[i]), this.#topRatedListContainer.element);
    }
  };

  #renderMostCommentedList = () => {
    render(this.#mostCommentedList, this.#filmsContainer.element);
    render(this.#mostCommentedListContainer, this.#mostCommentedList.element);
    for (let i = 0; i < TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT; i++) {
      render(new FilmCardView(this.#filmCards[i]), this.#mostCommentedListContainer.element);
    }
  };

  #showMoreButtonClickHandler = () => {
    this.#filmCards
      .slice(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + FILMS_IN_LIST_COUNT)
      .forEach((filmCard) => this.#renderFilms(filmCard, commentFilter(filmCard, this.#filmComments)));

    this.#renderedFilmCardsCount += FILMS_IN_LIST_COUNT;

    if (this.#renderedFilmCardsCount >= this.#filmCards.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #renderFilms = (filmCard, filmComments) => {
    const filmCardPresenter = new FilmCardPresenter(this.#filmsListContainer.element);
    filmCardPresenter.init(filmCard, filmComments);
  };

}
