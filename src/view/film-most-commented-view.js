import AbstractView from '../framework/view/abstract-view.js';

const createFilmMostCommentedListView = () => `
  <section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
  </section>
`;

export default class FilmMostCommentedListView extends AbstractView {

  get template () {
    return createFilmMostCommentedListView ();
  }
}
