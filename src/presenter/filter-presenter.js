import {render, remove, replace, RenderPosition} from '../framework/render.js';
import FilmsFiltersView from '../view/films-filters-view.js';
import {filter} from '../utils/common.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterModel = null;
  #filmCardsModel = null;
  #filterContainer = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, filmCardsModel) {
    this.#filterModel = filterModel;
    this.#filmCardsModel = filmCardsModel;
    this.#filterContainer = filterContainer;

    this.#filmCardsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get filters() {
    const filmCards = this.#filmCardsModel.filmCards;
    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: filter[FilterType.ALL](filmCards).length,
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

    this.#filterComponent = new FilmsFiltersView(filters, this.#filterModel.filters);
    this.#filterComponent.setFilterTypeChangeHandler(this.#filterTypeChangeHandler);
    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this.#filterContainer.contains(prevFilterComponent.element)) {
      replace(this.#filterComponent, prevFilterComponent);
    }
    remove(prevFilterComponent);
  };

  remove = () => {
    remove(this.#filterComponent);
  };

  #modelEventHandler = () => {
    this.init();
  };

  #filterTypeChangeHandler = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilters(UpdateType.MAJOR, filterType);
  };
}

