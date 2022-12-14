import { createElement } from '../render.js';

function createTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class MessageView {
  #element;
  #message;

  constructor({ message }) {
    this.#message = message;
  }

  get template() {
    return createTemplate(this.#message);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
