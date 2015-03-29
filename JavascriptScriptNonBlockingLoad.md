# Introduction #

随着越来越多的网站涉及“Web 2.0”应用, JavaScript脚本的数量也急剧增加. 这是令人忧虑的，因为脚本对页面性能有负面影响. 主流的浏览器(例如IE 6 、7)会以下面2种方式发生阻塞:
如果资源位于脚本的下方，那么他们会被阻塞下载.
如果元素位于脚本的下方，那么他们会被阻塞渲染展示.
这个 脚本阻塞下载的例子(Scripts Block Downloads example) 展示了上面的情况. 它包括2个外部脚本，后面是1个图片、1个样式表和1个iframe. 使用IE7加载这个例子的HTTP瀑布图显示了第一个脚本阻塞了所有的下载, 随后第2个脚本阻塞了所有的下载，最后图片样式表和iframe并行加载. 观察页面的渲染情况,你会发现脚本上方的那段文字会马上渲染。然而，HTML 文档其它部分的文字会被阻塞，直到所有的脚本被下载完毕。


在 IE6 7, Firefox 2 3.0, Safari 3, Chrome 1, Opera 脚本均会阻塞下载

如果浏览器是单线程的,那么当一个脚本在执行时，浏览器不能下载其它资源是可以理解的. 但是没有理由解释当脚本下载时浏览器不能下载其它资源。下载脚本的同时并行下载其它资源是所有最新浏览器的已经实现了的功能，包括Internet Explorer 8, Safari 4, Chrome 2. 在IE8中打开脚本阻塞下载的例子(Scripts Block Downloads example)的HTTP瀑布图展示了脚本确实是并行下载的，样式表也是并行下载的，然而图片和iframe仍旧被阻塞了. Safari 4 和 Chrome 2 的行为也很类似。并行下载改善了一部分，但还没有达到它能达到的最好的效果.


IE8, Safari 4, Chrome 2下，脚本仍旧是阻塞的

幸运的是,即使在更老的浏览器中，也有使脚本不阻塞其它页面资源的办法。不幸的是，这取决于web开发人员是否愿意承担这些繁重的工作。

下面有6种非阻塞式加载脚本的技术:
XHR Eval - 通过XHR下载脚本，通过eval()执行.
XHR Injection - 通过XHR下载脚本，通过创建一个script的DOM元素注入页面，并且设置text属性.
Script in Iframe - 在一个HTML页面内包含脚本并通过iframe加载.
Script DOM Element - 创建一个script的DOM元素，并且设置src属性为脚本的url
Script Defer - 增加脚本的defer属性.曾经仅在IE中可用，现在Firefox 3.1. 中也可以了
document.write Script Tag - 在HTML页面内使用document.write 

&lt;script src=""&gt;

 . 仅在IE有效.
在Cuzillion你可以看到每个技术的样例。 事实证明这些技术有重要的区别, 见下面表格. 它们大部分提供并行下载, 有些技术不能被使用在跨域名的脚本上，有些必须在你已有的脚本基础上简单的修改，还有一个未被广泛讨论的是否触发浏览器的繁忙指示标记区别(状态栏，进度条，标签图标和光标). 如果你需要加载多个相互依存的脚本，你还需要一个维护执行顺序的技术.

技术名称	支持并行下载	支持跨域名	不需修改脚本	是否有繁忙指示	保障执行顺序	大小(字节)
XHR Eval	IE, FF, Saf, Chr, Op	no	no	Saf, Chr	-	~500
XHR Injection	IE, FF, Saf, Chr, Op	no	yes	Saf, Chr	-	~500
Script in Iframe	IE, FF, Saf, Chr, Op	no	no	IE, FF, Saf, Chr	-	~50
Script DOM Element	IE, FF, Saf, Chr, Op	yes	yes	FF, Saf, Chr	FF, Op	~200
Script Defer	IE, Saf4, Chr2, FF3.1	yes	yes	IE, FF, Saf, Chr, Op	IE, FF, Saf, Chr, Op	~50
document.write Script Tag	IE, Saf4, Chr2, Op	yes	yes	IE, FF, Saf, Chr, Op	IE, FF, Saf, Chr, Op	~100
问题是：哪个是最好的技术？ 最佳的技术取决于您的具体情况. 下面这个决策树可以作为一个指导. 它看起来复杂，其实并不是。只有3个参数就决定了输出结果: 脚本是否在主页面的同一个域名之下, 是否需要保障执行顺序, 是否需要触发繁忙指示标记



最理想的是，这个决策树的逻辑将体现在流行的HTML模板语言中(PHP, Python, Perl, 等.) 因此WEB开发人员可以简单的调用一个函数，就能保证他们的脚本使用最佳的技术来加载脚本。

很多情况下,使用 Script DOM Element是一个不错的选择. 它可以在所有浏览器下工作，没有任何跨域限制，代码上很容易实现，很容易被理解，唯一不足的是并不是在所有浏览器下均能保持正确的执行顺序。如果你有多个脚本并且相互依赖，你需要合并他们或使用其它技术。如果你在页面内有依赖于外部脚本的内联脚本，你必须对他们实现同步化，我将这个方法称为“coupling” 并在 耦合异步脚本中提出一些可以做到这一点的方法.