var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

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
        //上报日志
        {
            "category": "reportLogger",
            "filename": reportLogPath,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd.log",
            "path": reportPath,
            "type": "dateFile"
            // "type": "smtp",
            // "recipients": "279148001@qq.com",
            // "sendInterval": 5,
            // "transport": "SMTP",
            // "SMTP": {
            //     "host": "smtp.gmail.com",
            //     "secureConnection": true,
            //     "port": 465,
            //     "auth": {
            //         "user": "leechikit0823@gmail.com",
            //         "pass": "571823eric"
            //     },
            //     "debug": true
            // }
        }
    ],
    "levels":                                   //设置logger名称对应的的日志等级
    {
        "reportLogger": "INFO"
    },
    "baseLogPath": baseLogPath                  //logs根目录
}