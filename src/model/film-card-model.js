import Observable from '../framework/observable.js';

export default class FilmCardModel extends Observable {
  #filmsApiService = null;
  #filmCards = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get filmCards() {
    return this.#filmCards;
  }

  set filmCards(filmCards) {
    this.#filmCards = filmCards;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.filmCards;
      this.#filmCards = films.map(this.#adaptToClient);
    } catch (err) {
      this.#filmCards = [];
    }
  };

  updateFilmCard = (updateType, update) => {
    const index = this.#filmCards.findIndex((filmCard) => filmCard.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting filmcard');
    }

    this.#filmCards = [
      ...this.#filmCards.slice(0, index),
      update,
      ...this.#filmCards.slice(index + 1),
    ];

    this._notify(updateType, update);
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
