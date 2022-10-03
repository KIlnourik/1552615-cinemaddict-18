import ApiService from './framework/api-service.js';
// import { Method } from './const.js';


export default class CommentsApiService extends ApiService {
  getComments(filmCardId) {
    return this._load({ url: `comments/${filmCardId}` })
      .then(ApiService.parseResponse);
  }
}
