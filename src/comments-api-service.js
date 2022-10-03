import ApiService from './framework/api-service.js';
import { Method } from './const.js';


export default class CommentsApiService extends ApiService {
  get = async (filmCardId) => this._load({ url: `comments/${filmCardId}` })
    .then(ApiService.parseResponse);

  addComment = async (comment, filmCardId) => {
    const response = await this._load({
      url: `comments/${filmCardId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteTask = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });

    return response;
  };
}
