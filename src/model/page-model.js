import mock from '../mock/mock.js';
import { TYPES } from '../const.js';

const POINTS_AMOUNT = 10;

export default class PageModel {
  types = TYPES;
  points = mock.getPoints(POINTS_AMOUNT);
  offersByType = Object.fromEntries(mock.getOffersByType().map(({ type, offers }) => [type, offers]));
  destinations = mock.getDestinations();

  getTypes() {
    return this.types.slice();
  }

  getPoints() {
    return this.points.map((point) => ({
      id: point.id,
      type: point.type,
      destination: this.destinations.find((dest) => dest.id === point.destination),
      dateFrom: point.date_from,
      dateTo: point.date_to,
      price: point.base_price,
      offers: point.offers.map((offerId) => this.offersByType[point.type].find((offer) => offer.id === offerId)),
    }));
  }

  getOffersByType() {
    return structuredClone(this.offersByType);
  }

  getDestinations() {
    return this.destinations.slice();
  }
}
