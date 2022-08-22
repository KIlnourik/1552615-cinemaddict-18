import {createElement} from '../render.js';

const createCommentDeleteButtonView = () => `
<button class="film-details__comment-delete">Delete</button>
`;

export default class CommentDeleteButtonView {
  getTemplate () {
    return createCommentDeleteButtonView ();
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
