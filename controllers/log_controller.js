const request = require('request');

module.exports = ()=>{
    return new Promise((resolve,reject)=>{
        let option = {
            url: 'http://127.0.0.1:3001/images/j.gif',
            method: 'GET'
        }
        request(option,(error,response,json)=>{
            if(!error&&response.statusCode == 200){
                resolve(response);
            }
        })
    });
}