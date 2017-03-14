var log4js = require('log4js');
var mongoAppender = require('./log4js-node-mongodb');
var log_config = require('../config/log_config');

//加载配置文件
log4js.configure(log_config);

log4js.addAppender(
    mongoAppender.appender({connectionString: '127.0.0.1:27017/logs',collectionName:'errorreports'}),
    'reportLogger'
);

var logUtil = {};

var reportLogger = log4js.getLogger('reportLogger');

//封装上报日志
logUtil.logReport = function (ctx) {
    if (ctx) {
        reportLogger.info(formatReport(ctx));
    }
};

//格式化上报日志
var formatReport = function (ctx) {
    var logObj = new Object();
    var req = ctx.request

    //添加请求日志
    var method = req.method;
    //请求头
    //logObj["user-agent"] = req.header["user-agent"];
    //页面地址
    logObj["url"] = req.header["referer"];
    //请求参数
    if (method === 'GET') {
        let query = req.query;
        for(let key in query){
            logObj[key] = query[key];
        };
    } else {
        logObj["request body"] = req.body;
    }

    return logObj;
}

module.exports = logUtil;