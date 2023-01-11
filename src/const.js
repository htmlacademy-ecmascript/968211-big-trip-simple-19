const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DateFormat = {
  POINT_DAY: 'MMM DD',
  POINT_DAY_DATETIME_TAG: 'YYYY-MM-DD',
  POINT_TIME: 'HH:mm',
  POINT_TIME_DATETIME_TAG: 'YYYY-MM-DD[T]HH:mm',
  POINT_FORM_TIME: 'DD/MM/YY HH:mm',
};

const getBlankPoint = (destinations) => ({
  id: null,
  type: TYPES[0],
  destination: destinations[0].id,
  dateFrom: new Date(Date.now()),
  dateTo: new Date(Date.now() + 1000 * 60 * 60 * 24),
  price: null,
  offers: [],
});

const FilterValue = {
  EVERTHING: 'everthing',
  FUTURE: 'future',
};

const DEFAULT_FILTER_VALUE = FilterValue.EVERTHING;

const FilterValueToEmptyMessage = {
  [FilterValue.EVERTHING]: 'Click New Event to create your first point',
  [FilterValue.FUTURE]: 'There are no future events now',
};

const SortType = {
  DATE_ASC: 'date-asc',
  PRICE_DESC: 'price-desc',
};

const DEFAULT_SORT_TYPE = SortType.DATE_ASC;

export {
  TYPES,
  DateFormat,
  getBlankPoint,
  FilterValue,
  DEFAULT_FILTER_VALUE,
  FilterValueToEmptyMessage,
  SortType,
  DEFAULT_SORT_TYPE,
};
