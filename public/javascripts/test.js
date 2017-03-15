const url = "/log/j.gif";

let getParam = (opt)=>{
    let obj = opt;
    var param = [];
    for( let h in obj){
        if(obj.hasOwnProperty(h)){
            param.push(encodeURIComponent(h)+"="+(obj[h] === void 0 || obj[h] === null ? "": encodeURIComponent(obj[h])));
        }
    }
    return param.join("&");
}

let reportEvent = (reportType,reportValue,appVersion,phoneType) => {
    let param = getParam({
        reportType,
        reportValue,
        appVersion,
        phoneType
    })
    let img = new Image();
    img.src =  url + "?" + param;
}

reportEvent(2,'http://apis.com/test2.action','6.0.0',2);