
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmTopRatedListView from '../view/film-top-rated-view.js';
import FilmMostCommentedView from '../view/film-most-commented-view.js';
import NavView from '../view/nav-view.js';
import FiltersView from '../view/filters-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import FilmPopupView from '../view/film-popup-view.js';
import NoFilmsView from '../view/no-films-view.js';

import { TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT, FILMS_IN_LIST_COUNT } from '../const.js';
import { render } from '../render.js';


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
  #filmCards = [];
  #renderedFilmCardsCount = FILMS_IN_LIST_COUNT;

  constructor(mainContainer, filmCardsModel) {
    this.#mainContainer = mainContainer;
    this.#filmCardsModel = filmCardsModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmCardsModel.filmCards];

    render(new NavView(), this.#mainContainer);
    render(new FiltersView(), this.#mainContainer);
    render(this.#filmsContainer, this.#mainContainer);

    if (this.#filmCards.length === 0) {
      render(new NoFilmsView(), this.#filmsContainer.element);
    } else {
      render(this.#filmsList, this.#filmsContainer.element);
      render(this.#filmsListContainer, this.#filmsList.element);

      for (let i = 0; i < Math.min(this.#filmCards.length, FILMS_IN_LIST_COUNT); i++) {
        this.#renderFilms(this.#filmCards[i]);
      }

      render(this.#topRatedList, this.#filmsContainer.element);
      render(this.#topRatedListContainer, this.#topRatedList.element);
      for (let i = 0; i < TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT; i++) {
        render(new FilmCardView(this.#filmCards[i]), this.#topRatedListContainer.element);
      }

      render(this.#mostCommentedList, this.#filmsContainer.element);
      render(this.#mostCommentedListContainer, this.#mostCommentedList.element);
      for (let i = 0; i < TOP_RATED_AND_MOST_COMMENTED_FILM_COUNT; i++) {
        render(new FilmCardView(this.#filmCards[i]), this.#mostCommentedListContainer.element);
      }

    }

    if (this.#filmCards.length > FILMS_IN_LIST_COUNT) {
      render(this.#showMoreButtonComponent, this.#filmsList.element);
      this.#showMoreButtonComponent.element.addEventListener('click', this.#handlerShowMoreButtonClick);
    }
  };

  #handlerShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#filmCards
      .slice(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + FILMS_IN_LIST_COUNT)
      .forEach((filmCard) => this.#renderFilms(filmCard));

    this.#renderedFilmCardsCount += FILMS_IN_LIST_COUNT;

    if (this.#renderedFilmCardsCount >= this.#filmCards.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #renderFilms = (filmCard) => {
    const body = document.body;
    const filmCardComponent = new FilmCardView(filmCard);
    const filmPopup = new FilmPopupView(filmCard);

    const showPopup = () => {
      body.appendChild(filmPopup.element);
      body.classList.add('hide-overflow');
    };

    const closePopup = () => {
      body.removeChild(filmPopup.element);
      body.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      showPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    filmPopup.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();

    });

    render(filmCardComponent, this.#filmsListContainer.element);
  };

}
