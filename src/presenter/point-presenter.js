import PointView from '../view/point-view.js';
import PointFormView from '../view/point-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #model;
  #container;
  #pointComponent;
  #pointEditComponent;
  #point;
  #mode = Mode.DEFAULT;
  #handleModeChange;
  #handlePointChange;

  constructor({ model, container, onModeChange, onPointChange }) {
    this.#model = model;
    this.#container = container;
    this.#handleModeChange = onModeChange;
    this.#handlePointChange = onPointChange;
  }

  init(point) {
    this.#point = point;
    this.#renderPoint(point);
  }

  #renderPoint(point) {
    // Добавим возможность повторно инициализировать презентер задачи.
    // Для этого в методе init будем запоминать предыдущие компоненты.
    // Если они null, то есть не создавались, рендерим как раньше.
    // Если они отличны от null, то есть создавались, то заменяем их новыми и удаляем

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
      onRollUpButtonClick: this.#replacePointToForm,
    });

    this.#pointEditComponent = new PointFormView({
      point,
      types: this.#model.types,
      offersByType: this.#model.offersByType,
      destinations: this.#model.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollUpButtonClick: this.#replaceFormToPoint,
    });

    if (!prevPointComponent || !prevPointEditComponent) {
      this.#pointComponent.renderInto(this.#container);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#container.contains(prevPointComponent.element)) {
      prevPointComponent.replaceWith(this.#pointComponent);
    }

    if (this.#container.contains(prevPointEditComponent.element)) {
      prevPointEditComponent.replaceWith(this.#pointEditComponent);
    }

    prevPointComponent.remove();
    prevPointEditComponent.remove();
  }

  #replacePointToForm = () => {
    // в презентере маршрута мы «прикажем» всем презентерам точек маршрута вернуть представление в исходное состояние,
    // когда пользователь открывает форму редактирования.
    this.#pointComponent.replaceWith(this.#pointEditComponent);
    document.addEventListener('keydown', this.#escDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    this.#pointEditComponent.replaceWith(this.#pointComponent);
    document.removeEventListener('keydown', this.#escDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escDownHandler = (evt)=> {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.replaceWith(this.#pointComponent);
      document.removeEventListener('keydown', this.#escDownHandler);
    }
  };

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    this.#pointComponent.remove();
    this.#pointEditComponent.remove();
  }

  #handleFormSubmit = (point) => {
    this.#handlePointChange(point);
    this.#replaceFormToPoint();
  };
}
