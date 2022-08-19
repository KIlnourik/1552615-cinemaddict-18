
import FilmsView from '../view/films-view.js';
import FilmListView from '../view/film-list-view.js';
import FilmTopRatedListView from '../view/film-top-rated-view.js';
import FilmMostCommentedView from '../view/film-most-commented-view.js';
import NavView from '../view/nav-view.js';
import FiltersView from '../view/filters-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmListContainerView from '../view/film-list-container-view.js';
import {render} from '../render.js';

export default class FilmPresenter {
  filmsContainer = new FilmsView();
  filmsList = new FilmListView();
  filmsListContainer = new FilmListContainerView();
  topRatedList = new FilmTopRatedListView();
  topRatedListContainer = new FilmListContainerView();
  mostCommentedList = new FilmMostCommentedView();
  mostCommentedListContainer = new FilmListContainerView();

  init = (mainContainer) => {
    this.mainContainer = mainContainer;
    render(new NavView(), mainContainer);
    render(new FiltersView(), mainContainer);
    render(this.filmsContainer, this.mainContainer);
    render(this.filmsList, this.filmsContainer.getElement());
    render(this.filmsListContainer, this.filmsList.getElement());

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsListContainer.getElement());
    }
    render(new ShowMoreButtonView(), this.filmsList.getElement());

    render(this.topRatedList, this.filmsContainer.getElement());
    render(this.topRatedListContainer, this.topRatedList.getElement());
    for (let i = 0; i < 2; i++) {
      render(new FilmCardView(), this.topRatedListContainer.getElement());
    }

    render(this.mostCommentedList, this.filmsContainer.getElement());
    render(this.mostCommentedListContainer, this.mostCommentedList.getElement());
    for (let i = 0; i < 2; i++) {
      render(new FilmCardView(), this.mostCommentedListContainer.getElement());
    }

  };
}
