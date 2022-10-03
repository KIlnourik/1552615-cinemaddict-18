import ApiService from './framework/api-service.js';
// import { Method } from './const.js';


export default class CommentsApiService extends ApiService {
  get = async (filmCardId) => this._load({ url: `comments/${filmCardId}` })
    .then(ApiService.parseResponse);
}
