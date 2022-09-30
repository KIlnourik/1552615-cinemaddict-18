import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TITLES_AND_POSTERS, Emojis } from '../const.js';
import { getPoster } from '../utils/mocks.js';
import { getRuntimeInHours, humanizeReleaseDate, humanizeCommentDate, setActiveClass, getRandomInt } from '../utils/common.js';

const isCheckedEmoji = (currentEmoji, emoji) => currentEmoji === emoji ? 'checked' : '';

const showSelectedEmoji = (selectedEmoji) => selectedEmoji ? `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-smile">` : '';

const showComment = (comment) => comment ? comment : '';

const createCommentsFormTemplate = (selectedEmoji, comment) => `
  <form class="film-details__new-comment" action="" method="get">
        <div class="film-details__add-emoji-label">${showSelectedEmoji(selectedEmoji)}</div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${showComment(comment)}</textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isCheckedEmoji(selectedEmoji, Emojis.SMILE)}>
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isCheckedEmoji(selectedEmoji, Emojis.SLEEPING)}>
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isCheckedEmoji(selectedEmoji, Emojis.PUKE)}>
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isCheckedEmoji(selectedEmoji, Emojis.ANGRY)}>
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </form>`;

const createCommentItemTemplate = (filmComment) => filmComment ?
  `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${filmComment.emotion}.png" width="55" height="55" alt="emoji-${filmComment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${filmComment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${filmComment.author}</span>
        <span class="film-details__comment-day">${humanizeCommentDate(filmComment.date)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>` : '';

const createCommentsTemplate = (commentsItems) => {
  const commentsItemsTemplate = commentsItems
    .map((commentItem) => createCommentItemTemplate(commentItem))
    .join('');
  return `<ul class="film-details__comments-list">
      ${commentsItemsTemplate}
    </ul>`;
};

const createFilmPopupView = (state) => {
  const {
    title,
    alternativeTitle,
    totalRating,
    ageRating,
    director,
    writers,
    actors,
    release,
    runtime,
    genre,
    description } = state.filmInfo;

  const { watchlist, alreadyWatched, favorite } = state.userDetails;

  const filmPoster = getPoster(title, TITLES_AND_POSTERS);

  const showGenres = (arr) => arr.map((el) => `<span class="film-details__genre">${el}</span>`).join(' ');

  return `
  <section class="film-details">
  <div class="film-details__inner">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./images/posters/${filmPoster}" alt="">
        <p class="film-details__age">${ageRating}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">Original: ${alternativeTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors.join(', ')}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${humanizeReleaseDate(release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${getRuntimeInHours(runtime)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${release.releaseCountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              ${showGenres(genre)}
              </td>
          </tr>
        </table>

        <p class="film-details__film-description">${description}</p>
      </div>
    </div>

    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${setActiveClass(watchlist, 'film-details__control-button--active')}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button  film-details__control-button--watched ${setActiveClass(alreadyWatched, 'film-details__control-button--active')}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${setActiveClass(favorite, 'film-details__control-button--active')}" id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>

  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${state.filmComments.length}</span></h3>

      ${createCommentsTemplate(state.filmComments)}

      ${createCommentsFormTemplate(state.emoji, state.comment)}
    </section>
  </div>
  </div>
  </section>`;
};


export default class FilmPopupView extends AbstractStatefulView {
  #filmCard = null;
  #filmComments = [];

  constructor(filmCard, filmComments) {
    super();
    this.#filmCard = filmCard;
    this.#filmComments = filmComments;
    this._state = FilmPopupView.parseFilmToState(this.#filmCard, this.#filmComments);

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmPopupView(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setClickHandler(this._callback.click);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAddCommentHandler(this._callback.addComment);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setMarkAsWatchedClickHandler = (callback) => {
    this._callback.markAsWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#markAsWatchedClickHandler);
  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
    this.element.addEventListener('keydown', this.#addCommentHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.film-details__comment-delete').addEventListener('click', this.#deleteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #markAsWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.markAsWatchedClick();
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #addCommentHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      const comment = this._state.comment;
      const emoji = this._state.emoji;

      const userComment = {
        id: getRandomInt(99, 99999999),
        author: 'Movie Buff',
        comment,
        date: new Date,
        emoji,
      };
      this._callback.addComment(userComment);
    }
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.matches('img')) {
      const inputId = evt.target.closest('label').getAttribute('for');
      const input = this.element.querySelector(`#${inputId}`);
      const inputValue = input.value;
      this.updateElement({
        emoji: inputValue,
      });
      this.element.comment = this._state.comment;
      this.element.scrollTop = this._state.scrollTop;
    }
  };

  #scrollHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      scrollTop: evt.target.scrollTop,
    });
  };

  #inputCommentHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      comment: evt.target.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.film-details__emoji-label').forEach((el) => el.addEventListener('click', this.#emojiClickHandler));
    this.element.addEventListener('scroll', this.#scrollHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#inputCommentHandler);
  };

  reset = (filmCard, filmComments) => {
    this.updateElement(
      FilmPopupView.parseFilmToState(filmCard, filmComments)
    );
  };

  static parseFilmToState = (filmCard, filmComments) => {
    const filmCardComments = [...filmComments];
    return {
      ...filmCard,
      filmComments: filmCardComments,
      emoji: null,
      scrollTop: 0,
      comment: null,
    };
  };

  static parseStateToFilm = (state) => {
    const filmCard = { ...state };

    delete filmCard.filmComments;
    delete filmCard.emoji;
    delete filmCard.scrollTop;
    delete filmCard.comment;

    return filmCard;
  };

}
