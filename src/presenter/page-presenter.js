import PageModel from '../model/page-model.js';
import FilterView from '../view/filter-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import SortView from '../view/sort-view.js';
import MessageView from '../view/message-view.js';
import PointsListView from '../view/point-list-view.js';
import { FilterValue, FilterValueToEmptyMessage } from '../const.js';
import PointPresenter from './point-presenter.js';

const headerElement = document.querySelector('.trip-main');
const listParentElement = document.querySelector('.trip-events');

export default class PagePresenter {
  #model = new PageModel();

  #filterComponent;
  #newPointButtonComponent = new NewPointButtonView();
  #sortComponent = new SortView();
  #listComponent = new PointsListView();

  #pointPresenter = new Map();

  init() {
    const { points } = this.#model;

    this.#filterComponent = new FilterView({ points });
    this.#filterComponent.renderInto(headerElement);
    this.#newPointButtonComponent.renderInto(headerElement);

    if (points.length) {
      this.#sortComponent.renderInto(listParentElement);
      this.#listComponent.renderInto(listParentElement);
      points.forEach(this.#createPointPresenter);
    } else {
      this.#renderNoPoints();
    }
  }

  #createPointPresenter = (point) => {
    const pointPresenter = new PointPresenter({
      model: this.#model,
      container: this.#listComponent.element,
      onModeChange: this.#resetPointPresenters,
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderNoPoints() {
    const messageComponent = new MessageView({
      message: FilterValueToEmptyMessage[FilterValue.EVERTHING],
    });
    messageComponent.renderInto(listParentElement);
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #resetPointPresenters = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}
