import { formatDateTime } from '../utils/common.js';
import { DateFormat } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

function getEventTypeListTemplate(currentType, possibleTypes, isDisabled) {
  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${possibleTypes.map(he.encode).map((type) => `
                <div class="event__type-item">
                  <input id="event-type-${type}-1"
                    class="event__type-input visually-hidden"
                    type="radio"
                    name="event-type"
                    value="${type}" ${he.encode(currentType) === type ? 'checked' : ''}
                    ${isDisabled ? 'disabled' : ''}>
                  <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
                </div>`).join('')}
            </fieldset>
          </div>`;
}


function getOffersTemplate({ selectedOfferIds, possibleOffers, isDisabled }) {
  if (!possibleOffers?.length) {
    return '';
  }

  const getSingleOfferTemplate = (offer) => {
    const offerName = offer.title.toLowerCase().replaceAll(' ', '-');
    const offerId = offer.id;
    const checked = selectedOfferIds.includes(offer.id) ? 'checked' : '';
    return `<div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden"
                id="event-offer-${offerId}"
                type="checkbox"
                name="event-offer-${he.encode(offerName)}"
                data-id=${offerId}
                ${checked}
                ${isDisabled ? 'disabled' : ''}>
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


function createTemplate(isEditForm, state, types, offersByType, destinations, isSubmitDisabled) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    offers,
    basePrice,
    isDisabled,
    isSaving,
    isDeleting,
  } = state;

  const eventTypeListTemplate = getEventTypeListTemplate(type, types, isDisabled);
  const destinationName = destinations.find((dest) => dest.id === destination)?.name || '';
  const startTime = formatDateTime(dateFrom, DateFormat.POINT_FORM_TIME);
  const endTime = formatDateTime(dateTo, DateFormat.POINT_FORM_TIME);
  const offersTemplate = getOffersTemplate({
    selectedOfferIds: offers,
    possibleOffers: offersByType[type],
    isDisabled,
  });
  const destinationTemplate = getDestinationTemplate(destination, destinations);

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                  ${eventTypeListTemplate}
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${he.encode(type)}
                  </label>
                  <input class="event__input  event__input--destination"
                    id="event-destination-1"
                    type="text"
                    name="event-destination"
                    value="${he.encode(destinationName)}"
                    list="destination-list-1"
                    ${isDisabled ? 'disabled' : ''}>
                  <datalist id="destination-list-1">
                    ${destinations.map((dest) => `<option value="${he.encode(dest.name)}"></option>`).join('')}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" ${isDisabled ? 'disabled' : ''}>
                  —
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" ${isDisabled ? 'disabled' : ''}>
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    €
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice ?? ''}" ${isDisabled ? 'disabled' : ''}>
                </div>

                <button class="event__save-btn btn btn--blue" type="submit" ${isSubmitDisabled || isDisabled ? 'disabled' : ''}>
                  ${isSaving ? 'Saving...' : 'Save'}
                </button>
                ${isEditForm ? `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
                                <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span></button>`
  // eslint-disable-next-line
                             : `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`}
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
    this.#isEditForm = 'id' in point;
    this._setState(this.constructor.parsePointToState(point));
    this.#types = types;
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
  }

  get template() {
    return createTemplate(
      this.#isEditForm,
      this._state,
      this.#types,
      this.#offersByType,
      this.#destinations,
      this.#isSubmitDisabled(),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-list').addEventListener('change', this.#changePointTypeClickHandler);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('#event-price-1').addEventListener('input', this.#basePriceInputHandler);
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
    this.#handleFormSubmit(this.constructor.parseStateToPoint(this._state));
  };

  #isSubmitDisabled() {
    return !this._state.destination
      || !(this._state.dateFrom instanceof Date)
      || !(this._state.dateTo instanceof Date)
      || !this._state.basePrice;
  }

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
    const selectedId = this.#destinations
      .find((destination) => destination.name === evt.target.value)
      ?.id ?? null;

    this.updateElement({ destination: selectedId });
  };

  #basePriceInputHandler = (evt) => {
    evt.preventDefault();
    const value = Number(evt.target.value);
    this._setState({
      basePrice: value > 0 && Number.isInteger(value) ? value : null,
    });

    this.element.querySelector('.event__save-btn').disabled = this.#isSubmitDisabled();
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
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
