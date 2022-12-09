import { createElement } from '../render.js';

function createTemplate() {
  return '<p class="trip-events__msg"></p>';
}

export default class MessageView {
  getTemplate() {
    return createTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
