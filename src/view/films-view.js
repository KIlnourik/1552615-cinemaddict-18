import AbstractView from '../framework/view/abstract-view.js';

const createFilmsView = () => `
<section class="films"> </section>
`;

export default class FilmsView extends AbstractView{

  get template () {
    return createFilmsView ();
  }
}

