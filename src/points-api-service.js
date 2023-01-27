import ApiService from './framework/api-service.js';

const AUTHORIZATION = 'Basic ekjhb10998e098cje987';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  constructor() {
    super(END_POINT, AUTHORIZATION);
  }

  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse)
      .then((points) => points.map((point) => this.#adaptPointToClient(point)));
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  get offersByType() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse)
      .then(this.#adaptOffersToClient);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return this.#adaptPointToClient(
      await ApiService.parseResponse(response),
    );
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return this.#adaptPointToClient(
      await ApiService.parseResponse(response),
    );
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptPointToServer(point) {
    const adaptedPoint = {
      ...point,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'base_price': point.basePrice,
    };

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;

    return adaptedPoint;
  }

  #adaptPointToClient(point) {
    const adaptedPoint = {
      ...point,
      dateFrom: point.date_from ? new Date(point.date_from) : null,
      dateTo: point.date_to ? new Date(point.date_to) : null,
      basePrice: point.base_price,
    };

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;

    return adaptedPoint;
  }

  #adaptOffersToClient(serverOffers) {
    return Object.fromEntries(serverOffers.map(({ type, offers }) => [type, offers]));
  }
}
