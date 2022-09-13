import AbstractView from '../framework/view/abstract-view.js';
import { USER_RATING_RANGE } from '../const.js';


const getUserRating = (filmCards) => {
  let userRating = '';
  for (const rating in USER_RATING_RANGE) {
    if (USER_RATING_RANGE[rating] <= filmCards.length) {
      userRating = rating;
    } else if (USER_RATING_RANGE[rating][0] <= filmCards.length && filmCards.length <= USER_RATING_RANGE[rating][1]) {
      userRating = rating;
    }
  }
  return userRating;
};

const createUserRankView = (filmCards) => `<section class="header__profile profile">
  <p class="profile__rating">${getUserRating(filmCards)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></section>`;

export default class UserRankView extends AbstractView {
  #filmCards = [];

  constructor(filmCards) {
    super();
    this.#filmCards = filmCards;
  }

  get template() {
    return createUserRankView(this.#filmCards);
  }
}
