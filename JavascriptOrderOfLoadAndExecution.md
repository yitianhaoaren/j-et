# 一、在HTML中嵌入Javasript的方法 #

  1. 把Javascript代码直接放在`<script>`和`</script>`之间
  1. 由`<script />`标记的src属性引入外部的js文件
  1. 利用javascript本身的`document.write()`方法写入新的javascript代码
  1. 利用Ajax异步获取javascript代码，然后执行
  1. 放在事件处理程序中，比如：`<p onclick="alert('我是由onclick事件执行的Javascript')">点击我</p>`
  1. 作为URL的主体，这个URL使用特殊的`Javascript：`协议，比如：`<a href="javascript:alert('我是由javascript:协议执行的javascript')">点击我</a>`

> 注：最后两种方法写入的Javascript需要触发才能执行，所以除非特别设置，否则页面加载时不会执行。


# 二、Javascript在页面的执行顺序 #
页面上的Javascript代码是HTML文档的一部分，所以Javascript在页面装载时执行的顺序就是其引入标记`<script />`的出现顺序， `<script />`标记里面的或者通过src引入的外部JS，都是按照其语句出现的顺序执行，而且执行过程是文档装载的一部分。
每个脚本定义的全局变量和函数，都可以被后面执行的脚本所调用。
变量的调用，必须是前面已经声明，否则获取的变量值是undefined。
```
<script type="text/javscrpt">//<![CDATA[
alert(tmp); //输出 undefined
var tmp = 1;
alert(tmp); //输出 1
//]]></script>
```
同一段脚本，函数定义可以出现在函数调用的后面，但是如果是分别在两段代码，且函数调用在第一段代码中，则会报函数未定义错误。
```
<script type="text/javscrpt">//<![CDATA[
aa(); //浏览器报错
//]]></script>
<script type="text/javscrpt">//<![CDATA[
aa(); //输出 1
function aa(){alert(1);}
//]]></script>
```
`document.write()`会把输出写入到脚本文档所在的位置，浏览器解析完`documemt.write()`所在文档内容后，继续解析document.write()输出的内容，然后在继续解析HTML文档。

```
<script type="text/javascript">//<![CDATA[
document.write('<script type="text/javascript" src="test.js"><\/script>');
document.write('<script type="text/javascript">');
document.write('alert(2);')
document.write('alert("我是" + tmpStr);');
document.write('<\/script>');
//]]></script>
<script type="text/javascript">//<![CDATA[
alert(3);
//]]></script>
test.js的内容是：
var tmpStr = 1;
alert(tmpStr);
```
在Firefox和Opera中的弹出值的顺序是：1、2、我是1、3
在IE中弹出值的顺序是：2、1、3，同时浏览器报错：tmpStr未定义
原因可能是IE在document.write时，并未等待加载SRC中的Javascript代码完毕后，才执行下一行，所以导致2先弹出，并且执行到 `document.write(’document.write("我是" + tmpStr)’)`调用tmpStr时，tmpStr并未定义，从而报错。

解决这个问题，可以利用HTML解析是解析完一个HTML标签，再执行下一个的原理，把代码拆分来实现：
```
<script type="text/javascript">//<![CDATA[
document.write('<script type="text/javascript" src="test.js"><\/script>');
//]]></script>
<script type="text/javascript">//<![CDATA[
document.write('<script type="text/javascript">');
document.write('alert(2);')
document.write('alert("我是" + tmpStr);');
document.write('<\/script>');
//]]></script>
<script type="text/javascript">//<![CDATA[
alert(3);
//]]></script>
```
这样IE下和其他浏览器输出值的顺序都是一直的了：1、2、我是1、3。


# 三、如何改变Javascript在页面的执行顺序 #
## 1.利用onload ##
```
<script type="text/javascript">//<![CDATA[
window.onload = f;
function f(){alert(1);}
alert(2);
//]]></script>
```
输出值顺序是 2、1。

需要注意的是，如果存在多个winodws.onload的话，只有最有一个生效，解决这个办法是：

window.onload = function(){f();f1();f2();.....}
利用2级DOM事件类型
```
if(document.addEventListener){
window.addEventListener('load',f,false);
window.addEventListener('load',f1,false);
...
}else{
window.attachEvent('onload',f);
window.attachEvent('onload',f1);
...
}
```
IE中可以利用defer，defer作用是把代码加载下来，并不立即执行，等文档装载完毕之后再执行，有点类似window.onload，但是没有window.onload那样的局限性，可以重复使用，但是只在IE中有效，所以上面的例子可以修改成为
```
<script type="text/javascript">//<![CDATA[
document.write('<script type="text/javascript" src="test.js"><\/script>');
document.write('<script type="text/javascript" defer="defer">');
document.write('alert(2);')
document.write('alert("我是" + tmpStr);');
document.write('<\/script>');
//]]></script>
<script type="text/javascript">//<![CDATA[
alert(3);
//]]></script>
```
这样IE就不报错了，输出值的顺序变成：1、3、2、我是1

当 HTML解析器遇到一个脚本，它必须按常规终止对文档的解析并等待脚本执行。为了解决这个问题HTML4标准定义了defer。通过defer来提示浏览器可以继续解析HTML文档，并延迟执行脚本。这种延迟在脚本从外部文件载入时非常有用，让浏览器不必等待外部文件全部载入之后才继续执行，能有效的提高性能。IE是目前唯一支持defer属性的浏览器，但IE并没有正确的实现了defer属性，因为延迟的脚本总是被延迟，直到文档结束，而不是只延迟到下一个非延迟的脚本。这意味着，IE中延迟的脚本的执行顺序相当混乱，并且不能定义任何后面非延迟脚本并须的函数和变量。在IE中所有的defer的脚本执行时间应该都是HTML文档树建立以后，window.onload之前。

## 2.利用Ajax ##
因为xmlhttpRequest能判断外部文档加载的状态，所以能够改变代码的加载顺序。