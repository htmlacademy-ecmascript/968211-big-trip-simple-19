import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FilterValue, DefaultFilterValue } from '../const.js';

function createTemplate(points) {
  const filterItems = Object.values(FilterValue).map((filterValue) => {
    const checked = filterValue === DefaultFilterValue ? 'checked' : '';
    const disabled = !points.length && !checked ? 'disabled' : '';

    return `<div class="trip-filters__filter">
      <input id="filter-${filterValue}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterValue}" ${checked} ${disabled}>
      <label class="trip-filters__filter-label" for="filter-${filterValue}">${filterValue}</label>
    </div>`;
  }).join('');


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

export default class FilterView extends AbstractStatefulView {
  #points;

  constructor({ points }) {
    super();
    this.#points = points;
  }

  get template() {
    return createTemplate(this.#points);
  }
}
