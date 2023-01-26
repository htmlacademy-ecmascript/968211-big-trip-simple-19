import mock from '../mock/mock.js';
import { TYPES } from '../const.js';
import Observable from '../framework/observable.js';

const POINTS_AMOUNT = 8;

export default class PageModel extends Observable {
  #types = TYPES;

  #points = mock.getPoints(POINTS_AMOUNT).map((point) => ({
    id: point.id,
    type: point.type,
    destination: point.destination,
    dateFrom: point.date_from ? new Date(point.date_from) : null,
    dateTo: point.date_to ? new Date(point.date_to) : null,
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

  set points(points) {
    this.#points = points;
  }

  get offersByType() {
    return structuredClone(this.#offersByType);
  }

  get destinations() {
    return structuredClone(this.#destinations);
  }

  updatePoint(updateType, updatedPoint) {
    const targetPoint = this.#points.find((point) => point.id === updatedPoint.id);
    if (!targetPoint) {
      throw new Error('Can\'t update unexisting point');
    }
    Object.assign(targetPoint, updatedPoint);
    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, point) {
    this.#points.push(point);
    this._notify(updateType, point);
  }

  deletePoint(updateType, targetPoint) {
    const index = this.#points.findIndex((point) => point.id === targetPoint.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points.splice(index, 1);
    this._notify(updateType);
  }
}
