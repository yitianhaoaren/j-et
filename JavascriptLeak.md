原文: http://www.ibm.com/developerworks/cn/web/wa-memleak/

# Introduction #

如果您知道内存泄漏的起因，那么在 JavaScript 中进行相应的防范就应该相当容易。在这篇文章中，作者 Kiran Sundar 和 Abhijeet Bhattacharya 将带您亲历 JavaScript 中的循环引用的全部基本知识，向您介绍为何它们会在某些浏览器中产生问题，尤其是在结合了闭包的情况下。在了解了您应该引起注意的常见内存泄漏模式之后，您还将学到应对这些泄漏的诸多方法。
JavaScript 是用来向 Web 页面添加动态内容的一种功能强大的脚本语言。它尤其特别有助于一些日常任务，比如验证密码和创建动态菜单组件。JavaScript 易学易用，但却很容易在某些浏览器中引起内存的泄漏。在这个介绍性的文章中，我们解释了 JavaScript 中的泄漏由何引起，展示了常见的内存泄漏模式，并介绍了如何应对它们。

注意本文假设您已经非常熟悉使用 JavaScript 和 DOM 元素来开发 Web 应用程序。本文尤其适合使用 JavaScript 进行 Web 应用程序开发的开发人员，也可供有兴趣创建 Web 应用程序的客户提供浏览器支持以及负责浏览器故障排除的人员参考。

JavaScript 中的内存泄漏

JavaScript 是一种垃圾收集式语言，这就是说，内存是根据对象的创建分配给该对象的，并会在没有对该对象的引用时由浏览器收回。JavaScript 的垃圾收集机制本身并没有问题，但浏览器在为 DOM 对象分配和恢复内存的方式上却有些出入。

Internet Explorer 和 Mozilla Firefox 均使用引用计数来为 DOM 对象处理内存。在引用计数系统，每个所引用的对象都会保留一个计数，以获悉有多少对象正在引用它。如果计数为零，该对象就会被销毁，其占用的内存也会返回给堆。虽然这种解决方案总的来说还算有效，但在循环引用方面却存在一些盲点。

循环引用的问题何在？


当两个对象互相引用时，就构成了循环引用，其中每个对象的引用计数值都被赋 1。在纯垃圾收集系统中，循环引用问题不大：若涉及到的两个对象中的一个对象被任何其他对象引用，那么这两个对象都将被垃圾收集。而在引用计数系统，这两个对象都不能被销毁，原因是引用计数永远不能为零。在同时使用了垃圾收集和引用计数的混合系统中，将会发生泄漏，因为系统不能正确识别循环引用。在这种情况下，DOM 对象和 JavaScript 对象均不能被销毁。清单 1 显示了在 JavaScript 对象和 DOM 对象间存在的一个循环引用。


清单 1. 循环引用导致了内存泄漏


&lt;html&gt;


> 

&lt;body&gt;


> 

&lt;script type="text/javascript"&gt;


> document.write("circular references between JavaScript and DOM!");
> var obj;
> window.onload = function(){
> obj=document.getElementById("DivElement");
> > document.getElementById("DivElement").expandoProperty=obj;
> > obj.bigString=new Array(1000).join(new Array(2000).join("XXXXX"));
> > };
> > 

&lt;/script&gt;


> > <div>Div Element</div>
> > 

&lt;/body&gt;


> > 

&lt;/html&gt;



如上述清单中所示，JavaScript 对象 obj 拥有到 DOM 对象的引用，表示为 DivElement?。而 DOM 对象则有到此 JavaScript 对象的引用，由 expandoProperty 表示。可见，JavaScript 对象和 DOM 对象间就产生了一个循环引用。由于 DOM 对象是通过引用计数管理的，所以两个对象将都不能销毁。

另一种内存泄漏模式


在清单 2 中，通过调用外部函数 myFunction 创建循环引用。同样，JavaScript 对象和 DOM 对象间的循环引用也会导致内存泄漏。


清单 2. 由外部函数调用引起的内存泄漏


&lt;html&gt;



> 

&lt;head&gt;


> 

&lt;script type="text/javascript"&gt;


> document.write(" object s between JavaScript and DOM!");
> function myFunction(element)
> {
> > this.elementReference = element;
> > // This code forms a circular reference here
> > //by DOM-->JS-->DOM
> > element.expandoProperty = this;

> }
> function Leak() {
> > //This code will leak
> > new myFunction(document.getElementById("myDiv"));

> }
> 

&lt;/script&gt;


> 

&lt;/head&gt;


> 

&lt;body onload="Leak()"&gt;


> <div></div>
> 

&lt;/body&gt;


> 

&lt;/html&gt;



正如这两个代码示例所示，循环引用很容易创建。在 JavaScript 最为方便的编程结构之一：闭包中，循环引用尤其突出。
JavaScript 中的闭包

JavaScript 的过人之处在于它允许函数嵌套。一个嵌套的内部函数可以继承外部函数的参数和变量，并由该外部函数私有。清单 3 显示了内部函数的一个示例。


清单 3. 一个内部函数
function parentFunction(paramA)
> {
> > var a = paramA;
> > function childFunction()
> > {
> > return a + 2;
> > > }
> > > return childFunction();

> }


JavaScript 开发人员使用内部函数来在其他函数中集成小型的实用函数。如清单 3 所示，此内部函数 childFunction 可以访问外部函数 parentFunction 的变量。当内部函数获得和使用其外部函数的变量时，就称其为一个闭包。

了解闭包


考虑如清单 4 所示的代码片段。


清单 4. 一个简单的闭包


&lt;html&gt;


> 

&lt;body&gt;


> 

&lt;script type="text/javascript"&gt;


> document.write("Closure Demo!!");
> window.onload=
> function  closureDemoParentFunction(paramA)
> {
> > var a = paramA;
> > return function closureDemoInnerFunction (paramB)
> > {
> > > alert( a +" "+ paramB);

> > };

> };
> var x = closureDemoParentFunction("outer x");
> x("inner x");
> 

&lt;/script&gt;


> 

&lt;/body&gt;


> 

&lt;/html&gt;




在上述清单中，closureDemoInnerFunction 是在父函数 closureDemoParentFunction 中定义的内部函数。当用外部的 x 对 closureDemoParentFunction 进行调用时，外部函数变量 a 就会被赋值为外部的 x。函数会返回指向内部函数 closureDemoInnerFunction 的指针，该指针包括在变量 x 内。

外部函数 closureDemoParentFunction 的本地变量 a 即使在外部函数返回时仍会存在。这一点不同于 C/C++ 这样的编程语言，在 C/C++ 中，一旦函数返回，本地变量也将不复存在。在 JavaScript 中，在调用 closureDemoParentFunction 的时候，带有属性 a 的范围对象将会被创建。该属性包括值 paramA，又称为“外部 x”。同样地，当 closureDemoParentFunction 返回时，它将会返回内部函数 closureDemoInnerFunction，该函数包括在变量 x 中。

由于内部函数持有到外部函数的变量的引用，所以这个带属性 a 的范围对象将不会被垃圾收集。当对具有参数值 inner x 的 x 进行调用时，即 x("inner x")，将会弹出警告消息，表明 “outer x innerx”。

清单 4 简要解释了 JavaScript 闭包。闭包功能非常强大，原因是它们使内部函数在外部函数返回时也仍然可以保留对此外部函数的变量的访问。不幸的是，闭包非常易于隐藏 JavaScript 对象 和 DOM 对象间的循环引用。

闭包和循环引用

在清单 5 中，可以看到一个闭包，在此闭包内，JavaScript 对象（obj）包含到 DOM 对象的引用（通过 id "element" 被引用）。而 DOM 元素则拥有到 JavaScript obj 的引用。这样建立起来的 JavaScript 对象和 DOM 对象间的循环引用将会导致内存泄漏。

清单 5. 由事件处理引起的内存泄漏模式



&lt;html&gt;


> 

&lt;body&gt;


> 

&lt;script type="text/javascript"&gt;


> document.write("Program to illustrate memory leak via closure");
> window.onload=function outerFunction(){
> > var obj = document.getElementById("element");
> > obj.onclick=function innerFunction(){
> > alert("Hi! I will leak");
> > };
> > obj.bigString=new Array(1000).join(new Array(2000).join("XXXXX"));
> > // This is used to make the leak significant

> };
> 

&lt;/script&gt;


> 

&lt;button id="element"&gt;

Click Me

&lt;/button&gt;


> 

&lt;/body&gt;


> 

&lt;/html&gt;




避免内存泄漏

幸好，JavaScript 中的内存泄漏是可以避免的。当确定了可导致循环引用的模式之后，正如我们在上述章节中所做的那样，您就可以开始着手应对这些模式了。这里，我们将以上述的 由事件处理引起的内存泄漏模式 为例来展示三种应对已知内存泄漏的方式。

一种应对 清单 5 中的内存泄漏的解决方案是让此 JavaScript 对象 obj 为空，这会显式地打破此循环引用，如清单 6 所示。

清单 6. 打破循环引用



&lt;html&gt;


> 

&lt;body&gt;


> 

&lt;script type="text/javascript"&gt;


> document.write("Avoiding memory leak via closure by breaking the circular
> > reference");
> > window.onload=function outerFunction(){
> > var obj = document.getElementById("element");
> > obj.onclick=function innerFunction()
> > {
> > > alert("Hi! I have avoided the leak");
> > > // Some logic here

> > };
> > obj.bigString=new Array(1000).join(new Array(2000).join("XXXXX"));
> > obj = null; //This breaks the circular reference
> > };

> 

&lt;/script&gt;


> 

&lt;button id="element"&gt;

"Click Here"

&lt;/button&gt;


> 

&lt;/body&gt;


> 

&lt;/html&gt;






清单 7 是通过添加另一个闭包来避免 JavaScript 对象和 DOM 对象间的循环引用。


清单 7. 添加另一个闭包



&lt;html&gt;


> 

&lt;body&gt;


> 

&lt;script type="text/javascript"&gt;


> document.write("Avoiding a memory leak by adding another closure");
> > window.onload=function outerFunction(){

> var anotherObj = function innerFunction()
> > {
> > // Some logic here
> > alert("Hi! I have avoided the leak");
> > > };

> > (function anotherInnerFunction(){
> > var obj =  document.getElementById("element");
> > obj.onclick=anotherObj })();
> > > };

> 

&lt;/script&gt;


> 

&lt;button id="element"&gt;

"Click Here"

&lt;/button&gt;


> 

&lt;/body&gt;


> 

&lt;/html&gt;






清单 8 则通过添加另一个函数来避免闭包本身，进而阻止了泄漏。


清单 8. 避免闭包自身



&lt;html&gt;


> 

&lt;head&gt;


> 

&lt;script type="text/javascript"&gt;


> document.write("Avoid leaks by avoiding closures!");
> window.onload=function()
> {
> > var obj = document.getElementById("element");
> > obj.onclick = doesNotLeak;

> }
> function doesNotLeak()
> {
> > //Your Logic here
> > alert("Hi! I have avoided the leak");

> }

> 

&lt;/script&gt;


> 

&lt;/head&gt;


> 

&lt;body&gt;


> 

&lt;button id="element"&gt;

"Click Here"

&lt;/button&gt;


> 

&lt;/body&gt;


> 

&lt;/html&gt;



结束语

本文解释了循环引用是如何导致 JavaScript 中的内存泄漏的 —— 尤其是在结合了闭包的情况下。您还了解了涉及到循环引用的一些常见内存泄漏模式以及应对这些泄漏模式的几种简单方式。有关本文所讨论的主题的更多信息，请参看 参考资料。















　　webgame的开发，除了实现各种各样的需求之外，还需要尽量保证客户端的精简，轻量，不至于让用户浏览器负担过重。如果遇到IE内存泄漏，不能及时释放内存占用，浏览器就更不堪重负了，时间长了会导致内存占用过高，浏览器响应慢，甚至进程挂掉。下面就是最近遇到的一例内存泄漏问题。
页面表现：
页面里有一个每30秒和后台同步一次的倒计时定时器，用来显示当前城市的军事队列

在内网小规模测试时，没有发现异常，当放到外网供用户内测后，发现浏览器进程的内存占用不断增加，挂机几个小时之后，ieplore.exe的虚拟内存占用从原先的100M以下，攀升到了200多M
分析：
根据观察，每30秒和后台同步数据之后，内存占用就会增加几十K，如果军事队列更多，占用增加也会更多，十几个部队时，每次增加的内存会有两百多K，问题基本定位到了定时器的更新上。
原来的代码是这样写的：
每30秒从后台得到数据后， 重新生成军事行动表格，往表格里插入TR、TD，点击坐标和召回，可以执行相应的操作。
通过排除法分析，最后确定了这行代码有问题，加上了就会导致内存不断增加
……
TD2.innerHTML+='<span>('+ToXY(A<a href='i.md'>i</a>.iTarGrid)+')</span>'
……
如果去掉OnClick，页面就可以正常，刷新时内存不会增加
解决办法：
需要给文字添加响应的响应函数，同时又不在innerHTML里写入OnClick，还有另外几种方式：
1．给span加上id，然后用obj.onclick = function(){   ……}匿名函数的方式增加事件处理
2．使用标签A，然后用href=”javascript:函数名()”，同样可以达到目的
经测试，以上两种方法不会导致内存泄漏，测试通过。
如果经常使用innerHTML，又会在里面加入事件处理，以上问题就要引起注意了。

关于IE的内存泄漏，原理已经有很多文章进行阐述了。需要推荐的关于IE内存泄漏的是MSDN上的一篇： Understanding and Solving Internet Explorer Leak Patterns ，亦有 中文翻译版本 。对于一个JS程序员来说，个人觉得深入了解IE内存泄漏没有很大必要，如果是开发人员（浏览器相关开发人员）就一定要掌握，JS程序员可以尝试在使用Javascript中遵循以下若干原则：
·不要将一个DOM对象和一个JS对象相互成为对方的属性
·将事件处理函数放在定义它的函数的外部
·不要在创建DOM对象时插入script
·总是先将新创建的DOM对象插入到文档后，在对其进行其他操作。