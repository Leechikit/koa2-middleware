var router = require('koa-router')();
var video_controller = require('../../app/controllers/video_controller');

router.get('/listVideoById',video_controller.listVideoById);

module.exports = router;