const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const nodemailer = require('nodemailer');

const index = require('./routes/index');
const api = require('./routes/api');
const log = require('./routes/log');
const test = require('./routes/test');
const response_formatter = require('./middlewares/response_formatter');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

//log工具
//const logUtil = require('./utils/log_util');
// log上报
const dayReport = require('./utils/dayReport');
dayReport();
// logger
// app.use(async (ctx, next) => {
//   //响应开始时间
//   const start = new Date();
//   //响应间隔时间
//   var ms;
//   try {
//     //开始进入到下一个中间件
//     await next();

//     ms = new Date() - start;
//     //记录响应日志
//     logUtil.logResponse(ctx, ms);

//   } catch (error) {

//     ms = new Date() - start;
//     //记录异常日志
//     logUtil.logError(ctx, error, ms);
//   }
// });

app.use(response_formatter('^/api'));

router.use('/api', api.routes(), api.allowedMethods());
router.use('/log', log.routes(), log.allowedMethods());
router.use('/test', test.routes(), test.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx);
});


module.exports = app;