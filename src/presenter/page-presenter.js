import PageModel from '../model/page-model.js';
import FilterView from '../view/filter-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointFormView from '../view/point-form-view.js';
import MessageView from '../view/message-view.js';
import PointsListView from '../view/point-list-view.js';
import { FilterValue, FilterValueToEmptyMessage } from '../const.js';

const headerElement = document.querySelector('.trip-main');
const listParentElement = document.querySelector('.trip-events');

export default class PagePresenter {
  #model = new PageModel();

  #filterComponent;
  #newPointButtonComponent = new NewPointButtonView();
  #sortComponent = new SortView();
  #listComponent = new PointsListView();

  init() {
    const points = this.#model.points;

    this.#filterComponent = new FilterView({ points });
    this.#filterComponent.renderInto(headerElement);
    this.#newPointButtonComponent.renderInto(headerElement);

    if (points.length) {
      this.#sortComponent.renderInto(listParentElement);
      this.#listComponent.renderInto(listParentElement);
      points.forEach((point) => this.#renderPoint(point));
    } else {
      const messageComponent = new MessageView({
        message: FilterValueToEmptyMessage[FilterValue.EVERTHING],
      });
      messageComponent.renderInto(listParentElement);
    }
  }

  #renderPoint(point) {
    let pointEditComponent = null;

    const pointComponent = new PointView({
      point,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
      onRollUpButtonClick: () => {
        pointComponent.replaceWith(pointEditComponent);
        document.addEventListener('keydown', escDownHandler);
      },
    });

    pointEditComponent = new PointFormView({
      point,
      types: this.#model.types,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
      onFormSubmit: () => {
        pointEditComponent.replaceWith(pointComponent);
        document.removeEventListener('keydown', escDownHandler);
      },
      onRollUpButtonClick: () => {
        pointEditComponent.replaceWith(pointComponent);
        document.removeEventListener('keydown', escDownHandler);
      },
    });

    function escDownHandler (evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        pointEditComponent.replaceWith(pointComponent);
        document.removeEventListener('keydown', escDownHandler);
      }
    }

    pointComponent.renderInto(this.#listComponent.element);
  }
}
