import FilterModel from './model/filter-model.js';
import PagePresenter from './presenter/page-presenter.js';
import PointsApiService from './points-api-service.js';

const model = new FilterModel({
  apiService: new PointsApiService(),
});

const pagePresenter = new PagePresenter({ model });
pagePresenter.init();
