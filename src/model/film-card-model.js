import Observable from '../framework/observable.js';
import { generateFilmCard } from '../mock/film.js';

export default class FilmCardModel extends Observable {
  #filmsApiSrevice = null;
  #filmCards = Array.from({ length: 25 }, generateFilmCard);

  constructor(filmsApiServer) {
    super();
    this.#filmsApiSrevice = filmsApiServer;

    this.#filmsApiSrevice.filmCards.then((filmCards) => {
      // console.log(filmCards);
      console.log(filmCards.map(this.#adaptToClient));
    });
  }

  get filmCards() {
    return this.#filmCards;
  }

  set filmCards(filmCards) {
    this.#filmCards = filmCards;
  }

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
    // const adaptedFilmCards = {
    //   ...filmCard,
    //   alternativeTitle: filmCard['alternative_title'],
    //   totalRating: filmCard['total_rating'],
    //   ageRating: filmCard['age_rating'],
    //   userDetails: filmCard['user_details'],
    //   release: {
    //     releaseCountry: filmCard['release.release_country'],
    //   },
    //   userDetails: {
    //     alreadyWatched: filmCard.user_details['already_watched'],
    //     watchingDate: filmCard.user_details['watching_date'],
    //   },
    // };

    // delete filmCard['alternative_title'];
    // delete filmCard['total_rating'];
    // delete filmCard['age_rating'];
    // delete filmCard.release['release_country'];
    // delete filmCard.user_details['already_watched'];
    // delete filmCard.user_details['watching_date'];
    // delete filmCard['user_details'];

    // return adaptedFilmCards;

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
