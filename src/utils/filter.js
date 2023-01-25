import { FilterType } from '../const';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => {
    // TЗ:
    // Future — список запланированных точек маршрута, т. е. точек, у которых дата начала события больше или равна текущей дате;
    // Точки маршрута, у которых дата начала меньше текущей даты, а дата окончания — больше, отображаются во всех двух списках: Everything и Future.
    const currentDate = new Date();
    return points.filter((point) => point.dateTo > currentDate);
  },
};

export { filter };
