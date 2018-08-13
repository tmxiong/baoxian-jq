// var API_URL = 'http://bs.linlizone.com/';
const API_URL = 'http://hkds.yunxinsky.com/'

var urls = {
  // 文章列表
  articleList: API_URL + 'index.php/Index/Article/fetchArticleCrossDomain',
  // 文章详情
  articleDetail: API_URL + 'index.php/Index/Article/fetchArticleDetailCrossDomain',
  // 文章搜索
  // http://bs.linlizone.com/index.php/Index/OpenArticle/searchCrossDomain/keywords/%E4%BF%9D%E9%99%A9/pageIndex/0
  searchArticle: API_URL + '/index.php/Index/OpenArticle/searchCrossDomain/keywords/{keywords}/pageIndex/{pageIndex}'
};
