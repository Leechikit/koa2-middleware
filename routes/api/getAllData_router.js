var router = require('koa-router')();
var getAllData_controller = require('../../controllers/getAllData');

router.get('/', getAllData_controller);

module.exports = router;