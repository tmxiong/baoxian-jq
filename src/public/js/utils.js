/**
 * Created by Administrator on 2018/8/6.
 */
function queryParams(key) {
    //http://localhost:63342/baoxian-jq/scr/toutiaoDetail.html?articleID=245458&articleTitle=%E4%BF%9D%E9%99%A9%E5%8D%81%E5%A4%A7%E5%BF%BD%E6%82%A0%E4%B9%8B%E4%BF%9D%E9%99%A9%E9%81%BF%E5%80%BA~
    let value = false;
    if(window.location.search === ""){
        return value;
    }
    let url = window.location.href;
    let params = url.split('?')[1].split('&');
    for(let i = 0; i < params.length; i++) {
        let param = params[i].split('=');
        if(param[0] === key) {
            value = param[1];
            break;
        }
    }
    return value;
}