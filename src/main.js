import PageModel from './model/page-model.js';
import PagePresenter from './presenter/page-presenter.js';


const pageModel = new PageModel();
const pagePresenter = new PagePresenter(pageModel);
pagePresenter.init();
