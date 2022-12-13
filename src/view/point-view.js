import { createElement } from '../render.js';
import { DateFormat } from '../const.js';
import { formatDateTime } from '../utils.js';


function createSelectedOffersTemplate({ selectedOfferIds, allOffers }) {
  const getNoOffersItem = () => '<li class="event__offer"><span class="event__offer-title">No additional offers</span></li>';

  const getOfferItems = () => selectedOfferIds.map((selectedId) => {
    const { title, price } = allOffers.find((offer) => offer.id === selectedId);
    return `<li class="event__offer">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;<span class="event__offer-price">${price}</span>
            </li>`;
  }).join('');

  return `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${selectedOfferIds.length ? getOfferItems() : getNoOffersItem()}
          </ul>`;
}

function createTemplate(point, offersByType, destinations) {
  const { type, price, destination, offers: selectedOfferIds } = point;
  const { name: destinationName } = destinations.find((dest) => dest.id === destination);
  const dateFrom = formatDateTime(point.dateFrom, DateFormat.POINT_DAY);
  const dateFromTag = formatDateTime(point.dateFrom, DateFormat.POINT_DAY_DATETIME_TAG);
  const timeStart = formatDateTime(point.dateFrom, DateFormat.POINT_TIME);
  const timeStartTag = formatDateTime(point.dateFrom, DateFormat.POINT_TIME_DATETIME_TAG);
  const timeEnd = formatDateTime(point.dateTo, DateFormat.POINT_TIME);
  const timeEndTag = formatDateTime(point.dateTo, DateFormat.POINT_TIME_DATETIME_TAG);

  const selectedOffersTemplate = createSelectedOffersTemplate({
    selectedOfferIds,
    allOffers: offersByType[type],
  });

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dateFromTag}">${dateFrom}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${type} ${destinationName}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${timeStartTag}">${timeStart}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${timeEndTag}">${timeEnd}</time>
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
  constructor({ point, offersByType, destinations }) {
    this.point = point;
    this.offersByType = offersByType;
    this.destinations = destinations;
  }

  getTemplate() {
    return createTemplate(this.point, this.offersByType, this.destinations);
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
