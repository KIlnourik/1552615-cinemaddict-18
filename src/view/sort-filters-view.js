import AbstractView from '../framework/view/abstract-view.js';
import { SortType, CLASSES } from '../const.js';

const createSortFiltersView = () => `
<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`;

export default class SortFiltersView extends AbstractView {

  get template() {
    return createSortFiltersView();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    this.element.querySelectorAll(CLASSES.SORT_BUTTON).forEach((el) => el.classList.remove(CLASSES.ACTIVE_SORT_BUTTON));
    evt.target.classList.add(CLASSES.ACTIVE_SORT_BUTTON);
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

}
