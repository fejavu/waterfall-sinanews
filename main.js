
// top click
$(".top").on("click", function() {
$('html, body').animate({
  scrollTop: 0
}, 'slow');
return false;
});

var reqObj = {
  init: function() {
    var _this = this;
    _this.start();
    _this.bind(_this.scroll, 500);
    this.itemWidth = $(".item").outerWidth(true);
    this.ctWidth = $(".news-ct").width();
    this.colNum = Math.floor(this.ctWidth / this.itemWidth);
    this.colHeightArr = [];
    //     console.log(this.itemWidth);
    //     console.log(this.ctWidth);
    //     console.log(this.colNum);
    this.pageIdx = 1;
    this.itemsCount = 10;
    for (var i = 0; i < this.colNum; i++) {
      this.colHeightArr[i] = 0;
    }
    // _this.start();
  },

  start: function() {
    var _this = this;
    _this.getData(function(newslist) {
      $.each(newslist, function(idx, item) {
        var $node = _this.generateNode(item);
        $node.find("img").on('load', function() {
          $node.appendTo(".news-ct");
          //console.log($node.find(".item").outerHeight());
          // console.log($node.height());
          _this.waterFall($node);
        });
      });
    });
  },

  getData: function(callback) {
    var _this = this;
    console.log("getdata fun");
    console.log("pageindex: " + _this.pageIdx);
    $.ajax({
      url: "https://photo.sina.cn/aj/v2/index?cate=girl",
      dataType: 'jsonp',
      jsonp: "callback",
      data: {
        page: _this.pageIdx,
        pagesize: _this.itemsCount
      }
    }).done(function(result) {
      if (result && result.code == 1) {
        callback(result.data);
        _this.pageIdx++;
      } else {
        console.log("failed to get data");
      }
    });
  },

  generateNode: function(item) {

    var $node = $(`<a href="" class="link"target="_blank"><li class="item"><img src="" alt=""><h4></h4><div class="summary"></div></li></a>`);
    $node.attr('href', item.url);
    $node.find(".item img").attr('src', item.thumb);
    $node.find(".item h4").text(item.stitle);
    $node.find(".summary").text(item.title);
    console.log(item.url);
    // console.log($node);
    console.log($node.attr('href'));
    return $node;
  },

  waterFall: function($node) {
    // console.log("waterfall run");
    var _this = this;
    var minIdx = 0;
    var minHeight = _this.colHeightArr[0];
    for (var i = 0; i < _this.colHeightArr.length; i++) {
      if (_this.colHeightArr[i] < minHeight) {
        minHeight = _this.colHeightArr[i];
        minIdx = i;
      }
    }
    $node.css({
      top: minHeight,
      left: _this.itemWidth * minIdx
    });
    //    console.log(minIdx);   
    //    console.log(minHeight);
    //    console.log(_this.colHeightArr);   
    //    console.log($node.find(".item").outerHeight(true));

    _this.colHeightArr[minIdx] += $node.find(".item").outerHeight(true);
    $(".news-ct").height(Math.max.apply(null, _this.colHeightArr));
    //console.log("height"+$(".news-ct").height());
  },

  bind: function() {
    console.log("bind function");
    var _this = this;
    $(window).on('scroll', _this.debounce());
  },

  debounce: function() {
    var _this = this;
    var timer = null;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        if (_this.bottomShow()) {
          _this.start();
        }
      }, 500);
    };
  },

  bottomShow: function() {
    var eleHeight = $(".load-tag").offset().top + $(".news-ct").height();
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    return eleHeight < (scrollTop + windowHeight + 150);
  }
};

reqObj.init();