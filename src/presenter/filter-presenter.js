import {render, remove, replace} from '../framework/render.js';
import FilmsFiltersView from '../view/film-card-view';
import {filter} from '../utils/common.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterModel = null;
  #filmCardsModel = null;
  #filterContainer = null;
  #filterComponent = null;

  constructor(filterModel, filmCardsModel, filterContainer) {
    this.#filterModel = filterModel;
    this.#filmCardsModel = filmCardsModel;
    this.#filterContainer = filterContainer;
  }

  get filters() {
    const filmCards = this.#filmCardsModel.filmCards;
    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](filmCards),
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](filmCards).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](filmCards).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](filmCards).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilmsFiltersView(filters, this.#filterModel.filter);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #modelEventHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

