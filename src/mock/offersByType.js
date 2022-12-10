import { getRandomNumber } from '../utils.js';
import { getOffers } from './offers.js';

const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

let offersByType;

function getOffersByType(offersMaxAmount = 8) {
  if (!offersByType) {
    offersByType = types.map((type) => ({
      type,
      offers: getOffers(getRandomNumber(0, offersMaxAmount)),
    }));
  }
  return offersByType;
}

export { getOffersByType };
