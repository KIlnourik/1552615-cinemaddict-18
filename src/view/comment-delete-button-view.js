import {createElement} from '../render.js';

const createCommentDeleteButtonView = () => `
<button class="film-details__comment-delete">Delete</button>
`;

export default class CommentDeleteButtonView {
  #element = null;

  get template () {
    return createCommentDeleteButtonView ();
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
