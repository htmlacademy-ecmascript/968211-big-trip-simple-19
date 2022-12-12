import dayjs from 'dayjs';
import { createElement } from '../render.js';


function createSelectedOffersTemplate(offers) {
  const items = offers.length
    ? offers.map(({ title, price }) =>
      `<li class="event__offer">
         <span class="event__offer-title">${title}</span>
         &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
       </li>`).join('')
    : `<li class="event__offer">
         <span class="event__offer-title">No additional offers</span>
       </li>`;

  return `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${items}
          </ul>`;
}

function createTemplate(point) {
  const { type, dateFrom, dateTo, price, destination } = point;
  const dayjsDateFrom = dayjs(dateFrom);
  const dayjsDateTo = dayjs(dateTo);
  const selectedOffersTemplate = createSelectedOffersTemplate(point.offers);

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dayjsDateFrom.format('YYYY-MM-DD')}">${dayjsDateFrom.format('MMM DD')}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type} ${destination.name}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${dayjsDateFrom.format('YYYY-MM-DD[T]HH:mm')}">${dayjsDateFrom.format('HH:mm')}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${dayjsDateTo.format('YYYY-MM-DD[T]HH:mm')}">${dayjsDateTo.format('HH:mm')}</time>
                </p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>
              ${selectedOffersTemplate}
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
}

export default class PointView {
  constructor({ point }) {
    this.point = point;
  }

  getTemplate() {
    return createTemplate(this.point);
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
