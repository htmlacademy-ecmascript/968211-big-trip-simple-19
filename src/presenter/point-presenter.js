import PointView from '../view/point-view.js';
import PointEditFormView from '../view/point-edit-form-view.js';

export default class PointPresenter {
  #model;
  #container;
  // Ссылка на текущий компонент: PointView || PointEditFormView
  #component;
  #point;
  #handleEditFormCreation;
  #handlePointUpdate;
  #handlePointDelete;

  constructor({ model, container, onEditFormCreation, onPointUpdate, onPointDelete }) {
    this.#model = model;
    this.#container = container;
    this.#handleEditFormCreation = onEditFormCreation;
    this.#handlePointUpdate = onPointUpdate;
    this.#handlePointDelete = onPointDelete;
  }

  init(point) {
    this.#point = point;

    const prevComponent = this.#component;
    this.#component = this.#createPointComponent();

    if (prevComponent) {
      prevComponent.replaceWith(this.#component);
      prevComponent.remove();
      return;
    }

    this.#component.renderInto(this.#container);
  }

  resetView() {
    if (!(this.#component instanceof PointView)) {
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    if (this.#component instanceof PointEditFormView) {
      this.#component.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#component instanceof PointEditFormView) {
      this.#component.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#component instanceof PointEditFormView) {
      this.#component.shake(() => {
        this.#component.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      });
    }
  }

  destroy() {
    this.#component.remove();
  }

  #createPointComponent() {
    return new PointView({
      point: this.#point,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
      onRollUpButtonClick: this.#replacePointToForm,
    });
  }

  #createPointEditComponent() {
    return new PointEditFormView({
      point: this.#point,
      types: this.#model.types,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollUpButtonClick: this.#replaceFormToPoint,
      onDeleteClick: this.#handleDeleteClick,
    });
  }

  #replacePointToForm = () => {
    this.#handleEditFormCreation();
    const pointEditComponent = this.#createPointEditComponent();
    this.#component.replaceWith(pointEditComponent);
    this.#component = pointEditComponent;
    document.addEventListener('keydown', this.#escDownHandler);
  };

  #replaceFormToPoint = () => {
    const pointComponent = this.#createPointComponent();
    this.#component.replaceWith(pointComponent);
    this.#component = pointComponent;
    document.removeEventListener('keydown', this.#escDownHandler);
  };

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handlePointUpdate(updatedPoint);
  };

  #handleDeleteClick = (point) => {
    this.#handlePointDelete(point);
  };
}
