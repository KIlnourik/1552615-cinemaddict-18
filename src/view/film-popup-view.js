import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { Emojis, Classes } from '../const.js';
import { getRuntimeInHours, humanizeReleaseDate, humanizeCommentDate, setActiveClass, setShakeForElement } from '../utils/common.js';

const isCheckedEmoji = (currentEmotion, emotion) => currentEmotion === emotion ? 'checked' : '';

const showSelectedEmoji = (selectedEmotion) => selectedEmotion ? `<img src="images/emoji/${selectedEmotion}.png" width="55" height="55" alt="emoji-${selectedEmotion}">` : '';

const showComment = (comment) => comment ? comment : '';

const createCommentsFormTemplate = (selectedEmotion, comment) => `
  <form class="film-details__new-comment" action="" method="get">
    <div class="film-details__add-emoji-label">${showSelectedEmoji(selectedEmotion)}</div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${showComment(comment)}</textarea>
    </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isCheckedEmoji(selectedEmotion, Emojis.SMILE)}>
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isCheckedEmoji(selectedEmotion, Emojis.SLEEPING)}>
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isCheckedEmoji(selectedEmotion, Emojis.PUKE)}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isCheckedEmoji(selectedEmotion, Emojis.ANGRY)}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
      </label>
    </div>
  </form>`;

const createCommentItemTemplate = (filmComment, deletingCommentId) => filmComment ?
  `
  <li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${filmComment.emotion}.png" width="55" height="55" alt="emoji-${filmComment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(filmComment.comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${filmComment.author}</span>
        <span class="film-details__comment-day">${humanizeCommentDate(filmComment.date)}</span>
        <button class="film-details__comment-delete" data-id="${filmComment.id}">${deletingCommentId === filmComment.id ? 'Deleting...' : 'Delete'}</button>
      </p>
    </div>
  </li>` : '';

const createCommentsTemplate = (commentsItems, isDeleting) => {
  const commentsItemsTemplate = commentsItems
    .map((commentItem) => createCommentItemTemplate(commentItem, isDeleting))
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
    poster,
    description } = state.filmInfo;

  const { watchlist, alreadyWatched, favorite } = state.userDetails;

  const showGenres = (genres) => genres.map((el) => `<span class="film-details__genre">${el}</span>`).join(' ');

  return `
  <section class="film-details">
  <div class="film-details__inner">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${poster}" alt="">
        <p class="film-details__age">${ageRating}+</p>
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

      ${createCommentsTemplate(state.filmComments, state.deletingCommentId)}

      ${createCommentsFormTemplate(state.emotion, state.comment)}
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
    this.setScrollPosition();
    this.setClickHandler(this._callback.click);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setMarkAsWatchedClickHandler(this._callback.markAsWatchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setAddCommentHandler(this._callback.addComment);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
  };

  setMarkAsWatchedClickHandler = (callback) => {
    this._callback.markAsWatchedClick = callback;

  };

  setAddCommentHandler = (callback) => {
    this._callback.addComment = callback;
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
  };

  setScrollPosition = () => {
    this.element.scrollTop = this._state.scrollTop;
  };

  shakePopupButton = () => {
    setShakeForElement(Classes.POPUP_BTN_CLASS);
  };

  shakePopupInput = (callback) => {
    setShakeForElement(Classes.POPUP_FORM_INPUT_CLASS, callback);
  };

  shakeDeletingComment = (callback) => {
    setShakeForElement(Classes.POPUP_COMMENTS_CLASS, callback);
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

  #commentAddHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();
      const comment = this._state.comment;
      const emotion = this._state.emotion;

      const userComment = {
        id: 'id',
        comment,
        emotion,
      };
      this._callback.addComment(userComment);
    }
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(evt.target.dataset.id);
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.matches('img')) {
      const inputId = evt.target.closest('label').getAttribute('for');
      const input = this.element.querySelector(`#${inputId}`);
      const inputValue = input.value;
      this.updateElement({
        emotion: inputValue,
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
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#markAsWatchedClickHandler);
    this.element.querySelectorAll('.film-details__emoji-label').forEach((el) => el.addEventListener('click', this.#emojiClickHandler));
    this.element.addEventListener('scroll', this.#scrollHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#inputCommentHandler);
    document.addEventListener('keydown', this.#commentAddHandler);
    this.element.querySelectorAll('.film-details__comment-delete').forEach((deleteBtn) => deleteBtn.addEventListener('click', this.#deleteClickHandler));
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
      emotion: null,
      scrollTop: 0,
      comment: null,
      deletingCommentId: null,
    };
  };

  static parseStateToFilm = (state) => {
    const filmCard = { ...state };
    delete filmCard.filmComments;
    delete filmCard.emotion;
    delete filmCard.scrollTop;
    delete filmCard.comment;
    delete filmCard.deletingCommentId;

    return filmCard;
  };

}
