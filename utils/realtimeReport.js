const LogModel = require('./logModel');
const reportConfig = require('../config/report_config');
const sendMail = require('./send_email');

let dateCache = {};

function init(){
    for( let reportType in reportConfig){
        let {
            watch,
            reportLimit
        } = reportConfig[reportType];
        if(watch == true){
            dateCache[reportType] = [];
            initDate(reportType,reportLimit);
        }
    }
}

async function initDate(reportType, reportLimit){
    let logs = await findLog({'reportType':reportType},reportLimit);
    await logs.length > 0 && saveDate(logs);
}

function findLog(query,limit) {
    return new Promise((resolve,reject)=>{ 
        LogModel.find(query,(err,res)=>{
            if(err){
                console.log(err);
            }else{
                resolve(res);
            }
        }).sort({'time':-1}).limit(limit);
    });
}

function saveDate(logs){
    logs.forEach((log)=>{
        dateCache[log._doc.reportType].unshift(log._doc.time);
    });
}

// function countLog(...args) {
//     let [
//         reportType,
//         name,
//         checktime,
//         reportLimit
//     ] = args;
//     return new Promise(function (resolve, reject) {
//         LogModel.count({ 'reportType': reportType }, (err, res) => {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 if (res >= reportLimit) {
//                     resolve('reportType:' + reportType + '项目' + name + '警报数量达到' + res);
//                 }
//             }
//         });
//     });
// }

// function reportLog(mes, ...args) {
//     let [
//         emails
//     ] = args;
//     emails.forEach((item) => {
//         sendMail(item, '这是测试邮件', '<p class="mes">' + mes + '</p>');
//     })
// }

// function loop(func, ...args) {
//     let interval = setInterval(() => {
//         typeof func == 'function' && func(...args).then((val) => {
//             reportLog(val, ...args);
//         });
//     }, (1000 * 60));
// }

// async function reportEvent(...args) {
//     await loop(countLog, ...args);
// }

// function reportHandler() {
//     for (let reportType in reportConfig) {
//         let {
//             name,
//             watch,
//             checktime,
//             reportDay = 1,
//             reportLimit,
//             emails
//         } = reportConfig[reportType];
//         if (watch == true) {
//             reportEvent(reportType, name, checktime, reportLimit, emails);
//         }
//     }
// }
function addDate(reportType, time){
    dateCache[reportType].push(time);
    if(dateCache[reportType].length > reportConfig[reportType].reportLimit){
        dateCache[reportType].shift();
    }
}

function countLog(reportType){
    let checktime = reportConfig[reportType]['checktime'];
    let dateList = dateCache[reportType];
    let lastDate = dateList[dateList.length - 1];
    let filterDate = dateList.filter((date)=>{
        return +date >= +lastDate - +checktime;
    });
    return filterDate.length;
}

function report(reportType, time){
    addDate(reportType,time);
    let count = countLog(reportType);
    let theme = reportConfig[reportType]['name'] + '报警通知';
    let html = `<p>${reportConfig[reportType]['name']}报障数超过${reportConfig[reportType]['reportLimit']}条</p>`;
    if(count >= reportConfig[reportType]['reportLimit']){
        let emails = reportConfig[reportType]['emails'];
        emails.forEach((item) => {
            sendMail(item, theme, html);
        });
    }
}

init();
export default report;