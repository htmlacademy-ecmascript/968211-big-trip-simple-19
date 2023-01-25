import { UpdateType, UserAction } from '../const.js';
import { getRandomNumber } from '../utils/common.js';
import PointAddFormView from '../view/point-add-form-view.js';


export default class NewPointPresenter {
  #model;
  #containerComponent;
  #handlePointAdd;
  #handleDestroy;
  #component;

  constructor({ model, containerComponent, onPointAdd, onDestroy }) {
    this.#model = model;
    this.#containerComponent = containerComponent;
    this.#handlePointAdd = onPointAdd;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#component) {
      return;
    }

    this.#component = new PointAddFormView({
      types: this.#model.types,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleCancelClick,
    });

    this.#component.renderFirstInto(this.#containerComponent.element);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#component) {
      return;
    }

    this.#handleDestroy();
    this.#component.remove();
    this.#component = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handlePointAdd(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        ...point,
        // WIP
        id: getRandomNumber(0, Number.MAX_SAFE_INTEGER),
      },
    );
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
