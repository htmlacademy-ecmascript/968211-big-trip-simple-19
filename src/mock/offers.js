import { getRandomArrayElement, getRandomNumber } from '../utils/common.js';


const titles = [
  'Video viewing',
  'Increased luggage',
  'Personal guide',
  'Personal doctor',
  'Additional insurance',
  'Order Uber',
  'Add breakfast',
];

function getOffers(amount = 8) {
  return Array.from({ length: amount }, (value, index) => ({
    id: index,
    title: getRandomArrayElement(titles),
    price: getRandomNumber(1, 20) * 10,
  }));
}


export { getOffers };
