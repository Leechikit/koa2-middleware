export default (arrs)=>{
    let content = [];
    arrs.forEach((item)=>{
        let obj = item._doc;
        let date = new Date(obj.time);
        let dateStr = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
        content.push(`<tr>
                        <td>${dateStr}</td>
                        <td>${obj.reportType}</td>
                        <td>${obj.reportValue}</td>
                        <td>${obj.url}</td>
                        <td>${obj.appVersion}</td>
                        <td>${obj.phoneType == 1 ? 'IOS' : (obj.phoneType == 2 ? 'Android': 'other')}</td>
                    </tr>`);
    });
    content.unshift(`
        <tr>
            <th>时间</th>
            <th>上报id</th>
            <th>接口URL</th>
            <th>页面URL</th>
            <th>APP版本</th>
            <th>设备系统</th>
        </tr>
    `);
    let style = `
    <style>
        table{
            border-collapse:collapse;
        }
        table,th,td{
            border: 1px solid black;
        }
        th,td{
            padding: 0 10px;
        }
    </style>`
    return content.length > 1 ? style+'<table>'+content.join('')+'</table>' : null;
}