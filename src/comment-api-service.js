import ApiService from './framework/api-service.js';
import { Method } from './const.js';


export default class CommentsApiService extends ApiService {
  get comments() {
    return this._load({ url: 'comments' })
      .then(ApiService.parseResponse);
  }
}
