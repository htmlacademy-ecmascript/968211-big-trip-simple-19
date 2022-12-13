import { createElement } from '../render.js';
import { formatDateTime } from '../utils.js';
import { DateFormat, getBlankPoint } from '../const.js';

function getEventTypeListTemplate(currentType, possibleTypes) {
  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${possibleTypes.map((type) => `
                <div class="event__type-item">
                  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
                </div>`).join('')}
            </fieldset>
          </div>`;
}


function getOffersTemplate({ selectedOfferIds, possibleOffers }) {
  if (!possibleOffers?.length) {
    return '';
  }

  const getSingleOfferTemplate = (offer) => {
    const offerName = offer.title.toLowerCase().replaceAll(' ', '-');
    const offerId = `${offerName}-1`;
    const checked = selectedOfferIds.includes(offer.id) ? 'checked' : '';
    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerId}" type="checkbox" name="event-offer-${offerName}" ${checked}>
              <label class="event__offer-label" for="event-offer-${offerId}">
                <span class="event__offer-title">${offer.title}</span>
                +€&nbsp;
                <span class="event__offer-price">30</span>
              </label>
            </div>`;
  };

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${possibleOffers.map((offer) => getSingleOfferTemplate(offer)).join('')}
            </div>
          </section>`;
}

function getDestinationTemplate(id, destinations) {
  const destination = destinations.find((dest) => dest.id === id);

  if (!destination) {
    return '';
  }

  const { description, pictures } = destination;

  const getDescriptionTemplate = () => description
    ? `<p class="event__destination-description">${description}</p>`
    : '';

  const getPicturesTemplate = () => pictures.length
    ? `<div class="event__photos-container">
         <div class="event__photos-tape">
           ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
         </div>
       </div>`
    : '';

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${getDescriptionTemplate()}
            ${getPicturesTemplate()}
          </section>`;
}


function createTemplate(point, types, offersByType, destinations) {
  const eventTypeListTemplate = getEventTypeListTemplate(point.type, types);
  const { name: destinationName } = destinations.find((dest) => dest.id === point.destination);
  const startTime = formatDateTime(point.dateFrom, DateFormat.POINT_FORM_TIME);
  const endTime = formatDateTime(point.dateTo, DateFormat.POINT_FORM_TIME);
  const offersTemplate = getOffersTemplate({
    selectedOfferIds: point.offers,
    possibleOffers: offersByType[point.type],
  });
  const destinationTemplate = getDestinationTemplate(point.destination, destinations);
  const isEditForm = (point.id !== null);

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                  ${eventTypeListTemplate}
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${point.type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
                  —
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    €
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.price ?? ''}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Cancel</button>

                ${isEditForm ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}

              </header>
              <section class="event__details">
                ${offersTemplate}
                ${destinationTemplate}
              </section>
            </form>
          </li>`;
}


export default class PointFormView {
  constructor({ point, types, offersByType, destinations }) {
    this.point = point || getBlankPoint(destinations);
    this.types = types;
    this.offersByType = offersByType;
    this.destinations = destinations;
  }

  getTemplate() {
    return createTemplate(this.point, this.types, this.offersByType, this.destinations);
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
