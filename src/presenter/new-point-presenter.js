import PointAddFormView from '../view/point-add-form-view.js';


export default class NewPointPresenter {
  #model;
  #container;
  #handlePointAdd;
  #handleDestroy;
  #component;

  constructor({ model, container, onPointAdd, onDestroy }) {
    this.#model = model;
    this.#container = container;
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

    this.#component.renderFirstInto(this.#container);

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

  setSaving() {
    this.#component.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    this.#component.shake(() => {
      this.#component.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    });
  }

  #handleFormSubmit = (point) => {
    this.#handlePointAdd(point);
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
