import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmCardModel extends Observable {
  #filmsApiService = null;
  #filmCards = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async () => {
    try {
      const filmCards = await this.#filmsApiService.get();
      this.#filmCards = filmCards.map(this.#adaptToClient);
    } catch {
      this.#filmCards = [];
    }
    this._notify(UpdateType.INIT);
  };

  get filmCards() {
    return this.#filmCards;
  }

  updateFilmCard = async (updateType, update) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting filmcard');
    }

    try {
      // console.log("FC", update);
      const response = await this.#filmsApiService.updateFilmCard(update);
      // console.log("responce", response);
      const updatedFilmCard = this.#adaptToClient(response);
      // console.log("FCU", updatedFilmCard);
      this.#filmCards = [
        ...this.#filmCards.slice(0, index),
        updatedFilmCard,
        ...this.#filmCards.slice(index + 1),
      ];
      // console.log("карточки", this.#filmCards);
      this._notify(updateType, update);
      // console.log('sdkjfhaksjdhfkj');
    } catch (err) {
      // this.#filmCards.forEach((card) => console.log(card.id, card.comments));
      throw new Error(err);
      // throw new Error('Can\'t update filmcard');
    }
  };

  #adaptToClient = (filmCard) => {

    const {
      id,
      comments,
      film_info: {
        title,
        alternative_title: alternativeTitle,
        total_rating: totalRating,
        poster,
        age_rating: ageRating,
        director,
        writers,
        actors,
        release: {
          date,
          release_country: releaseCountry,
        },
        runtime,
        genre,
        description,
      },
      user_details: {
        watchlist,
        already_watched: alreadyWatched,
        watching_date: watchingDate,
        favorite,
      },
    } = filmCard;

    return {
      id,
      comments,
      filmInfo: {
        title,
        alternativeTitle,
        totalRating,
        poster,
        ageRating,
        director,
        writers,
        actors,
        release: {
          date,
          releaseCountry,
        },
        runtime,
        genre,
        description,
      },
      userDetails: {
        watchlist,
        alreadyWatched,
        watchingDate,
        favorite,
      },
    };
  };

}
