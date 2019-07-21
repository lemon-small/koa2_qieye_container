import IndexControllers from './IndexController.js';
const indexController = new IndexControllers();

export default (_) => {
    _.get('/', indexController.actionIndex);
    
    _.get('/view/:id', indexController.actionView);
    
    _.get('/update/:id', indexController.actionUpdate);

    _.get('/home', indexController.actionHome);

    _.get('/list', indexController.actionList);

    _.get('/second', indexController.actionSecond);
};