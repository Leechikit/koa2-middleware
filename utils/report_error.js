const LogModel = require('./logModel');
const dayReport = require('./dayReport');
const reportConfig = require('../config/report_config');
const sendMail = require('./send_email');
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
        checktime,
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

function reportLog(mes, ...args) {
    let [
        emails
    ] = args;
    emails.forEach((item) => {
        sendMail(item, '这是测试邮件', '<p class="mes">' + mes + '</p>');
    })
}

function loop(func, ...args) {
    let interval = setInterval(() => {
        typeof func == 'function' && func(...args).then((val) => {
            reportLog(val, ...args);
        });
    }, (1000 * 60));
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

reportHandler();
dayReport();
// findLog({
//     reportType:2,
//     dateMax:1489975560000,
//     dateMin:1489889520000
// })