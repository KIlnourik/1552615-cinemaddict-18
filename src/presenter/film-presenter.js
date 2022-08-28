
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmTopRatedListView from '../view/film-top-rated-view.js';
import FilmMostCommentedView from '../view/film-most-commented-view.js';
import NavView from '../view/nav-view.js';
import FiltersView from '../view/filters-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import { TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT } from '../const.js';
import {render} from '../render.js';


export default class FilmPresenter {
  #filmsContainer = new FilmsView();
  #filmsList = new FilmListView();
  #filmsListContainer = new FilmListContainerView();
  #topRatedList = new FilmTopRatedListView();
  #topRatedListContainer = new FilmListContainerView();
  #mostCommentedList = new FilmMostCommentedView();
  #mostCommentedListContainer = new FilmListContainerView();

  #filmCardsModel = null;

  init = (mainContainer, filmCardsModel) => {
    this.#filmCardsModel = filmCardsModel;
    this.filmCards = [...this.#filmCardsModel.filmCards];

    render(new NavView(), mainContainer);
    render(new FiltersView(), mainContainer);
    render(this.#filmsContainer, mainContainer);
    render(this.#filmsList, this.#filmsContainer.element);
    render(this.#filmsListContainer, this.#filmsList.element);

    for (let i = 0; i < this.filmCards.length; i++) {
      render(new FilmCardView(this.filmCards[i]), this.#filmsListContainer.element);
    }
    render(new ShowMoreButtonView(), this.#filmsList.element);

    render(this.#topRatedList, this.#filmsContainer.element);
    render(this.#topRatedListContainer, this.#topRatedList.element);
    for (let i = 0; i < TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT; i++) {
      render(new FilmCardView(this.filmCards[i]), this.#topRatedListContainer.element);
    }

    render(this.#mostCommentedList, this.#filmsContainer.element);
    render(this.#mostCommentedListContainer, this.#mostCommentedList.element);
    for (let i = 0; i < TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT; i++) {
      render(new FilmCardView(this.filmCards[i]), this.#mostCommentedListContainer.element);
    }

  };
}
