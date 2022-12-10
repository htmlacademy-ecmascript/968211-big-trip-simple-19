import { getDestinations } from './destinations.js';
import { getRandomArrayElement, getRandomArrayElements, getRandomNumber } from '../utils.js';
import { getOffersByType } from './offersByType.js';


function getPoints(amount) {
  return Array.from({ length: amount }, (value, id) => {
    const { type, offers } = getRandomArrayElement(getOffersByType());

    return {
      id,
      type,
      destination: getRandomArrayElement(getDestinations()).id,
      'date_from': new Date(Date.now() + getRandomNumber(0, 1000 * 60 * 60 * 24)),
      'date_to': new Date(Date.now() + getRandomNumber(1000 * 60 * 60 * 24, 1000 * 60 * 60 * 24 * 3)),
      'base_price': getRandomNumber(1, 200) * 10,
      offers: getRandomArrayElements(offers).map((offer) => offer.id),
    };
  });
}

export { getPoints };
