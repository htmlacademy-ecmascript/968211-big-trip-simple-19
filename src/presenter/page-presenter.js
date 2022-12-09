import { render } from '../render.js';
import FilterView from '../view/filter-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import MessageView from '../view/message-view.js';

const POINTS_AMOUNT = 3;
const headerElement = document.querySelector('.trip-main');
const listParentElement = document.querySelector('.trip-events');

export default class PagePresenter {
  filterComponent = new FilterView();
  newPointButtonComponent = new NewPointButtonView();
  sortViewComponent = new SortView();
  listComponent = new PointsListView();
  pointEditComponent = new PointEditView();
  messageComponent = new MessageView();

  init() {
    render(this.filterComponent, headerElement);
    render(this.newPointButtonComponent, headerElement);
    render(this.sortViewComponent, listParentElement);
    render(this.listComponent, listParentElement);
    render(this.pointEditComponent, this.listComponent.getElement());
    for (let i = 0; i < POINTS_AMOUNT; i++) {
      render(new PointView(), this.listComponent.getElement());
    }
  }
}
