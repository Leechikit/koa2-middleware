const request = require('request');

module.exports = () => {
    return new Promise((resolve,reject)=>{
        let option = {
            url: 'http://www.yy.com/c/cont/video/listVideoById.action?id=14&pageSize=100',
            method: 'POST',
            json: true
        }
        request(option,(error,response,json)=>{
            if(!error&&response.statusCode == 200){
                if(json.result == 0){
                    resolve(json.data);
                }else{
                    reject(json.message);
                }
            }
        })
    });
}