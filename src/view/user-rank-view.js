import AbstractView from '../framework/view/abstract-view.js';
import { UserRatings } from '../const.js';
import { watchedFilmsFilter } from '../utils/common.js';


const getUserRating = (filmCards) => {
  const watchedFilmsCount = watchedFilmsFilter(filmCards);

  for (const rating in UserRatings) {
    if ((UserRatings[rating].min <= watchedFilmsCount && watchedFilmsCount <= UserRatings[rating].max) || (UserRatings[rating].min <= watchedFilmsCount && UserRatings[rating].max === null) || (UserRatings[rating].min === null && watchedFilmsCount <= UserRatings[rating].max)) {
      return UserRatings[rating].rating;
    }
  }
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
