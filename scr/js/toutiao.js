/**
 * Created by Administrator on 2018/8/6.
 */
var articleList = [];
var loading = false;
var lastArticleID = 0;
var loadNone = false;
var loadError = false;

window.onload = function () {
    init();
};



function init() {
    console.log(getDataFromLocal('articleToutiao'));

    $(".infinite").infinite().on("infinite", function() {
        if(loading || loadNone) return;
        loading = true;
        loader('tab1-loadmore',true);
        var url = urls.articleList+'?last_article_id='+lastArticleID;
        getData(url);
    });

    if(checkIsBackToThis()){
        return;
    }
    getData(urls.articleList);
}

function checkIsBackToThis() {
    var toutiaoData = getDataFromLocal('articleToutiao');
    var searchData = getDataFromLocal('articleSearch');
    var IsBackToThis = false;
    if(toutiaoData) {
        setHtml(toutiaoData);
        IsBackToThis = true;
    }
    if(searchData) {
        IsBackToThis = true;
    }
    console.log(IsBackToThis);
    return IsBackToThis;
}

function getData(url) {

    $.get(url,function(data) {
        setData(data);
    }).error(function(e){
        loading = false;
        loadError = true;
        loader('tab1-loadmore',false);
        console.log(e);
    })


}

function setData(data) {
    // 加载成功
    loading = false;
    if(data.status === 1) {
        loadNone = false;
        var list = data.article_list;
        articleList = articleList.concat(list);
        saveDataToLocal(articleList);
        lastArticleID = data.last_article_id;
        setHtml(articleList);

    }else if(data.status === 0) { // 没有数据
        loadNone = true;
        loader('tab1-loadmore',false);
        loader('tab1-loadnone',true,`结束探索,海拔高度${articleList.length}000米`)
    }else {
        loadError = true;
    }
}

function setHtml(list) {
    var listHtml = [];
    for(let i = 0,len = list.length; i < len; i++) {
        listHtml.push(listTemp(list[i]));
    }
    $("#content1").append(listHtml);
    loader('tab1-loadmore',false);
}

// 保存数据, 返回页面使用
function saveDataToLocal(data) {
    //头条页 搜索页articleSearch
    sessionStorage.setItem('articleToutiao',JSON.stringify(data));
}

function getDataFromLocal(key) {
    return JSON.parse(sessionStorage.getItem(key))
}

function loader(id ,isShow, text = null) {
    if(isShow) {
        if(text) {
            var ele = $(`#${id}`);
            ele.css("display","block");
            ele.children().eq(0).text(text);
        } else {
            $(`#${id}`).css("display","block");
        }

    } else {
        $(`#${id}`).css("display","none");
    }

}

function listTemp(list) {
    return `
            <a class="item-content" href="toutiaoDetail.html?articleID=${list.article_id}&articleTitle=${list.article_title}">
                <img class="item-img" alt="${list.article_title}" src="${list.article_pic_url}">
                <div class="item-right">
                    <span class="item-title">${list.article_title}</span>
                    <div class="item-counts">
                        <!--<svg class="item-icon">-->
                        <!--<use xlink:href="../assets/svgs.svg"/>-->
                        <!--</svg>-->
                        <span class="item-text">阅读:${list.article_browse_count}</span>

                        <!--<svg class="item-icon" style="margin-left:5px">-->
                        <!--<use xlink:href="../assets/svgs.svg"/>-->
                        <!--</svg>-->
                        <span class="item-text">分享:${list.article_share_count}</span>
                    </div>
                </div>
            </a>`
}