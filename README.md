# waterfall-sinanews
## 懒加载机制和瀑布流结合
[预览链接](https://fejavu.github.io/waterfall-sinanews/index.html)
[预览链接](http://js.jirengu.com/vuwigitobu)

## 懒加载原理
懒加载的目的是为了加快对资源的请求，减少请求的时间，减少用户等待的时间，从而提高用户体验。
因此，除了提高网速，懒加载是减少不必要的请求，如未进入窗口视线的元素（图片，css等），不必进行加载，先用同一张图片进行代替，还有已经进行过加载的元素，不必再次加载。
```
// 懒加载核心代码
function lazyload() {
  $("img").not("[loaded]").each(function() {
    if(isShow($this)) {
      loadImg($(this));
    }
  })
}
```
## 瀑布流原理
瀑布流是将所有元素等宽，上下排列，每加载一个元素，将它插入多列等宽流中高度最低的一个。因此有两个关键点：1. 元素等宽。 2. 找到每次高度最低的一列。
```
function waterFall ($item) {
  var minIndex = 0;  // 最小高度数值
  var minHeight = 0;  // 最小高度
  var heightArr = [];  // 存储每列的高度
  var colCount;  // 瀑布流列数
  for(var i=0;i<heightArr.length;i++) {
    if(minHeight > heightArr[i]) {
      mingHeight = heightArr[i];
      minIndex = i;
    }
  }
  $item.css({
    top: minHeight,
    left: minIndex * itemWidth
  });  // 利用绝对定位，高度和宽度放置元素。
  heightArr[minIndex]  += $item.outerHeight(true); // 刚放置元素的高度等于之前的高度加刚加上的元素的高度
}
```
## 实现原理
1. 在初始化时，放松一次请求，先进行一次加载。
2. 利用瀑布流的形式，放置已加载的新闻图片流。
3. 当用户滚动到已加载元素底部时，重复 第1步、第2步。

核心代码：
```
function init() {
  start();

  $(window).on('scroll', function() {
    if(isBottom()) {
      start();
    } 
  });
}
init();
```
细节实现代码：
```
function start() {
  getData(function(data) {
    var $node = generateData(data);
    waterfall($node);
  });
}

function getData(callback) {
  $.ajax();
  callback(data);
}

function generateData(data) {
  // do something to data
  return $node
}

function waterfall($node) {
  // calculate the minHeight and minIndex;
  $node.css({
    top: minHeight,
    left: minIndex * itemWidth
  });
}

function bind() {
  $(window).on('scroll', function() {
    if(isBottom()) {
      start();
    }
  });
}

function isBottom() {
  return element.offset().top < $(window).scrollTop() + $(window).height();
}

```