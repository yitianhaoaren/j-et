# Introduction #
from:
http://www.cnblogs.com/yslow/archive/2009/04/28/1445597.html

最近我的工作都是围绕异步加载外部脚本(loading external scripts asynchronously) 展开。当外部脚本以普通方式加载时(`<script src="...">`) 会阻塞页面内所有其它资源的下载和脚本下方元素的渲染.你可以查看将脚本放在底部(Put Scripts at the Bottom)的样例的效果. 异步加载脚本会避免阻塞行为进而更快的加载页面.

异步加载脚本产生的问题是内嵌脚本使用外部脚本中定义的符号的问题. 如果内嵌脚本使用了异步加载的外部脚本符号，竞争条件下可能会导致未定义的符号错误。因此有必要保证异步脚本和内嵌脚本以下面方式进行耦合：在异步脚本下载完毕之前内嵌脚本不能被执行。

下面有几种方式耦合异步脚本.
window’s onload - 内嵌脚本可以尝试使用窗口的onload事件. 实现起来非常简单，但是内嵌脚本不会尽可能早的执行.
script’s onreadystatechange - 内嵌脚本可以尝试使用脚本的onreadystatechange和onload 事件(在所有流行的浏览器里面均需要你自己来实现) 代码比较长而复杂，但是可以确保在脚本下载完毕之后马上执行内嵌脚本.
hardcoded callback - 外部脚本可以修改为通过一个回调函数(callback function)来明确的调用内嵌脚本，如果外部脚本和内嵌脚本是一个团队开发的话，这样是没有问题的，但如果使用第3方的脚本，这就提供不了必要的灵活性。
在这个博客帖子里我讨论两个问题: 如何使用异步脚本加快页面,如何通过Degrading Script Tags模式耦合外部脚本和内嵌脚本. 我通过我最近刚刚完成的一个项目UA Profiler results sortable图表来演示. 我还使用了Stuart Langridge的 sorttable排序脚本. 把他的脚本增加到我的页面并排序结果耗费了我大约5分钟.通过增加一点使用异步脚本和耦合脚本的工作量我可以使这个页面提高30%的加载速度

普通Script标记
最初我使用普通的方法(`<script src="...">`)将Stuart Langridge的sorttable排序脚本加入到UA Profiler, 例子见Normal Script Tag. HTTP瀑布图见图1.


图1: 普通Script标记的瀑布图

表格排序工作正常，但由于它使页面慢了许多，我并不满意. 图1中我们可以看到脚本(sorttable-async.js)阻塞了页面内唯一的后继HTTP请求(arrow-right- 20X9.gif), 造成页面加载变慢. 瀑布图是使用Firebug 1.3 beta来产生的(你也可以使用httpwatch或基调网络的webwatch工具来查看效果)。 新版本的Firebug在onload事件发生的地方标记了一条红竖线. (蓝竖线是DOMContentLoaded事件.) 对于普通Script标记 来说, onload 事件在第487毫秒产生.

异步加载脚本
对初始页面渲染来说，脚本sorttable-async.js是没有必要的 - 表格被渲染之后才会排序. 这种情况(外部脚本不会被初始页面使用)是可以使用异步脚本加载的主要特征 . 例子异步加载脚本 使用DOM方式异步加载:
```
var script = document.createElement('script');
script.src = "sorttable-async.js";
script.text = "sorttable.init()"; // 这会在下面解释
document.getElementsByTagName('head')[0].appendChild(script);
```
异步加载脚本的HTTP瀑布图见图2。注意我是如何使用异步加载技术来避免阻塞行为的 - sorttable-async.js和arrow-right-20×9.gif 被同时下载. onload时间为429毫秒.


图2: 异步加载脚本的HTTP瀑布图

John Resig介绍的 Degrading Script Tags 模式
例子异步加载脚本使页面加载更快了，但仍旧有进一步提高的空间. 默认sorttable排序是通过在onload事件中增加sorttable.init()来触发。当外部脚本被加载完毕后内嵌脚本立即调用sorttable.init()能进一步提升性能. 在这种情况下,我使用的API仅仅是一个函数，但是我将尝试一个足够灵活的模式来支持更复杂的情况。

前面我列出了各种内嵌脚本和外部异步脚本耦合的方法: window’s onload, script’s onreadystatechange, 和 hardcoded callback. 这里,我使用了来自John Resig的被称为Degrading Script Tags模式的技术。 John描述了如何耦合一个内嵌脚本和外部脚本，例如:
```
<script src="jquery.js">
jQuery("p").addClass("pretty");
</script>
```
他提到的这个方法是使内联脚本在外部脚本下载完毕之后才开始执行。使用这种方式耦合内嵌脚本和外部脚本有几个好处:

更简单 - 将2个script标记替换为1个script标记
更清晰 - 内嵌代码依赖于外部脚本的关系更为明显
更安全 - 如果外部脚本下载失败，内嵌脚本就不会执行，避免抛出未定义的符号错误
当使用异步加载外部脚本时这也是一个很棒的模式。为了使用这个技术，我必须修改我的内嵌代码和外部脚本. 对于内嵌代码, 我增加了第3行来设置 script.text的属性. 为了耦合代码, 我在sorttable-async.js末尾增加了如下代码:
```
var scripts = document.getElementsByTagName("script");
var cntr = scripts.length;
while ( cntr ) {
var curScript = scripts[cntr-1];
if ( -1 != curScript.src.indexOf('sorttable-async.js') ) {
eval( curScript.innerHTML );
break;
}
cntr--;
}
```
此代码遍历网页的所有脚本，直到它找到脚本块本身 (此时脚本的src属性包含sorttable-async.js)，然后利用eval将代码(sorttable.init ())增加到脚本触发运行. (备注:虽然内嵌代码使用text属性增加代码内容，但是需要使用innerHTML获取代码. 这是代码跨浏览器工作的必要保证) 经过这样的优化，外部脚本不会阻塞其它资源的下载，同时，内嵌代码也会尽可能早的执行.

延迟加载
通过延迟加载能更快的加载页面 (通过onload事件动态加载). 例如 Lazyload 是在onload 事件中包含如下代码:
```
window.onload = function() {
var script = document.createElement('script');
script.src = "sorttable-async.js";
script.text = "sorttable.init()";
document.getElementsByTagName('head')[0].appendChild(script);
}
```
这种情况绝对需要脚本耦合技术，在onload事件里面的代码sorttable.init()不会被执行，因为此时onload事件已经发生,而sorttable-async.js还没被下载。延迟加载的好处是使onload事件更快的发生，见图3。红竖线表明onload事件发生在第320毫秒.


图3: 延迟加载的HTTP瀑布图

结论
通过避免通常的阻塞行为，异步加载脚本和延迟加载脚本可以提高网页的加载时间. 下面是增加不同版本的sorttable排序例子代码：

> 普通Script标记 - 487毫秒
> 异步加载 - 429 毫秒
> 延迟加载 - ~320 毫秒
以上时间指的是onload事件发生的时间。