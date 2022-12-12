import { getRandomArrayElement, getRandomNumber } from '../utils.js';

const names = [ 'Chamonix', 'Amsterdam', 'Geneva', 'New York', 'Berlin', 'Paris', 'Warsaw'];
const descriptions = [
  '{name} is a beautiful city, a true asian pearl, with crowded streets.',
  '{name} is the capital and most populous city of the Netherlands, with The Hague being the seat of government.',
  '{name} is the second-most populous city in Switzerland (after Zürich) and the most populous city of Romandy',
  '{name} is the most populous city in the United States',
  '{name} is the capital and largest city of Germany by both area and population.',
];
const pictureDescriptions = [
  '{name} parliament building',
  '{name} in the Centrum borough',
  'Coat of arms of {name} as part of the pavement in front of the Reformation Wall',
  '{name} Grand Central Terminal',
  '{name} Brandenburg Gate',
];

const MAX_PICTURES = 10;

let destinations;

function getDestinations() {
  if (!destinations) {
    destinations = names.map((name, id) => ({
      id,
      name,
      description: getRandomArrayElement(descriptions).replace('{name}', name),
      pictures: Array.from({ length: getRandomNumber(0, MAX_PICTURES) }, () => ({
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(0, 5000)}`,
        description: getRandomArrayElement(pictureDescriptions).replace('{name}', name),
      })),
    }));
  }
  return destinations;
}

export { getDestinations };
