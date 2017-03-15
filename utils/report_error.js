const mongoose = require('mongoose');
const reportConfig = require('../config/report_config');
const sendMail = require('./send_email');
const hostConfig = require('../config/host_config');

var Schema = mongoose.Schema;
var LogSchema = new Schema({
    reportType: String,
    data: Object
});

mongoose.connect('mongodb://127.0.0.1/logs');

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open');
});

var LogModel = mongoose.model('errorreport', LogSchema);

// var log = new LogModel({
//     reportType:'123',
//     data: {
//         a:2
//     }
// })

// log.save(function (err, user1) {
// 	if (err) {
// 		return console.error(err);
// 	}else{
//         console.info(user1);
//     }
// });


function countLog(...args) {
    let [
        reportType,
        name,
        reportLimit
    ] = args;
    return new Promise(function (resolve, reject) {
        LogModel.count({ 'reportType': reportType }, (err, res) => {
            if (err) {
                console.log(err);
            }
            else {
                if (res >= reportLimit) {
                    resolve('reportType:' + reportType + '项目' + name + '警报数量达到' + res);
                }
            }
        });
    });
}

function findLog(obj) {
    let {
        reportType,
        dateMin,
        dateMax
    } = obj;
    return new Promise(function (resolve, reject) {
        LogModel.find({ 'reportType': reportType, 'time': { $gt: dateMin }, 'time': { $lte: dateMax } }, (err, res) => {
            if (err) {
                console.log(err);
            }
            else {
                resolve(res)
            }
        });
    });
}

function reportLog(mes, ...args) {
    let [
        emails
    ] = args;
    emails.forEach((item) => {
        sendMail(item, '这是测试邮件', '<p class="mes">' + mes + '</p>');
    })
}

function loop(func, ...args) {
    let [
        checktime
    ] = args;
    let interval = setInterval(() => {
        typeof func == 'function' && func(...args).then((val) => {
            reportLog(val, ...args);
        });
    }, checktime);
}

async function reportEvent(...args) {
    await loop(countLog, ...args);
}

function reportHandler() {
    for (let reportType in reportConfig) {
        let {
            name,
            watch,
            checktime,
            reportDay = 1,
            reportLimit,
            emails
        } = reportConfig[reportType];
        if (watch == true) {
            reportEvent(reportType, name, checktime, reportLimit, emails);
        }
    }
}
// 每天发邮件
function getNowDate() {
    let nowDate = new Date();
    return [
        nowDate.getHours(),
        nowDate.getMinutes()
    ]
}

function getConfigDate() {
    var timeArr = hostConfig.sendTime.split(':');
    return [
        timeArr[0],
        timeArr[1]
    ]
}

function loopDate() {
    let [configHour, configMinute] = getConfigDate();
    let interval = setInterval(() => {
        let [nowHour, nowMinute] = getNowDate();
        if (configHour == nowHour && configMinute == nowMinute) {
            let nowDate = new Date();
            let nowDay = nowDate.getDate();
            nowDate.setHours(nowHour);
            nowDate.setMinutes(nowMinute);
            nowDate.setSeconds(0);
            nowDate.setMilliseconds(0);

            let lastDate = new Date();
            lastDate.setDate(nowDay - 1);
            lastDate.setHours(nowHour);
            lastDate.setMinutes(nowMinute);
            lastDate.setSeconds(0);
            lastDate.setMilliseconds(0);
            loopReportConfig(lastDate.getTime(), nowDate.getTime());
        }
    }, (1000 * 60));
}

function loopReportConfig(dateMin, dateMax) {
    for (let reportType in reportConfig) {
        let {
            watch,
            emails
        } = reportConfig[reportType];
        if (watch == true && emails && emails.length > 0) {
            reportLogMes(emails,reportType,dateMin,dateMax);
        }
    }
}

async function reportLogMes(emails,reportType,dateMin,dateMax) {
    let mes = await findLog({ reportType, dateMin, dateMax });
    let nowDate = new Date(dateMax);
    let lastDate = new Date(dateMin);
    let nowDateStr = nowDate.getFullYear()+'年'+(nowDate.getMonth()+1)+'月'+nowDate.getDate();
    let lastDateStr = lastDate.getFullYear()+'年'+(lastDate.getMonth()+1)+'月'+lastDate.getDate();
    let theme = lastDateStr+'至'+nowDateStr+'报警情况';
    emails.forEach((item) => {
        sendMail(item,theme,mes.toString());
    });
}

reportHandler();
loopDate();