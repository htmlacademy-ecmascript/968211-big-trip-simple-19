import { getDestinations } from './destinations.js';
import { getRandomArrayElement, getRandomArrayElements, getRandomNumber } from '../utils/common.js';
import { getOffersByType } from './offersByType.js';


function getPoints(amount) {
  return Array.from({ length: amount }, (value, id) => {
    const { type, offers } = getRandomArrayElement(getOffersByType());

    // +- 0-5 суток от текущей даты
    const dateFromTimestamp = Date.now() +
      getRandomNumber(0, 1000 * 60 * 60 * 24 * 5) * (Math.random() > 0.5 ? 1 : -1);
    // 0-2 суток от dateFrom
    const dateToTimestamp = dateFromTimestamp + getRandomNumber(0, 1000 * 60 * 60 * 24 * 2);

    return {
      id,
      type,
      destination: getRandomArrayElement(getDestinations()).id,
      'date_from': (new Date(dateFromTimestamp)).toISOString(),
      'date_to': (new Date(dateToTimestamp)).toISOString(),
      'base_price': getRandomNumber(1, 200) * 10,
      offers: getRandomArrayElements(offers).map((offer) => offer.id),
    };
  });
}

export { getPoints };
