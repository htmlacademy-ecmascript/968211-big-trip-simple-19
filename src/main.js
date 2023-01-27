import PageModel from './model/page-model.js';
import FilterModel from './model/filter-model.js';
import PagePresenter from './presenter/page-presenter.js';
import PointsApiService from './points-api-service.js';

const model = new PageModel({
  apiService: new PointsApiService(),
});
const filterModel = new FilterModel();


const pagePresenter = new PagePresenter({ model, filterModel });
pagePresenter.init();
