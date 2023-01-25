import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(filters, activeFilterType) {
  const filterItems = filters
    .map(({ type, enabled }) => `<div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          value="${type}"
          ${activeFilterType === type ? 'checked' : ''}
          ${enabled ? '' : 'disabled'}>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
      </div>`)
    .join('');

  return `<div class="trip-main__trip-controls  trip-controls">
            <div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">
                ${filterItems}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>
            </div>
          </div>`;
}

export default class FilterView extends AbstractView {
  #filters;
  #activeFilterType;
  #handleFilterTypeChange;

  constructor({ filters, activeFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#activeFilterType = activeFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createTemplate(this.#filters, this.#activeFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
