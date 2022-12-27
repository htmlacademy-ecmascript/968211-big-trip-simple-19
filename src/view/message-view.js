import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class MessageView extends AbstractStatefulView {
  #message;

  constructor({ message }) {
    super();
    this.#message = message;
  }

  get template() {
    return createTemplate(this.#message);
  }
}