import ApiService from './framework/api-service.js';
import { Method } from './const.js';

export default class CommentsApiService extends ApiService {
  get = async (filmCardId) => this._load({ url: `comments/${filmCardId}` })
    .then(ApiService.parseResponse)
    .catch(() => null);

  add = async (comment, film) => {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    console.log(parsedResponse);
    return parsedResponse;
  };

  delete = async (id) => {
    const response = await this._load({
      url: `comments/${id}`,
      method: Method.DELETE,
    });

    return response;
  };

  // #adaptToServer = (comment) => {
  //   const adaptedComment = comment;
  //   return adaptedComment;
  // };
}
