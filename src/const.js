const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DateFormat = {
  POINT_DAY: 'MMM DD',
  POINT_DAY_DATETIME_TAG: 'YYYY-MM-DD',
  POINT_TIME: 'HH:mm',
  POINT_TIME_DATETIME_TAG: 'YYYY-MM-DD[T]HH:mm',
  POINT_FORM_TIME: 'DD/MM/YY HH:mm',
  POINT_FORM_TIME_FOR_FLATPICKR: 'd/m/y H:i',
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

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const DEFAULT_FILTER_TYPE = FilterType.EVERYTHING;

const FilterTypeToEmptyMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
};

const SortType = {
  DATE_ASC: 'date-asc',
  PRICE_DESC: 'price-desc',
};

const DEFAULT_SORT_TYPE = SortType.DATE_ASC;

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export {
  TYPES,
  DateFormat,
  getBlankPoint,
  FilterType,
  DEFAULT_FILTER_TYPE,
  FilterTypeToEmptyMessage,
  SortType,
  DEFAULT_SORT_TYPE,
  UserAction,
  UpdateType,
};
