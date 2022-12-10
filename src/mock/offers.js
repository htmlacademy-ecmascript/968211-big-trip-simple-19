import { getRandomArrayElement, getRandomNumber } from '../utils.js';


const titles = [
  'Video viewing',
  'Increased luggage',
  'Listening to the radio',
  'Personal guide',
  'personal doctor',
  'Additional insurance',
];

function getOffers(amount) {
  return Array.from({ length: amount }, (value, index) => ({
    id: index,
    title: getRandomArrayElement(titles),
    price: getRandomNumber(1, 50) * 10,
  }));
}


export { getOffers };
