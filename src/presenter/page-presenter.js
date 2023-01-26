import PageModel from '../model/page-model.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import SortView from '../view/sort-view.js';
import MessageView from '../view/message-view.js';
import PointsListView from '../view/point-list-view.js';
import {
  DEFAULT_FILTER_TYPE,
  DEFAULT_SORT_TYPE,
  FilterTypeToEmptyMessage,
  SortType,
  UpdateType,
  UserAction,
} from '../const.js';
import PointPresenter from './point-presenter.js';
import FilterModel from '../model/filter-model.js';
import FilterPresenter from './filter-presenter.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';

const headerElement = document.querySelector('.trip-main');
const listParentElement = document.querySelector('.trip-events');

export default class PagePresenter {
  #model = new PageModel();
  #filterModel = new FilterModel();
  #filterPresenter;
  #newPointButtonComponent;
  #sortComponent;
  #listComponent = new PointsListView();
  // если компонент будет создаваться, понадобится ссылка на него для удаления dom-элемента при добавлении новой точки
  #messageComponent;
  #pointPresenter = new Map();
  #newPointPresenter;
  #currentSortType = DEFAULT_SORT_TYPE;

  constructor() {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick,
    });

    this.#newPointPresenter = new NewPointPresenter({
      model: this.#model,
      containerComponent: this.#listComponent,
      onPointAdd: this.#handleViewAction,
      onDestroy: this.#onNewPointFormClose,
    });

    this.#model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.filterType;
    const filteredPoints = filter[filterType](this.#model.points);
    return this.constructor.getSortedPoints(this.#currentSortType, filteredPoints);
  }

  init() {
    this.#renderFilter();
    this.#newPointButtonComponent.renderInto(headerElement);
    // Board includes: (sort, list, points) || no points message
    this.#renderBoard();
  }

  createPoint() {
    // сброс фильтра и сортировки в начальное состояние
    // если текущий тип фильтра не дефолтный - изменение типа вызовет событие модели, по которому сбросится сортировка
    if (this.#filterModel.filterType !== DEFAULT_FILTER_TYPE) {
      this.#filterModel.setFilterType(UpdateType.MAJOR, DEFAULT_FILTER_TYPE);
      // если фильтр был дефолтный, а сортировка нет - сбрасываем напрямую
    } else if (this.#currentSortType !== DEFAULT_SORT_TYPE) {
      this.#clearBoard({ resetSort: true });
      this.#renderBoard();
    } else {
      // закрытие открытой формы редактирования
      this.#resetPointPresentersView();
    }

    this.#newPointPresenter.init();
  }

  #renderBoard() {
    const points = this.points;

    if (!points.length) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointList(points);
  }

  #clearBoard({ resetSort = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#clearPointList();
    this.#sortComponent.remove();
    this.#messageComponent?.remove();

    if (resetSort) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #renderFilter() {
    this.#filterPresenter = new FilterPresenter({
      model: this.#model,
      filterModel: this.#filterModel,
      container: headerElement,
    });
    this.#filterPresenter.init();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      initialSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    this.#sortComponent.renderInto(listParentElement);
  }

  #renderPointList(points) {
    this.#listComponent.renderInto(listParentElement);
    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        model: this.#model,
        container: this.#listComponent.element,
        onEditFormCreation: () => {
          this.#newPointPresenter.destroy();
          this.#resetPointPresentersView();
        },
        onPointChange: this.#handleViewAction,
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
      message: FilterTypeToEmptyMessage[this.#filterModel.filterType],
    });
    this.#messageComponent.renderInto(listParentElement);
  }

  #resetPointPresentersView = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleModelEvent = (updateType, updatedPoint) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // изменение точки в части данных, не влияющих на положение или наличие в списке
        // обновляем измененную точку
        this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
        break;
      case UpdateType.MINOR:
        // триггер: удаление или добавление точки, изменение значения поля, которое влияет на сортировку или фильтр
        // обновляем список
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // триггер: смена фильтра
        // обновляем список, сбрасываем сортировку
        this.#clearBoard({ resetSort: true });
        this.#renderBoard();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, point) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#model.updatePoint(updateType, point);
        break;
      case UserAction.ADD_POINT:
        this.#model.addPoint(updateType, point);
        break;
      case UserAction.DELETE_POINT:
        this.#model.deletePoint(updateType, point);
        break;
    }
  };

  #handleNewPointButtonClick = () => {
    this.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #onNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  static getSortedPoints(sortType, points) {
    const MAX_DATE = new Date(8640000000000000);

    return points.sort((pointA, pointB) => {
      if (sortType === SortType.DATE_ASC) {
        // если dateFrom === falsy, помещаем point в конец списка
        return (pointA.dateFrom || MAX_DATE) - (pointB.dateFrom || MAX_DATE);
      } else if (sortType === SortType.PRICE_DESC) {
        return pointB.basePrice - pointA.basePrice;
      }
    });
  }
}
