// 每天发邮件
const sendMail = require('./send_email');
const reportConfig = require('../config/report_config');
const hostConfig = require('../config/host_config');
const logFormat = require('./logFormat');
const LogModel = require('./logModel');
const DURATION = 60000;

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

function findLog(obj) {
    let {
        reportType,
        dateMin,
        dateMax
    } = obj;
    return new Promise(function (resolve, reject) {
        LogModel.find({ 'reportType': reportType, 'time': { '$gt': dateMin, '$lte': dateMax } },{'_id':0}, (err, res) => {
            if (err) {
                console.log(err);
            }
            else {
                resolve(logFormat(res))
                
            }
        });
    });
}

function loopReportConfig(dateMin, dateMax) {
    for (let reportType in reportConfig) {
        let {
            watch,
            name,
            emails
        } = reportConfig[reportType];
        if (watch == true && emails && emails.length > 0) {
            reportLogMes(emails,reportType,dateMin,dateMax,name);
        }
    }
}

async function reportLogMes(emails,reportType,dateMin,dateMax,name) {
    let mes = await findLog({ reportType, dateMin, dateMax });
    let nowDate = new Date(dateMax);
    let lastDate = new Date(dateMin);
    let nowDateStr = nowDate.getFullYear()+'年'+(nowDate.getMonth()+1)+'月'+nowDate.getDate();
    let lastDateStr = lastDate.getFullYear()+'年'+(lastDate.getMonth()+1)+'月'+lastDate.getDate();
    let theme = name+' '+lastDateStr+'至'+nowDateStr+'报警情况';
    mes && emails.forEach((item) => {
        sendMail(item,theme,mes.toString());
    });
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
    }, DURATION);
}
// findLog({
//     reportType:2,
//     dateMax:1489975560000,
//     dateMin:1489889520000
// })
export default loopDate;