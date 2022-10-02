import AbstractView from '../framework/view/abstract-view.js';
import { NoFilmsType } from '../const.js';

const createNoFilmsView = (filterType) => {
  const noFilmsTextValue = NoFilmsType[filterType];
  return `
    <section class="films-list">
      <h2 class="films-list__title">${noFilmsTextValue}</h2>
    </section>
  `;
};

export default class NoFilmsView extends AbstractView{
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return createNoFilmsView (this.#filterType);
  }
}
