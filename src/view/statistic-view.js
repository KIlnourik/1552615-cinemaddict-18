import AbstractView from '../framework/view/abstract-view.js';

const createStatisticTemplate = (filmCards) => `
<p>${filmCards.length} movies inside</p>
`;

export default class StatisticView extends AbstractView {
  #filmCards = [];

  constructor(filmCards) {
    super();
    this.#filmCards = filmCards;
  }

  get template () {
    return createStatisticTemplate (this.#filmCards);
  }
}
