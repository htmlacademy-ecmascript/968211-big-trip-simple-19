import PointFormView from './point-form-view.js';
import { getBlankPoint } from '../const.js';

export default class PointAddFormView extends PointFormView {
  #handleCancelClick;

  constructor({ types, offersByType, destinations, onFormSubmit, onCancelClick }) {
    super({
      point: getBlankPoint(destinations),
      types,
      offersByType,
      destinations,
      onFormSubmit,
    });
    this.#handleCancelClick = onCancelClick;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    super._restoreHandlers();
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
  }

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelClick();
  };
}
