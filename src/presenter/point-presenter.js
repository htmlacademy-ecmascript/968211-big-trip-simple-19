import PointView from '../view/point-view.js';
import { UpdateType, UserAction } from '../const.js';
import PointEditFormView from '../view/point-edit-form-view.js';

export default class PointPresenter {
  #model;
  #container;
  // Ссылка на текущий компонент: PointView || PointEditFormView
  #component;
  #point;
  #handleEditFormCreation;
  #handlePointChange;

  constructor({ model, container, onEditFormCreation, onPointChange }) {
    this.#model = model;
    this.#container = container;
    this.#handleEditFormCreation = onEditFormCreation;
    this.#handlePointChange = onPointChange;
  }

  init(point) {
    this.#point = point;
    this.#render();
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

  #render() {
    const prevComponent = this.#component;
    // Создаем компонент формы только если предыдущий компонент - форма,
    // во всех остальных случаях создаем компонент point
    this.#component = prevComponent instanceof PointEditFormView
      ? this.#createPointEditComponent() : this.#createPointComponent();

    if (!prevComponent) {
      this.#component.renderInto(this.#container);
      return;
    }

    if (this.#container.contains(prevComponent.element)) {
      prevComponent.replaceWith(this.#component);
    }

    prevComponent.remove();
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
    const isMinorUpdate = updatedPoint.dateFrom - this.#point.dateFrom !== 0
      || updatedPoint.dateTo - this.#point.dateTo !== 0
      || updatedPoint.basePrice !== this.#point.basePrice;

    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedPoint,
    );
  };

  #handleDeleteClick = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
