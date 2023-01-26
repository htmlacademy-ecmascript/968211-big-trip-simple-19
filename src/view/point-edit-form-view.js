import PointFormView from './point-form-view.js';

export default class PointEditFormView extends PointFormView {
  #handleDeleteClick;
  #handleRollUpButtonClick;

  constructor({ point, types, offersByType, destinations, onFormSubmit, onDeleteClick, onRollUpButtonClick }) {
    super({ point, types, offersByType, destinations, onFormSubmit });

    this.#handleDeleteClick = onDeleteClick;
    this.#handleRollUpButtonClick = onRollUpButtonClick;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    super._restoreHandlers();
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollUpButtonClickHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  }

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(
      this.constructor.parseStateToPoint(this._state),
    );
  };

  #rollUpButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollUpButtonClick();
  };
}
