import { DEFAULT_FILTER_TYPE } from '../const.js';
import PageModel from './page-model.js';

export default class FilterModel extends PageModel {
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
