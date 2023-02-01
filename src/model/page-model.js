import { TYPES, UpdateType } from '../const.js';
import Observable from '../framework/observable.js';

export default class PageModel extends Observable {
  #apiService;

  #types = TYPES;
  #points = [];
  #offersByType = {};
  #destinations = [];

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

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

  async init() {
    this._notify(UpdateType.BEFORE_INIT);
    try {
      [ this.#points, this.#offersByType, this.#destinations ] = await Promise.all([
        this.#apiService.points,
        this.#apiService.offersByType,
        this.#apiService.destinations,
      ]);
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#points = [];
      this.#offersByType = [];
      this.#destinations = [];
      this._notify(UpdateType.INIT_ERROR);
    }
  }

  async updatePoint(updateType, updatedPoint) {
    const targetPoint = this.#points.find((point) => point.id === updatedPoint.id);
    if (!targetPoint) {
      throw new Error('Can\'t update unexisting point');
    }

    let updatedPointFromServer;
    try {
      updatedPointFromServer = await this.#apiService.updatePoint(updatedPoint);
    } catch {
      throw new Error('Can\'t update point');
    }

    Object.assign(targetPoint, updatedPointFromServer);
    this._notify(updateType, updatedPointFromServer);
  }

  async addPoint(updateType, point) {
    let addedPoint;
    try {
      addedPoint = await this.#apiService.addPoint(point);
    } catch {
      throw new Error('Can\'t add point');
    }
    this.#points = [addedPoint, ...this.#points];
    this._notify(updateType, addedPoint);
  }

  async deletePoint(updateType, targetPoint) {
    const index = this.#points.findIndex((point) => point.id === targetPoint.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(targetPoint);
    } catch {
      throw new Error('Can\'t delete point');
    }

    this.#points.splice(index, 1);
    this._notify(updateType);
  }
}
