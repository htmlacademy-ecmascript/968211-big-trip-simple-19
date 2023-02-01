import { DEFAULT_FILTER_TYPE, FilterType } from '../const.js';
import PageModel from './page-model.js';

export default class FilterModel extends PageModel {
  #filterType = DEFAULT_FILTER_TYPE;

  get points() {
    return this.getFilteredPoints(this.#filterType);
  }

  get filterType() {
    return this.#filterType;
  }

  setFilterType(updateType, filterType) {
    if (filterType === this.#filterType) {
      return;
    }

    this.#filterType = filterType;
    this._notify(updateType, filterType);
  }

  getFilteredPoints(filterType) {
    const currentDate = new Date();

    switch (filterType) {
      case FilterType.EVERYTHING:
        return super.points;

      case FilterType.FUTURE:
        return super.points.filter((point) => point.dateTo > currentDate);

      default:
        return super.points;
    }
  }
}
