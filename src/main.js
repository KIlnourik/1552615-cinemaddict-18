import UserRankView from './view/user-rank-view.js';
import StatisticView from './view/statistic-view.js';
import { render } from './framework/render.js';
import FilmPresenter from './presenter/film-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import CommentModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';

import { END_POINT, AUTHORIZATION } from './const.js';

const siteHeader = document.querySelector('.header');
const siteFooterStatistic = document.querySelector('.footer__statistics');
const siteMainElement = document.querySelector('.main');

const filmCardsModel = new FilmCardModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filmCards = [...filmCardsModel.filmCards];
const commentModel = new CommentModel();
const filterModel = new FilterModel();

const filmPresenter = new FilmPresenter(siteMainElement, filmCardsModel, commentModel, filterModel);

render(new UserRankView(filmCards), siteHeader);

filmPresenter.init();

render(new StatisticView(filmCards), siteFooterStatistic);
