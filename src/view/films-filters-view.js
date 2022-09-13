import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemsTemplate = (filter) => {
  const { name, count } = filter;
  const filterItemTemplates = (name === 'All movies')
    ? '<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>'
    : `<a href="#watchlist" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;

  return filterItemTemplates;
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemsTemplate(filter))
    .join('');
  return `<nav class="main-navigation">
      ${filterItemsTemplate}
    </nav>`;
};

export default class FilmsFiltersView extends AbstractView {
  #filmCards = [];

  constructor(filmCards) {
    super();
    this.#filmCards = filmCards;
  }

  get template() {
    return createFilterTemplate(this.#filmCards);
  }
}
