import { FilterType, UpdateType } from '../const.js';
import { filter } from '../utils/filter.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #model;
  #filterModel;
  #filterComponent;
  #container;

  constructor({ model, filterModel, container }) {
    this.#model = model;
    this.#filterModel = filterModel;
    this.#container = container;

    this.#model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#model.points;
    return [
      {
        type: FilterType.EVERYTHING,
        enabled: true,
      },
      {
        type: FilterType.FUTURE,
        enabled: filter[FilterType.FUTURE](points).length > 0,
      },
    ];
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      activeFilterType: this.#filterModel.filterType,
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
    if (this.#filterModel.filterType === filterType) {
      return;
    }

    this.#filterModel.setFilterType(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
