import AbstractView from '../framework/view/abstract-view.js';
import { USER_RATING_RANGE } from '../const.js';
import { watchedFilmsFilter } from '../utils/common.js';


const getUserRating = (filmCards) => {
  let userRating = '';
  const watchedFilmsCount = watchedFilmsFilter(filmCards);

  for (const rating in USER_RATING_RANGE) {
    if (USER_RATING_RANGE[rating] <= watchedFilmsCount) {
      userRating = rating;
    } else if (USER_RATING_RANGE[rating][0] <= watchedFilmsCount && watchedFilmsCount <= USER_RATING_RANGE[rating][1]) {
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
