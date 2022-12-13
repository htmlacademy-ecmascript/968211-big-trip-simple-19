import mock from '../mock/mock.js';
import { TYPES } from '../const.js';

const POINTS_AMOUNT = 10;

export default class PageModel {
  types = TYPES;

  points = mock.getPoints(POINTS_AMOUNT).map((point) => ({
    id: point.id,
    type: point.type,
    destination: point.destination,
    dateFrom: point.date_from,
    dateTo: point.date_to,
    price: point.base_price,
    offers: point.offers,
  }));

  offersByType = Object.fromEntries(mock.getOffersByType().map(({ type, offers }) => [type, offers]));
  destinations = mock.getDestinations();


  getTypes() {
    return structuredClone(this.types);
  }

  getPoints() {
    return structuredClone(this.points);
  }

  getOffersByType() {
    return structuredClone(this.offersByType);
  }

  getDestinations() {
    return structuredClone(this.destinations);
  }
}
