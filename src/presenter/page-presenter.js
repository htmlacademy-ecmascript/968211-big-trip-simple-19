import { render } from '../render.js';
import FilterView from '../view/filter-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import PointFormView from '../view/point-form-view.js';
import MessageView from '../view/message-view.js';

const headerElement = document.querySelector('.trip-main');
const listElement = document.querySelector('.trip-events__list');

export default class PagePresenter {
  filterComponent = new FilterView();
  newPointButtonComponent = new NewPointButtonView();
  sortViewComponent = new SortView();
  messageComponent = new MessageView();

  constructor(model) {
    this.model = model;
  }

  init() {
    render(this.filterComponent, headerElement);
    render(this.newPointButtonComponent, headerElement);
    render(this.sortViewComponent, listElement, 'beforebegin');

    const points = this.model.getPoints();

    render(new PointFormView({
      point: points[0],
      possibleTypes: this.model.getTypes(),
      possibleDestinations: this.model.getDestinations(),
      offersByType: this.model.getOffersByType(),
    }), listElement);

    for (let i = 1; i < points.length; i++) {
      render(new PointView({ point: points[i] }), listElement);
    }
  }
}
