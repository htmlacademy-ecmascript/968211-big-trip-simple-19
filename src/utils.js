function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomArrayElements(items) {
  return items.filter(() => Boolean(Math.round(Math.random())));
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export { getRandomArrayElement, getRandomArrayElements, getRandomNumber };
