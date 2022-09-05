import UserRankView from './view/user-rank-view.js';
import StatisticView from './view/statistic-view.js';
import { render } from './framework/render.js';
import FilmPresenter from './presenter/film-presenter.js';
import FilmCardModel from './model/film-card-model.js';

const siteHeader = document.querySelector('.header');
const siteFooterStatistic = document.querySelector('.footer__statistics');
const siteMainElement = document.querySelector('.main');

const filmCardsModel = new FilmCardModel();
const filmPresenter = new FilmPresenter(siteMainElement, filmCardsModel);

render(new UserRankView(), siteHeader);

filmPresenter.init();

render(new StatisticView(), siteFooterStatistic);
