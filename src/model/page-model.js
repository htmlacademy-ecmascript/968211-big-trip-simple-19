import mock from '../mock/mock.js';
import { TYPES } from '../const.js';

const POINTS_AMOUNT = 10;

export default class PageModel {
  #types = TYPES;

  #points = mock.getPoints(POINTS_AMOUNT).map((point) => ({
    id: point.id,
    type: point.type,
    destination: point.destination,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    basePrice: point.base_price,
    offers: point.offers,
  }));

  #offersByType = Object.fromEntries(mock.getOffersByType().map(({ type, offers }) => [type, offers]));
  #destinations = mock.getDestinations();


  get types() {
    return structuredClone(this.#types);
  }

  get points() {
    return structuredClone(this.#points);
  }

  get offersByType() {
    return structuredClone(this.#offersByType);
  }

  get destinations() {
    return structuredClone(this.#destinations);
  }
}
