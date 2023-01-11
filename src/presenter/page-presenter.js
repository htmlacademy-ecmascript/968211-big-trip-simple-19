import PageModel from '../model/page-model.js';
import FilterView from '../view/filter-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import SortView from '../view/sort-view.js';
import MessageView from '../view/message-view.js';
import PointsListView from '../view/point-list-view.js';
import { DEFAULT_SORT_TYPE, FilterValue, FilterValueToEmptyMessage, SortType } from '../const.js';
import PointPresenter from './point-presenter.js';

const headerElement = document.querySelector('.trip-main');
const listParentElement = document.querySelector('.trip-events');

export default class PagePresenter {
  #model = new PageModel();
  #points = [];

  #filterComponent;
  #newPointButtonComponent = new NewPointButtonView();
  #sortComponent;
  #listComponent = new PointsListView();
  // если компонент будет создаваться, понадобится ссылка на него для удаления dom-элемента при добавлении новой точки
  #messageComponent;
  #pointPresenter = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;

  init() {
    this.#points = this.#model.points;
    this.#sortPoints(this.#currentSortType);

    this.#filterComponent = new FilterView({ points: this.#points });
    this.#filterComponent.renderInto(headerElement);
    this.#newPointButtonComponent.renderInto(headerElement);

    // Board includes: (list, sort, points) || no points message
    this.#renderBoard();
  }

  #renderBoard() {
    if (!this.#points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointList();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      initialSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    this.#sortComponent.renderInto(listParentElement);
  }

  #renderPointList() {
    this.#listComponent.renderInto(listParentElement);
    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        model: this.#model,
        container: this.#listComponent.element,
        onModeChange: this.#resetPointPresentersView,
        onPointChange: this.#updatePoint,
      });
      pointPresenter.init(point);
      this.#pointPresenter.set(point.id, pointPresenter);
    });
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    this.#listComponent.remove();
  }

  #renderNoPoints() {
    this.#messageComponent = new MessageView({
      message: FilterValueToEmptyMessage[FilterValue.EVERTHING],
    });
    this.#messageComponent.renderInto(listParentElement);
  }

  #resetPointPresentersView = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #updatePoint = (updatedPoint) => {
    this.#points = this.#points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);
    // Реинициализируем презенетер измененной точки
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #sortPoints(sortType) {
    const MAX_DATE_TIMESTAMP = 8640000000000000;

    this.#points.sort((pointA, pointB) => {
      if (sortType === SortType.DATE_ASC) {
        // если dateFrom === falsy, помещаем point в конец списка
        return new Date(pointA.dateFrom || MAX_DATE_TIMESTAMP) - new Date(pointB.dateFrom || MAX_DATE_TIMESTAMP);
      } else if (sortType === SortType.PRICE_DESC) {
        return pointB.basePrice - pointA.basePrice;
      }
    });

    this.#currentSortType = sortType;
  }
}
