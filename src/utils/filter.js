import { filter } from './common.js';

export const generateFilter = (filmCards) => Object.entries(filter).map(
  ([filterName, filterCards]) => ({
    name: filterName,
    count: filterCards(filmCards).length,
  }),
);
