var router = require('koa-router')();
//log工具
const logUtil = require('../utils/log_util');

router.get('/w', async (ctx, next)=>{
    //ctx.body = await controller();
    ctx.body = '';
    await logUtil.logReport(ctx);
});

module.exports = router;



