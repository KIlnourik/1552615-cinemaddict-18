import FilmPresenter from './presenter/film-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import CommentModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';
import CommentsApiService from './comments-api-service.js';
import { END_POINT, AUTHORIZATION } from './const.js';

const siteMainElement = document.querySelector('.main');

const filterModel = new FilterModel();
const filmCardsModel = new FilmCardModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentModel = new CommentModel(new CommentsApiService(END_POINT, AUTHORIZATION));

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmCardsModel);
const filmPresenter = new FilmPresenter(siteMainElement, filmCardsModel, commentModel, filterModel);

filmCardsModel.init();
filmPresenter.init();
filterPresenter.init();
