import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemsTemplate = (filter) => {
  const { name, count } = filter;
  const filterItemTemplates = (name === 'All movies')
    ? `<a href="#all" class="main-navigation__item main-navigation__item--active" data-filter-type="${name}">All movies</a>`
    : `<a href="#watchlist" class="main-navigation__item main-navigation__item--active" data-filter-type="${name}">${name} <span class="main-navigation__item-count">${count}</span></a>`;

  return filterItemTemplates;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemsTemplate(filter, filter.name === currentFilterType))
    .join('');
  return `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`;
};

export default class FilmsFiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    const filterType = evt.target.dataset.filterType;
    if (filterType !== this.#currentFilterType) {
      this._callback.filterTypeChange(filterType);
    }
  };
}
