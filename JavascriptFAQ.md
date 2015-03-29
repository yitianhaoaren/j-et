### 1.造成IE浏览器发生Stack Overflow错误的可能原因 ###

  1. IE缓存满了，无法写入。解决办法：清空缓存目录
  1. 重复引用相同的Javascript文件。解决办法：去掉重复的文件
  1. 无退出条件的递归和循环。解决办法：检查代码
  1. 欢迎补充


### 2.javascript中存在几种对URL字符串进行编码的方法 ###
　　javascript中存在几种对URL字符串进行编码的方法：escape()，encodeURI()，以及encodeURIComponent()。这几种编码所起的作用各不相同。
  * **escape() 方法：**

　　采用ISO Latin字符集对指定的字符串进行编码。所有的空格符、标点符号、特殊字符以及其他非ASCII字符都将被转化成%xx格式的字符编码（xx等于该字符在字符集表里面的编码的16进制数字）。比如，空格符对应的编码是%20。

　　不会被此方法编码的字符： @ **/ +**

  * **encodeURI() 方法：**

　　把URI字符串采用UTF-8编码格式转化成escape格式的字符串。

　　不会被此方法编码的字符：! @ # $& **( ) = : / ; ? + ’**

  * **encodeURIComponent() 方法：**

　　把URI字符串采用UTF-8编码格式转化成escape格式的字符串。与encodeURI()相比，这个方法将对更多的字符进行编码，比如 / 等字符。所以如果字符串里面包含了URI的几个部分的话，不能用这个方法来进行编码，否则 / 字符被编码之后URL将显示错误。

　　不会被此方法编码的字符：! **( ) ’**

　　因此，对于中文字符串来说，如果不希望把字符串编码格式转化成UTF-8格式的（比如原页面和目标页面的charset是一致的时候），只需要使用escape。如果你的页面是GB2312或者其他的编码，而接受参数的页面是UTF-8编码的，就要采用encodeURI或者encodeURIComponent。

　　另外，encodeURI/encodeURIComponent是在javascript1.5之后引进的，escape则在javascript1.0版本就有。



### 3.删除加载js文件的scrip节点后，该js文件里面的函数还可以用吗？ ###

　　先来看段代码，如下：
```
<mce:script type="text/javascript" id="scriptNode" src="test.js" mce_src="test.js"></mce:script>  
<mce:script type="text/javascript"  
<!--  
alert(window.test);  
test();  
//--></mce:script>  
```

　　代码很简单，通过script加载一个js文件：test.js，该js文件里面只有简单的一个函数：
```
funnction test() {  
    alert('test called');  
};  
```

　　在IE6下执行的结果：首先alert出该test函数的内容，然后执行test()函数，而该函数输出'test called';

现在我们添加代码，把加载test.js文件的script节点删除，然后继续调用test()函数，如下：
```
<mce:script type="text/javascript" id="scriptNode" src="test.js" mce_src="test.js"></mce:script>  
<mce:script type="text/javascript"><!--  
alert(window.test);  
test();  

  
//删除加载test.js文件的script节点  
var script = document.getElementById('scriptNode');  
document.body.removeChild(script);  
  
//确保已经删除，alert 出null  
script = document.getElementById('scriptNode');  
alert(script);  
  
//继续调用test函数  
test();  
// --></mce:script>  
```

　　执行的结果我们发现，即使加载test.js文件的script节点已经删除，但它里面的函数还是可以继续调用的，并没有提示函数没定义的错误。

原因分析：

　　关键点是区分函数调用和dom节点之间的关系，HTMLDocument中的script节点的作用主要是在于用来加载对应的脚本文件，就是这里的test.js，一旦加载完毕，它就大功告成了，但js引擎对加载到dom中来的脚本会进行解释，而不是简单的文本堆积，js脚本引擎会解析test.js里面的语句并且创建对应的作用域和各个函数对象等，对这个例子来说，一旦加载完毕，我们可以发现js引擎已经创建了一个function obj，并且作为window对象的一个属性，此时已经跟script本身的dom节点已经没有关系了，通过下面的代码我们可以发现：


```
<mce:script type="text/javascript" id="scriptNode" src="test.js" mce_src="test.js"></mce:script>  
<mce:script type="text/javascript"><!--  
alert(window.test);  
test();  
  
//删除加载test.js文件的script节点  
var script = document.getElementById('scriptNode');  
document.body.removeChild(script);  
  
//确保已经删除，alert 出null  
script = document.getElementById('scriptNode');  
alert(script);  
  
//继续调用test函数  
test();  
  
//已经是window的一个属性了  
alert(window.test);  
// --></mce:script>  
```

　　若此时，我们再执行下面的代码，则可以删除对应的函数对象：
```
    delete window.test;

　　//再次调用，提示对象不支持此操作的错误，说明函数对象已经移除
    window.test();
```

小结：

　　通过这个例子，我们可以发现，后续的通过动态创建script脚本进行动态加载js文件或者请求json数据，一旦确定加载完毕，我们可以在对于的回调函数里面移除对应的script节点，防止dom的结构越来越庞大，同时加载成功的js函数我们仍然可以后续继续调用，因为里面的函数和变量均已经attach到window对象了。


### 4.探索javascript中函数的执行顺序 ###

> 先来第一段测试代码，如下所示：
测试代码一：
```
view plaincopy to clipboardprint?
<script language="JavaScript">  
<!--  
function myFn(){  
    alert('Fn1');  
};  
  
myFn();  
  
function myFn(){  
    alert('Fn2');  
};  
  
myFn();  
// -->  
</script>  
```
> > 代码很简单，定义两个同名的函数myFn，然后在不同的地方调用该函数，但执行的结果却出人意料,
两次输出的结果都是Fn2，而不是我们认为的第一次输出Fn1，第二次输出Fn2。具体原因这里先不说，接

下来我们继续测试，看第二段测试代码：
测试代码二：
```
view plaincopy to clipboardprint?
<script type="text/javascript">  
<!--  
function myFn(){  
    alert('Fn1');  
};  
  
myFn();  
// --></mce:script>  
<mce:script type="text/javascript"><!--  
function myFn(){  
    alert('Fn2');  
};  
  
myFn();  
// -->  
</script>  
```

> 这里可能大家认为输出结果跟上次的一样，错了，这次第一次输出Fn1，第二次输出Fn2.继续测试，
测试代码三：
```
view plaincopy to clipboardprint?
<script language="JavaScript">  
<!--  
var myFn = function(){alert('Fn1');};  
myFn();  
myFn = function(){alert('Fn2');};  
myFn();  
// -->  
</script>  
```
> 这次输出的结果是Fn1,Fn2.

测试代码四：
```
view plaincopy to clipboardprint?
<script language="JavaScript">  
<!--  
function myFn(){alert('Fn1');};  
myFn();  
  
myFn = function (){alert('Fn2');};  
myFn();  
// -->  
</script>  
```
> 输出Fn1,Fn2.

测试代码五：
```

<script language="JavaScript">  
<!--  
var myFn = function(){alert('Fn1');};  
myFn();  
function myFn(){alert('Fn2');};  
myFn();  
// -->  
</script>  
```
输出Fn1, Fn1

测试代码六：

```
<script language="JavaScript">  
<!--  
myFn();  
var myFn = function(){alert('Fn1');};  
myFn();  
  
function myFn(){alert('Fn2');};  
myFn();  
// -->  
</script>  
```
输出结果是Fn2,Fn1,Fn1

测试代码七：

```
<script language="JavaScript">  
<!--  
myFn();  
function myFn(){alert('Fn1');};  
// -->  
</script>  
```
输出Fn1,而不是未定义的函数

测试代码八：

```
<script language="JavaScript">  
<!--  
myFn();  
var myFn = function(){alert('Fn1');};  
// -->  
</script>  
```
则提示缺少对象，也就是函数没定义。

测试代码九：

```
<script language="JavaScript">  
<!--  
myFn();  
// -->  
</script>  
<script type="text/javascript">  
<!--  
function myFn(){alert('Fn1');};  
// -->  
</script>  
```
则提示缺少对象，也就是函数没定义。

> 从上面的测试例子中，我们可以发现javascript具有类似“预编译”（或者有人称为“预解释”）的特点，从这点看，javascript确实有点像传统的编译型语言，比如c,c++等。但javascript跟这种语言又有根本上的区别，在javascript中，这种预编译的特性并不是对所有的js代码进行的，从上面的测试例子中，我们可以发现，把myFn的定义分别放到不同的script块中进行调用的时候，就会提示对象未定义，从这点看，javascript的“预编译”特性只是对属于同一块(即包含在同一个`<script></script>`块)中的代码有效。
> 其实，在javascript的执行过程中，js引擎扫描每一script块的代码，把里面的各种函数定义都抽出
来进行“预编译”，注意，这里说的是函数定义而不是函数赋值，或者说是定义式的函数，那什么是定
义式的函数呢，如下的形式就是：
```
function myFn(){
 //Code goes here
};
```
编译完成后，就根据script块中的语句从上到下，从左到右进行执行。根据这样的解释，上面输出的各

种结果也就很清楚了。
测试代码一：
首先js引擎扫描该script块中的函数定义（注意这个时候还没开始执行代码），发现有定义式函数

function myFn(){}有两处，由于名字是一样的，编译后就合成了一个myFn函数，后面的定义覆盖了前面

的定义，所以在函数执行之前就只有一个编译的函数myFn,并且其定义是后面的那个，因此真正到执行代

码的时候，也就是第一次调用myFn(),输出的当然是Fn2,第二次执行myFn同样输出Fn2.

测试代码二：
由于javascript的块编译特性，因此分成在不同的块中的代码是分开编译的，所以第一个script块编译

后的myFn函数并没有被第二块的myFn覆盖，因此第一个执行myFn输出的是Fn1,同样第二块输出的是Fn2.
需要重点指出的是var myFn = function(){};不是定义式函数声明，而是赋值语句，把一个函数对象赋

值给一个变量，赋值语句的执行时机晚于编译时刻，定义式函数是在执行语句之前就完成了的，而赋值

语句要到执行的时候才进行。通过这样的说明，就可以很清楚的解释
测试代码七为什么不是提示函数未定义，而是输出Fn1,而测试代码八则提示对象未定义的原因了，因为

测试代码在执行myFn之前，已经优先执行了定义式函数的编译，也就是说，myFn已经是一个定义了的函

数，因此到执行时候当然能够正常执行，而测试代码并没有定义式函数，在执行代码之前是没有任何已

经编译好的函数定义的，而到执行myFn()的时候当然提示函数没定义，接下来才执行函数赋值，把一个

函数赋值给一个myFn变量，这时候如果调用myFn就可以了。


### 5.IE下，恒比较(===)的一些问题 ###
在IE下，请执行如下测试代码：

```
<mce:script language="JavaScript"><!--  
alert(window == window.self);  //1  
alert(window === window.self); //2  
alert(window==window.top);     //3  
alert(window===window.top);    //4  
  
  
var obj1 = {};  
var obj2 = new Object();  
alert(obj1==obj2);   //5  
alert(obj1===obj2);  //6  
// --></mce:script>  
```
执行结果：

IE下上面的执行结果是：第1行和第3行为true，其他的都是fasle。

Chrome，FF，Opera和Safaric执行的结果是：第1，2，3，4行均是true，第5，6行是false.

原因分析：

> 我们知道在js中,恒等比较（===）除了不进行类型转换外还要求必须比较的两个对象类型相同，这种情况下，第5和6行的结果是false是正常的，因为比较的两个对象虽然类型一样，但其实是两个独立的内存对象，内部的地址是不一样的，他们相同的只是语义上的相等。

> 第1到第4行的比较在IE下比较怪异，也许是实现的不同导致的，难道是window和window.top，window,self的内部对象地址不一样？IE为了防止对象地址引用自己导致的“死循环”而特意对window和window.self进行区分（比如特意增加一个地址offset等），===的比较却是基于这样的一个地址比较而不是语义上的比较来实现的？这些都是笔者的一个猜测，具体原因除了看IE源代码估计没人能够搞清楚。


### 6.eval和函数执行的效率比较 ###
测试代码如下：

```
function testSpeed(){  
    for(var i=0; i<100000; i++){  
        $('oHref');  
    }  
};  
  
var begTime1 = new Date();  
testSpeed();  
var endTime1 = new Date();  
  
  
var begTime = new Date();  
eval('testSpeed();');  
var endTime = new Date();  
$('divShow').innerHTML = ("time1:"+(endTime1-begTime1)+",time2:"+(endTime-begTime));  
```
> 很简单的逻辑，testSpeed是循环执行100w次从dom中获取id=oHref的a对象，分别用之间函数调用和eval的方式执行，测试的结果如下：

IE6下：

> 两者的执行效率没有明显的差别，基本上都属于比较慢，下面是测试7次的各花的时间（单位是ms）
```
time1:8703,time2:8782
time1:10094,time2:10078
time1:9984,time2:10219
time1:9891,time2:10109
time1:9671,time2:9829
time1:10031,time2:10281
time1:10093,time2:10563
```

Firefox3.0.13的环境下：
```
time1:1550，time2:8105

time1:1687，time2:9215

time1:1764，time2:8499

time1:1667，time2:8216

time1:1518，time2:8586

time1:1756，time2:9003

time1:1575，time2:9040
```

> 可以看出，在firefox下，之间函数调用的效率基本上比eval方式快5倍，另外从这里也可以看出firefox在dom element query的性能明显比IE好得多。


### 7.Javascript触发A标记的点击事件 ###

问题：有一个列表，每一个条目都是这篇文章的部分内容，类似这样：
```
<div class="list">
 
<div class ="item">
第一篇文章
</div>
 
<div class ="item">
第二篇文章
</div>
.....
</div>
```
而且在每个条目的div的右上角都有一个“评论”链接，点击就会展开所有的评论，并且显示评论框，这个链接的形式如下：
```
<a class="comment-mod" href="#">评论</a>
```
如果用户直接查看文章列表，那么所有的评论以及评论框都是不显示的，但是如果用户通过别的页面比如首页的个人动态直接定位到这篇日志，那么评论就应该全部显示。而列表页和查看单个条目的页面是同一个页面，这就要求我判断一下用户是否定位到该篇日志，如果是，就通过JS来触发 A 标签的点击事件。
一开始我尝试了一些方法，想当然地以为 A 标签和按钮一样是有 onclick() 事件的，结果发现没有，后来从网上搜了一些资料之后，成功解决了这个问题<sup>_</sup> 。解决办法是针对 IE 和 FF编写不同的逻辑，部分代码如下：
```
var comment = document.getElementsByTagName('a')[0];
 
if (document.all) {
 // For IE 
 
comment.click();
} else if (document.createEvent) {
   //FOR DOM2
 
var ev = document.createEvent('HTMLEvents');
 ev.initEvent('click', false, true);
 comment.dispatchEvent(ev);
}

```

上面的代码在IE6, IE7 和 FireFox 3 下通过测试。
一点学习心得，记录在此。
参考资料：http://ued.koubei.com/?p=400



### 8.JavaScript 在各个浏览器中执行的耐性 ###

经常会遇到这样一个情况：浏览器弹出对话框，提示:

脚本运行时间过长，询问“停止”还是“继续”。

那究竟各个浏览器是如何判断在什么时候才弹出此对话框呢？

  1. IE：执行超过500W条JScript引擎语句出现提示。
  1. Firefox：执行超过10秒出现提示。
  1. Safari：执行超过5秒出现提示。
  1. Opera：无论执行多久都不会出现提示，最有耐性。
  1. Chrome：执行超过约8秒（估计值）出现提示。

注：当弹出类似alert的模式对话框的时候，是不计时。

扩展阅读：
《What determines that a script is long-running?》