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

  #filterComponent = new FilterView();
  #newPointButtonComponent = new NewPointButtonView();
  #sortComponent = new SortView();
  #listComponent = new PointsListView();
  #messageComponent;

  init() {
    this.#filterComponent.renderInto(headerElement);
    this.#newPointButtonComponent.renderInto(headerElement);

    const points = this.#model.points;

    if (points.length) {
      this.#sortComponent.renderInto(listParentElement);
      this.#listComponent.renderInto(listParentElement);
      points.forEach((point) => this.#renderPoint(point));
    } else {
      this.#messageComponent = new MessageView({
        message: FilterValueToEmptyMessage[FilterValue.EVERTHING],
      });
      this.#messageComponent.renderInto(listParentElement);
    }
  }

  #renderPoint(point) {
    const pointComponent = new PointView({
      point,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
    });

    const pointEditComponent = new PointFormView({
      point,
      types: this.#model.types,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
    });


    const escDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        pointEditComponent.replaceWith(pointComponent);
        document.removeEventListener('keydown', escDownHandler);
      }
    };

    pointComponent.setRollUpButtonClickHandler(() => {
      pointComponent.replaceWith(pointEditComponent);
      document.addEventListener('keydown', escDownHandler);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      pointEditComponent.replaceWith(pointComponent);
      document.removeEventListener('keydown', escDownHandler);
    });

    pointEditComponent.setRollUpButtonClickHandler(() => {
      pointEditComponent.replaceWith(pointComponent);
      document.removeEventListener('keydown', escDownHandler);
    });

    pointComponent.renderInto(this.#listComponent.element);
  }
}
