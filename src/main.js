import UserRankView from './view/user-rank-view.js';
import StatisticView from './view/statistic-view.js';
import { render } from './render.js';
import FilmPresenter from './presenter/film-presenter.js';

const siteHeader = document.querySelector('.header');
const siteFooterStatistic = document.querySelector('.footer__statistics');
const siteMainElement = document.querySelector('.main');
const filmPresenter = new FilmPresenter();

render(new UserRankView(), siteHeader);

filmPresenter.init(siteMainElement);

render(new StatisticView(), siteFooterStatistic);
