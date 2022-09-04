import AbstractView from '../framework/view/abstract-view.js';

const createCommentDeleteButtonView = () => `
<button class="film-details__comment-delete">Delete</button>
`;

export default class CommentDeleteButtonView extends AbstractView{

  get template () {
    return createCommentDeleteButtonView ();
  }
}
