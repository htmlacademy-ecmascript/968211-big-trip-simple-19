import AbstractView from '../framework/view/abstract-view.js';

function createTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  #handleButtonClick;

  constructor({ onClick }) {
    super();
    this.#handleButtonClick = onClick;

    this.element.addEventListener('click', this.#newPointButtonClickHandler);
  }

  get template() {
    return createTemplate();
  }

  #newPointButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleButtonClick();
  };
}
