/**
 * Created by Administrator on 2018/8/6.
 */
var articleList = [];
var loading = false;
var page = 0;
var keyWords = "";
var loadNone = false;
var loadError = false;

window.onload = function () {
    init();

};


function init() {
    $(".infinite").infinite().on("infinite", function () {
        if (loading || loadNone) return;
        loading = true;
        loader('tab1-loadmore', true);
        page ++;
        var url = getSearchUrl(keyWords);
        getData(url);
        //getData(url);
    });

    // 热门搜索词的点击事件
    $(".notice-item").click(function () {
        $.showLoading();
        var text = $(this).text();
        onSubmit(text);
    });

    // if (checkIsBackToThis()) {
    //     return;
    // }
    // $.showLoading();
    // getData(urls.articleList);
}

function onSubmit(value) {
    $("#content1").empty();
    page = 0;
    var input = $("#searchInput");
    input.blur();
    if(!value) { // 从搜索栏输入的
        value = input.val();
        $.showLoading();
    }
    keyWords = value;

    var url = getSearchUrl(value);
    $(".notice-container").css("display",'none');
    $(".article-container").css("display",'block');
    getData(url);
}

function getSearchUrl(keyWords) {
    return urls.searchArticle.replace('{keywords}',keyWords).replace('{pageIndex}',page);
}

// 是否从详情页返回此页的
function checkIsBackToThis() {
    var toutiaoData = getDataFromLocal('articleToutiao');
    var searchData = getDataFromLocal('articleSearch');
    var IsBackToThis = false;
    if (toutiaoData) {
        setData(toutiaoData);
        var currentHeight = sessionStorage.getItem('currentHeight');
        $(currentTab).scrollTop(currentHeight);
        IsBackToThis = true;
    }
    if (searchData) {
        IsBackToThis = true;
    }
    // console.log(IsBackToThis);
    return IsBackToThis;
}

function getData(url) {

    $.get(url, function (data) {
        data = JSON.parse(data);
        setData(data);
        $.hideLoading();
    }).error(function (e) {
        page --;
        loading = false;
        loadError = true;
        loader('tab1-loadmore', false);
        $.hideLoading();
    })

}

function setData(data) {
    console.log(data);
    // 加载成功
    loading = false;
    if (data.error_code === 0) {
        if(data.data.length === 0) {
            loadNone = true;
            loader('tab1-loadmore', false);
            loader('tab1-loadnone', true, `结束探索,海拔高度${articleList.length}000米`)
        }else {
            loadNone = false;
            var list = data.data;
            articleList = articleList.concat(list);
            saveDataToLocal(articleList);
            lastArticleID = data.last_article_id;
            var listHtml = [];
            for (let i = 0, len = list.length; i < len; i++) {
                listHtml.push(listTemp(list[i]));
            }
            $("#content1").append(listHtml);
            loader('tab1-loadmore', false);
        }

    } else {
        loadError = true;
        page --
    }
    $.hideLoading();

}


// 保存数据, 返回页面使用
function saveDataToLocal(list) {
    //头条页 搜索页articleSearch
    let obj = {};
    //obj.last_article_id = lastArticleID;
    obj.page = page;
    obj.article_list = list;
    obj.error_code = 0;
    sessionStorage.setItem('articleSearch', JSON.stringify(obj));
}

function getDataFromLocal(key) {
    return JSON.parse(sessionStorage.getItem(key))
}

function loader(id, isShow, text = null) {
    if (isShow) {
        if (text) {
            var ele = $(`#${id}`);
            ele.css("display", "block");
            ele.children().eq(0).text(text);
        } else {
            $(`#${id}`).css("display", "block");
        }

    } else {
        $(`#${id}`).css("display", "none");
    }

}

function onItemPress() {
    // var currentHeight = $(currentTab).scrollTop();
    // sessionStorage.setItem('currentHeight', currentHeight);
}

function listTemp(list) {
    return `
            <a class="item-content" onclick="onItemPress()" href="articleDetail.html?articleID=${list.article_id}&articleTitle=${list.article_title}">
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