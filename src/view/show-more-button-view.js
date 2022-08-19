import {createElement} from '../render.js';

const createShowMoreButtonView = () => `
<button class="films-list__show-more">Show more</button>
`;

export default class ShowMoreButtonView {
  getTemplate () {
    return createShowMoreButtonView ();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

