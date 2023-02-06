import dayjs from 'dayjs';

function formatDateTime(datetime, formatTemplate) {
  if (!(datetime instanceof Date) || isNaN(datetime)) {
    return '';
  }

  return dayjs(datetime).format(formatTemplate);
}

export { formatDateTime };
