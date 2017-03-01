var router = require('koa-router')();
var controller = require('../controllers/log_controller');
//log工具
const logUtil = require('../utils/log_util');

router.get('/j.gif', async (ctx, next)=>{
    ctx.body = await controller();
    await logUtil.logReport(ctx);
});

module.exports = router;



