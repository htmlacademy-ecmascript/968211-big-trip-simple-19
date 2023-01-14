import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomArrayElements(items) {
  return items.filter(() => Boolean(Math.round(Math.random())));
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function formatDateTime(datetime, formatTemplate) {
  if (!(datetime instanceof Date) || isNaN(datetime)) {
    return '';
  }

  return dayjs(datetime).format(formatTemplate);
}

export { getRandomArrayElement, getRandomArrayElements, getRandomNumber, formatDateTime };
