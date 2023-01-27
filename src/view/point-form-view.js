import { formatDateTime } from '../utils/common.js';
import { DateFormat } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

function getEventTypeListTemplate(currentType, possibleTypes) {
  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${possibleTypes.map(he.encode).map((type) => `
                <div class="event__type-item">
                  <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${he.encode(currentType) === type ? 'checked' : ''}>
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
    const offerId = offer.id;
    const checked = selectedOfferIds.includes(offer.id) ? 'checked' : '';
    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerId}" type="checkbox" name="event-offer-${he.encode(offerName)}" data-id=${offerId} ${checked}>
              <label class="event__offer-label" for="event-offer-${offerId}">
                <span class="event__offer-title">${he.encode(offer.title)}</span>
                +€&nbsp;
                <span class="event__offer-price">${he.encode(String(offer.price))}</span>
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
    ? `<p class="event__destination-description">${he.encode(description)}</p>`
    : '';

  const getPicturesTemplate = () => pictures.length
    ? `<div class="event__photos-container">
         <div class="event__photos-tape">
           ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${he.encode(picture.description)}">`).join('')}
         </div>
       </div>`
    : '';

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${getDescriptionTemplate()}
            ${getPicturesTemplate()}
          </section>`;
}


function createTemplate(isEditForm, point, types, offersByType, destinations) {
  const eventTypeListTemplate = getEventTypeListTemplate(point.type, types);
  const destinationName = destinations.find((dest) => dest.id === point.destination)?.name || '';
  const startTime = formatDateTime(point.dateFrom, DateFormat.POINT_FORM_TIME);
  const endTime = formatDateTime(point.dateTo, DateFormat.POINT_FORM_TIME);
  const offersTemplate = getOffersTemplate({
    selectedOfferIds: point.offers,
    possibleOffers: offersByType[point.type],
  });
  const destinationTemplate = getDestinationTemplate(point.destination, destinations);

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(point.type)}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                  ${eventTypeListTemplate}
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${he.encode(point.type)}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destinationName)}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${destinations.map((dest) => `<option value="${he.encode(dest.name)}"></option>`).join('')}
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
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice ?? ''}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                ${isEditForm ? '<button class="event__reset-btn" type="reset">Delete</button>' : '<button class="event__reset-btn" type="reset">Cancel</button>'}
                ${isEditForm ? '<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>' : ''}

              </header>
              <section class="event__details">
                ${offersTemplate}
                ${destinationTemplate}
              </section>
            </form>
          </li>`;
}

// abstract class
export default class PointFormView extends AbstractStatefulView {
  #isEditForm;
  #types;
  #offersByType;
  #destinations;
  #handleFormSubmit;
  #datepickers = [];

  constructor({ point, types, offersByType, destinations, onFormSubmit }) {
    super();
    this.#isEditForm = point.id !== null;
    this._setState(point);
    this.#types = types;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
  }

  get template() {
    return createTemplate(this.#isEditForm, this._state, this.#types, this.#offersByType, this.#destinations);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#changePointTypeClickHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('change', this.#basePriceChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
    this.#setDatepickers();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickers.length) {
      this.#datepickers.forEach((datepicker) => datepicker.destroy());
      this.#datepickers = [];
    }
  }

  #setDatepickers() {
    const commonConfig = {
      dateFormat: DateFormat.POINT_FORM_TIME_FOR_FLATPICKR,
      enableTime: true,
      allowInput: true,
    };

    this.#datepickers = [
      flatpickr(
        this.element.querySelector('#event-start-time-1'),
        { ...commonConfig,
          defaultDate: this._state.dateFrom,
          onClose: (([userDate]) => {
            const update = { dateFrom: userDate };
            if (userDate > this._state.dateTo) {
              update.dateTo = userDate;
            }
            this.updateElement(update);
          }),
        },
      ),
      flatpickr(
        this.element.querySelector('#event-end-time-1'),
        { ...commonConfig,
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onClose: (([userDate]) => this.updateElement({ dateTo: userDate })),
        },
      ),
    ];
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    if (!this._state.destination) {
      this.element.querySelector('#event-destination-1').focus();
      return;
    }
    if (!(this._state.dateFrom instanceof Date)) {
      this.element.querySelector('#event-start-time-1').focus();
      return;
    }
    if (!(this._state.dateTo instanceof Date)) {
      this.element.querySelector('#event-end-time-1').focus();
      return;
    }
    if (!this._state.basePrice) {
      this.element.querySelector('#event-price-1').focus();
      return;
    }

    this.#handleFormSubmit(this.constructor.parseStateToPoint(this._state));
  };

  #changePointTypeClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT' && evt.target.value !== this._state.type) {
      this.updateElement({
        type: evt.target.value,
        offers: [],
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const previousId = this._state.destination;
    const selectedId = this.#destinations
      .find((destination) => destination.name === evt.target.value)
      ?.id;

    if (selectedId === undefined || selectedId === previousId) {
      evt.target.value = '';
      return;
    }

    this.updateElement({ destination: selectedId });
  };

  #basePriceChangeHandler = (evt) => {
    evt.preventDefault();
    let basePrice = Number(evt.target.value);

    // если поле пустое, <= 0 или NaN - сохраняем в состояние null и очищаем поле
    if (isNaN(basePrice) || basePrice <= 0) {
      basePrice = null;
      evt.target.value = '';
    // если не целое число - округляем и сохраняем полученное значение в состояние и input
    } else if(!Number.isInteger(basePrice)) {
      basePrice = Math.round(basePrice);
      evt.target.value = basePrice;
    }

    this._setState({ basePrice });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offers = this._state.offers.slice();
    const offerId = Number(evt.target.dataset.id);
    if (evt.target.checked) {
      offers.push(offerId);
    } else {
      offers.splice(offers.indexOf(offerId), 1);
    }
    this._setState({ offers });
  };

  static parsePointToState(point) {
    return { ...point };
  }

  static parseStateToPoint(state) {
    return { ...state };
  }
}
