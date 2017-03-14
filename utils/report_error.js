const mongoose = require('mongoose');
const reportConfig = require('../config/report_config');
const sendMail = require('./send_email');
const hostConfig = require('../config/host_config');

var Schema = mongoose.Schema;
var LogSchema = new Schema({
    reporttype: Number,
    data: Object
});

mongoose.connect('mongodb://127.0.0.1/logs');

mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open');
});

var LogModel = mongoose.model('errorreport', LogSchema);

// var log = new LogModel({
//     reporttype:'123',
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


function findLog(...args) {
    let [
        reporttype,
        name,
        reportLimit
    ] = args;
    return new Promise(function (resolve, reject) {
        LogModel.count({ 'reporttype': reporttype }, (err, res) => {
            if (err) {
                console.log(err);
            }
            else {
                if (res >= reportLimit) {
                    resolve('reporttype:' + reporttype + '项目' + name + '警报数量达到' + res);
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
    await loop(findLog, ...args);
}

function reportHandler() {
    for (let reporttype in reportConfig) {
        let {
            name,
            watch,
            checktime,
            reportDay = 1,
            reportLimit,
            emails
        } = reportConfig[reporttype];
        if (watch == true) {
            reportEvent(reporttype, name, checktime, reportLimit, emails);
        }
    }
}

function checkNextDate(lastDate){
    let nowDate = new Date();
    let hostTime = hostConfig.sendTime.split(':');
    nowDate.setHours(hostTime[0]);
    nowDate.setMinutes(hostTime[1]);
    nowDate.setSeconds(0);
    nowDate.setMilliseconds(0);

    
}

function loopDate(ms){
    setTimeout(()=>{

    },ms)
}

function loopDateHandler(){
    let lastDate = new Date();
    lastDate.setSeconds(0);
    lastDate.setMilliseconds(0);
}

reportHandler();