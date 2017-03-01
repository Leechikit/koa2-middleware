const url = "/log/j.gif";

let getParam = (opt)=>{
    let obj = opt;
    var param = [];
    obj.time = parseInt(1 * new Date() / 1000);
    for( let h in obj){
        if(obj.hasOwnProperty(h)){
            param.push(encodeURIComponent(h)+"="+(obj[h] === void 0 || obj[h] === null ? "": encodeURIComponent(obj[h])));
        }
    }
    return param.join("&");
}

let reportEvent = (eventid,desc,bak1) => {
    let param = getParam({
        eventid,
        desc,
        bak1
    })
    let img = new Image();
    img.src =  url + "?" + param;
}

reportEvent(18000,'服务器连接错误');