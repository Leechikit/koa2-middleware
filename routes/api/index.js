var router = require('koa-router')();
var user_router = require('./user_router');
var video_router = require('./video_router');

router.use('/users', user_router.routes(), user_router.allowedMethods());
router.use('/video', video_router.routes(), video_router.allowedMethods());

module.exports = router;