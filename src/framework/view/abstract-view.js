// import { createElement, remove, render, replace } from '../render.js';
import './abstract-view.css';

/** @const {string} Класс, реализующий эффект "покачивания головой" */
const SHAKE_CLASS_NAME = 'shake';

/** @const {number} Время анимации в миллисекундах */
const SHAKE_ANIMATION_TIMEOUT = 600;

/**
 * Абстрактный класс представления
 */
export default class AbstractView {
  /** @type {HTMLElement|null} Элемент представления */
  #element = null;

  /** @type {Object} Объект с колбэками. Может использоваться для хранения обработчиков событий */
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  /**
   * Геттер для получения элемента
   * @returns {HTMLElement} Элемент представления
   */
  get element() {
    if (!this.#element) {
      this.#element = this.constructor.createElement(this.template);
    }

    return this.#element;
  }

  /**
   * Геттер для получения разметки элемента
   * @abstract
   * @returns {string} Разметка элемента в виде строки
   */
  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  /** Метод для удаления элемента */
  removeElement() {
    this.#element = null;
  }

  /**
   * Метод, реализующий эффект "покачивания головой"
   * @param {shakeCallback} [callback] Функция, которая будет вызвана после завершения анимации
   */
  shake(callback) {
    this.element.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      this.element.classList.remove(SHAKE_CLASS_NAME);
      callback?.();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  renderInto(container) {
    this.constructor.render(this, container, this.constructor.RenderPosition.BEFOREEND);
  }

  replaceWith(newComponent) {
    this.constructor.replace(newComponent, this);
  }

  remove() {
    this.constructor.remove(this);
  }

  // Перенесено из render.js
  static RenderPosition = {
    BEFOREBEGIN: 'beforebegin',
    AFTERBEGIN: 'afterbegin',
    BEFOREEND: 'beforeend',
    AFTEREND: 'afterend',
  };

  static render(component, container, place = this.RenderPosition.BEFOREEND) {
    if (!(component instanceof AbstractView)) {
      throw new Error('Can render only components');
    }

    if (container === null) {
      throw new Error('Container element doesn\'t exist');
    }

    container.insertAdjacentElement(place, component.element);
  }

  static replace(newComponent, oldComponent) {
    if (!(newComponent instanceof AbstractView && oldComponent instanceof AbstractView)) {
      throw new Error('Can replace only components');
    }

    const newElement = newComponent.element;
    const oldElement = oldComponent.element;

    const parent = oldElement.parentElement;

    if (parent === null) {
      throw new Error('Parent element doesn\'t exist');
    }

    parent.replaceChild(newElement, oldElement);
  }

  static remove(component) {
    if (component === null) {
      return;
    }

    if (!(component instanceof AbstractView)) {
      throw new Error('Can remove only components');
    }

    component.element.remove();
    component.removeElement();
  }

  static createElement(template) {
    const newElement = document.createElement('div');
    newElement.innerHTML = template;

    return newElement.firstElementChild;
  }
}

/**
 * Функция, которая будет вызвана методом shake после завершения анимации
 * @callback shakeCallback
 */
