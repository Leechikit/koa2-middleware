var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// var errorLogPath = path.resolve(__dirname, "../logs/error/error");


//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// var responseLogPath = path.resolve(__dirname, "../logs/response/response");

//上报日志目录
var reportPath = "/report";
//上报日志文件名
var reportFileName = "report";
//上报日志输出完整路径
var reportLogPath = baseLogPath + reportPath + "/" + reportFileName;
// var reportLogPath = path.resolve(__dirname, "../logs/report/report");

module.exports = {
    "appenders":
    [
        //错误日志
        {
            "category": "errorLogger",             //logger名称
            "type": "dateFile",                   //日志类型
            "filename": errorLogPath,             //日志输出位置
            "alwaysIncludePattern": true,          //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
            "path": errorPath                     //自定义属性，错误日志的根目录
        },
        //响应日志
        {
            "category": "resLogger",
            "type": "dateFile",
            "filename": responseLogPath,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd-hh.log",
            "path": responsePath
        },
        //上报日志
        {
            "category": "reportLogger",
            "filename": reportLogPath,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd.log",
            "path": reportPath,
            "type": "smtp",
            "recipients": "279148001@qq.com",
            "sendInterval": 5,
            "transport": "SMTP",
            "SMTP": {
                "host": "smtp.gmail.com",
                "secureConnection": true,
                "port": 465,
                "auth": {
                    "user": "leechikit0823@gmail.com",
                    "pass": "571823eric"
                },
                "debug": true
            }
        }
    ],
    "levels":                                   //设置logger名称对应的的日志等级
    {
        "errorLogger": "ERROR",
        "resLogger": "ALL",
        "reportLogger": "INFO"
    },
    "baseLogPath": baseLogPath                  //logs根目录
}