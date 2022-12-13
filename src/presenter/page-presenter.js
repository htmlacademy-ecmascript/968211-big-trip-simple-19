import PageModel from '../model/page-model.js';
import { render } from '../render.js';
import FilterView from '../view/filter-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointFormView from '../view/point-form-view.js';
import MessageView from '../view/message-view.js';
import PointsListView from '../view/point-list-view.js';

const headerElement = document.querySelector('.trip-main');
const listParentElement = document.querySelector('.trip-events');

export default class PagePresenter {
  #model = new PageModel();

  #filterComponent = new FilterView();
  #newPointButtonComponent = new NewPointButtonView();
  #sortComponent = new SortView();
  #listComponent = new PointsListView();
  #messageComponent = new MessageView();

  init() {
    render(this.#filterComponent, headerElement);
    render(this.#newPointButtonComponent, headerElement);
    render(this.#sortComponent, listParentElement);
    render(this.#listComponent, listParentElement);

    const points = this.#model.points;
    // WIP, по требования ДЗ - первый эемент списка - форма редактирования, потом обычные пойнты
    points.forEach((point, index) => {
      if (index === 0) {
        render(new PointFormView({
          point: points[0],
          types: this.#model.types,
          offersByType: this.#model.offersByType,
          destinations: this.#model.destinations,
        }), this.#listComponent.element);
      } else {
        render(new PointView({
          point: points[index],
          offersByType: this.#model.offersByType,
          destinations: this.#model.destinations,
        }), this.#listComponent.element);
      }
    });
  }
}
