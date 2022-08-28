import {createElement} from '../render.js';

const createFilmsView = () => `
<section class="films"> </section>
`;

export default class FilmsView {
  #element = null;

  get template () {
    return createFilmsView ();
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

