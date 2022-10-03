import ApiService from './framework/api-service.js';
import { Method } from './const.js';


export default class FilmsApiService extends ApiService {
  get filmCards() {
    return this._load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  updateFilmCard = async (filmCard) => {
    const response = await this._load({
      url: `movies/${filmCard.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(filmCard)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (filmCard) => {
    const {
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
    } = filmCard;

    return {
      id,
      comments,
      'film_info': {
        title,
        'alternative_title': alternativeTitle,
        'total_rating': totalRating,
        poster,
        'age_rating': ageRating,
        director,
        writers,
        actors,
        release: {
          date,
          'release_country': releaseCountry,
        },
        runtime,
        genre,
        description,
      },
      'user_details': {
        watchlist,
        'already_watched': alreadyWatched,
        'watching_date': watchingDate,
        favorite,
      },
    };
  };
}
