import NewPointButtonView from '../view/new-point-button-view.js';
import SortView from '../view/sort-view.js';
import MessageView from '../view/message-view.js';
import PointsListView from '../view/point-list-view.js';
import {
  DEFAULT_FILTER_TYPE,
  DEFAULT_SORT_TYPE,
  FilterTypeToEmptyMessage,
  INIT_ERROR_MESSAGE,
  LOADING_MESSAGE,
  SortType,
  ModelEvent,
  UserAction,
} from '../const.js';
import PointPresenter from './point-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const MAX_DATE = new Date(8640000000000000);
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const headerElement = document.querySelector('.trip-main');
const listParentElement = document.querySelector('.trip-events');

export default class PagePresenter {
  #model;
  #filterPresenter;
  #newPointButtonComponent;
  #sortComponent;
  #listComponent = new PointsListView();
  // если компонент будет создаваться, понадобится ссылка на него для удаления dom-элемента при добавлении новой точки
  #messageComponent;
  #pointPresenter = new Map();
  #newPointPresenter;
  #currentSortType = DEFAULT_SORT_TYPE;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({ model }) {
    this.#model = model;

    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick,
    });

    this.#newPointPresenter = new NewPointPresenter({
      model: this.#model,
      container: this.#listComponent,
      onPointAdd: this.#handleViewAction.bind(this, UserAction.ADD_POINT),
      onDestroy: this.#onNewPointFormClose,
    });

    this.#model.addObserver(this.#handleModelEvent);
  }

  get points() {
    return this.constructor.getSortedPoints(this.#currentSortType, this.#model.points);
  }

  init() {
    this.#model.init();
    this.#renderFilter();
    this.#newPointButtonComponent.renderInto(headerElement);
  }

  createPoint() {
    // сброс фильтра и сортировки в начальное состояние
    // если текущий тип фильтра не дефолтный - изменение типа вызовет событие модели, по которому сбросится сортировка
    if (this.#model.filterType !== DEFAULT_FILTER_TYPE) {
      this.#model.setFilterType(DEFAULT_FILTER_TYPE);
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
    // Board includes: (sort, list, points) || no points message
    const points = this.points;

    if (!points.length) {
      this.#renderMessage(FilterTypeToEmptyMessage[this.#model.filterType]);
      return;
    }

    this.#renderSort();
    this.#renderPointList(points);
  }

  #clearBoard({ resetSort = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#clearPointList();
    this.#sortComponent.remove();
    this.#clearMessage();

    if (resetSort) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #renderFilter() {
    this.#filterPresenter = new FilterPresenter({
      model: this.#model,
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
        onPointUpdate: this.#handleViewAction.bind(this, UserAction.UPDATE_POINT),
        onPointDelete: this.#handleViewAction.bind(this, UserAction.DELETE_POINT),
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

  #renderMessage(message) {
    this.#messageComponent = new MessageView({ message });
    this.#messageComponent.renderInto(listParentElement);
  }

  #clearMessage() {
    if (this.#messageComponent) {
      this.#messageComponent.remove();
      this.#messageComponent = null;
    }
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

  async #handleViewAction(actionType, point) {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(point.id).setSaving();
        try {
          await this.#model.updatePoint(point);
        } catch {
          this.#pointPresenter.get(point.id).setAborting();
        }
        break;

      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#model.addPoint(point);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;

      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(point.id).setSaving();
        try {
          await this.#model.deletePoint(point);
        } catch {
          this.#pointPresenter.get(point.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  }

  #handleModelEvent = (event, payload) => {
    const eventToAction = {
      [ModelEvent.UPDATE_POINT]: ([pointBeforeUpdate, updatedPoint]) => {
        const isOnlyOnePointToUpdate = updatedPoint.dateFrom - pointBeforeUpdate.dateFrom === 0
          && updatedPoint.dateTo - pointBeforeUpdate.dateTo === 0
          && updatedPoint.basePrice === pointBeforeUpdate.basePrice;

        if (isOnlyOnePointToUpdate) {
          // изменение точки в части данных, не влияющих на положение или наличие в списке
          // обновляем измененную точку
          this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
        } else {
          // триггер: удаление или добавление точки, изменение значения поля, которое влияет на сортировку или фильтр
          this.#clearBoard();
          this.#renderBoard();
        }
      },

      [ModelEvent.ADD_POINT]: () => {
        this.#clearBoard();
        this.#renderBoard();
      },

      [ModelEvent.DELETE_POINT]: () => {
        this.#clearBoard();
        this.#renderBoard();
      },

      [ModelEvent.FILTER_TYPE_SET]: () => {
        // обновляем список, сбрасываем сортировку
        this.#clearBoard({ resetSort: true });
        this.#renderBoard();
      },

      [ModelEvent.BEFORE_INIT]: () => {
        // перед загрузкой данных с сервера
        this.#renderMessage(LOADING_MESSAGE);
      },

      [ModelEvent.INIT]: () => {
        // загрузка данных с сервера успешно завершена
        // удаляем сообщение о загрузке, включаем кнопку создания точки
        this.#clearMessage();
        this.#newPointButtonComponent.element.disabled = false;
        this.#renderBoard();
      },

      [ModelEvent.INIT_ERROR]: () => {
        // показ сообщения об ошибке
        this.#clearMessage();
        this.#renderMessage(INIT_ERROR_MESSAGE);
      },
    };

    eventToAction[event]?.(payload);
  };

  #handleNewPointButtonClick = () => {
    this.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #onNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  static getSortedPoints(sortType, points) {
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
