var router = require('koa-router')();
var getAllData_router = require('./getAllData_router');

router.use('/getAllData', getAllData_router.routes(), getAllData_router.allowedMethods());

module.exports = router;