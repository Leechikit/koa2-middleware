var router = require('koa-router')();
var controller = require('../controllers/log_controller');
//log工具
const logUtil = require('../utils/log_util');

router.get('/w', async (ctx, next)=>{
    //ctx.body = await controller();
    ctx.body = '';
    await logUtil.logReport(ctx);
});

module.exports = router;



