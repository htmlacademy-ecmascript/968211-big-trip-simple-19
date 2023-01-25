import Observable from '../framework/observable.js';
import { DEFAULT_FILTER_TYPE } from '../const.js';

export default class FilterModel extends Observable {
  #filterType = DEFAULT_FILTER_TYPE;

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
}
