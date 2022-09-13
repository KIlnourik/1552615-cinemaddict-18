import UserRankView from './view/user-rank-view.js';
import StatisticView from './view/statistic-view.js';
import { render } from './framework/render.js';
import FilmPresenter from './presenter/film-presenter.js';
import FilmCardModel from './model/film-card-model.js';
import CommentModel from './model/comment-model.js';

const siteHeader = document.querySelector('.header');
const siteFooterStatistic = document.querySelector('.footer__statistics');
const siteMainElement = document.querySelector('.main');

const filmCardsModel = new FilmCardModel();
const filmCards = [...filmCardsModel.filmCards];
const commentModel = new CommentModel();

const filmPresenter = new FilmPresenter(siteMainElement, filmCardsModel, commentModel);

render(new UserRankView(filmCards), siteHeader);

filmPresenter.init();

render(new StatisticView(filmCards), siteFooterStatistic);
