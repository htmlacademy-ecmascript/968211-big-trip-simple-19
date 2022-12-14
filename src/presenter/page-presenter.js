import PageModel from '../model/page-model.js';
import { render } from '../render.js';
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
    render(this.#filterComponent, headerElement);
    render(this.#newPointButtonComponent, headerElement);

    const points = this.#model.points;

    if (points.length) {
      render(this.#sortComponent, listParentElement);
      render(this.#listComponent, listParentElement);
      points.forEach((point) => this.#renderPoint(point));
    } else {
      this.#messageComponent = new MessageView({
        message: FilterValueToEmptyMessage[FilterValue.EVERTHING],
      });
      render(this.#messageComponent, listParentElement);
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


    const replacePointToForm = () => {
      this.#listComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#listComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const escDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', escDownHandler);
    });

    pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', escDownHandler);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoint();
      document.removeEventListener('keydown', escDownHandler);
    });

    render(pointComponent, this.#listComponent.element);
  }
}
