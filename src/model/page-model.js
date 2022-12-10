import mock from '../mock/mock.js';

const POINTS_AMOUNT = 10;

export default class PageModel {
  points = mock.getPoints(POINTS_AMOUNT);
  offersByType = mock.getOffersByType();
  destinations = mock.getDestinations();

  getTasks() {
    return this.points;
  }

  getOffersByType() {
    return this.offersByType;
  }

  getDestinations() {
    return this.destinations;
  }
}
