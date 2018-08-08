/**
 * Created by Administrator on 2018/8/6.
 */
var articleList = [];
var loading = false;
var lastArticleID = 0;
var loadNone = false;
var loadError = false;
var currentTab = null;

window.onload = function () {
    init();
    initTab();
};

function onSearchBlur() {
    console.log('取消输入,')
}

function onSearchFocus() {
    console.log('开始输入')
}

function init() {
    getCurrentTab();
    $(".infinite").infinite().on("infinite", function () {
        if (loading || loadNone) return;
        loading = true;
        loader('tab1-loadmore', true);
        var url = urls.articleList + '?last_article_id=' + lastArticleID;
        getData(url);
    });

    if (checkIsBackToThis()) {
        return;
    }
    $.showLoading();
    getData(urls.articleList);
}

function initTab() {

    var setCurrentSlide = function (ele, index) {
        $(".swiper1 .swiper-slide").removeClass("selected");
        ele.addClass("selected");
        //swiper1.initialSlide=index;
    }

    var swiper1 = new Swiper('.swiper1', {
//					设置slider容器能够同时显示的slides数量(carousel模式)。
//					可以设置为number或者 'auto'则自动根据slides的宽度来设定数量。
//					loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
        slidesPerView: 5.5,
        paginationClickable: true,//此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
        spaceBetween: 10,//slide之间的距离（单位px）。
        freeMode: true,//默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
        loop: false,//是否可循环
        onTab: function (swiper) {
            var n = swiper1.clickedIndex;
        }
    });
    swiper1.slides.each(function (index, val) {
        var ele = $(this);
        ele.on("click", function () {
            setCurrentSlide(ele, index);
            // swiper2.slideTo(index, 400, false);
            // tab自动滚动到大概居中的位置
            swiper1.slideTo(index - 2, 500, false);
            //mySwiper.initialSlide=index;
        });
    });

//     var swiper2 = new Swiper('.swiper2', {
//         //freeModeSticky  设置为true 滑动会自动贴合
//         direction: 'horizontal',//Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
//         loop: false,
// //					effect : 'fade',//淡入
//         //effect : 'cube',//方块
// //					effect : 'coverflow',//3D流
// //					effect : 'flip',//3D翻转
//         autoHeight: false,//自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化。
//         onSlideChangeEnd: function (swiper) {  //回调函数，swiper从一个slide过渡到另一个slide结束时执行。
//             var n = swiper.activeIndex;
//             setCurrentSlide($(".swiper1 .swiper-slide").eq(n), n);
//             swiper1.slideTo(n, 500, false);
//         }
//     });

}

function getCurrentTab() {
    var tabs = $(".weui-navbar__item");
    for (var i = 0; i < tabs.length; i++) {
        var tab = tabs.eq(i);
        if (tab.attr("class").match("on")) {
            currentTab = tab.attr("href");
            break;
        }
    }
    console.log(currentTab);
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
        setData(data);
    }).error(function (e) {
        loading = false;
        loadError = true;
        loader('tab1-loadmore', false);
        console.log(e);
    })

}

function setData(data) {
    // 加载成功
    loading = false;
    if (data.status === 1) {
        loadNone = false;
        var list = data.article_list;
        articleList = articleList.concat(list);
        saveDataToLocal(articleList);
        lastArticleID = data.last_article_id;
        var listHtml = [];
        for (let i = 0, len = list.length; i < len; i++) {
            listHtml.push(listTemp(list[i]));
        }
        $("#content1").append(listHtml);
        loader('tab1-loadmore', false);

    } else if (data.status === 0) { // 没有数据
        loadNone = true;
        loader('tab1-loadmore', false);
        loader('tab1-loadnone', true, `结束探索,海拔高度${articleList.length}000米`)
    } else {
        loadError = true;
    }
    $.hideLoading();

}


// 保存数据, 返回页面使用
function saveDataToLocal(list) {
    //头条页 搜索页articleSearch
    let obj = {};
    obj.last_article_id = lastArticleID;
    obj.article_list = list;
    obj.status = 1;
    sessionStorage.setItem('articleToutiao', JSON.stringify(obj));
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
    var currentHeight = $(currentTab).scrollTop();
    sessionStorage.setItem('currentHeight', currentHeight);
}

function listTemp(list) {
    return `
            <a class="item-content" onclick="onItemPress()" href="toutiaoDetail.html?articleID=${list.article_id}&articleTitle=${list.article_title}">
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