import { FilterType, UpdateType } from '../const.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #model;
  #filterComponent;
  #container;

  constructor({ model, container }) {
    this.#model = model;
    this.#container = container;

    this.#model.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return Object.values(FilterType).map((type) => ({
      type,
      enabled: this.#model.getFilteredPoints(type).length > 0,
    }));
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      activeFilterType: this.#model.filterType,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (!prevFilterComponent) {
      this.#filterComponent.renderInto(this.#container);
      return;
    }

    prevFilterComponent.replaceWith(this.#filterComponent);
    prevFilterComponent.remove();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#model.filterType === filterType) {
      return;
    }

    this.#model.setFilterType(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
