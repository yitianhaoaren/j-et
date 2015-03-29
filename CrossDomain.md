### 1.什么引起了ajax跨域不能的问题 ###

> ajax本身实际上是通过XMLHttpRequest对象来进行数据的交互，而浏览器出于安全考虑，不允许js代码进行跨域操作，所以会警告。

### 2.有什么完美的解决方案么？ ###
没有。解决方案有不少，但是只能是根据自己的实际情况来选择。
具体情况有:
  1. 本域和子域的相互访问: www.aa.com和book.aa.com
  1. 本域和其他域的相互访问: www.aa.com和www.bb.com 用 iframe
  1. 本域和其他域的相互访问: www.aa.com和www.bb.com 用 XMLHttpRequest访问代理
  1. 本域和其他域的相互访问: www.aa.com和www.bb.com 用 JS创建动态脚本

**解决方法**
> 一、如果想做到数据的交互，那么www.aa.com和book.aa.com必须由你来开发才可以。可以将book.aa.com用iframe添加到www.aa.com的某个页面下,在www.aa.com和iframe里面都加上document.domain = "aa.com"，这样就可以统一域了，可以实现跨域访问。就和平时同一个域中镶嵌iframe一样，直接调用里面的JS就可以了。（这个办法我没有尝试，不过理论可行）

> 二、当两个域不同时,如果想相互调用，那么同样需要两个域都是由你来开发才可以。用iframe可以实现数据的互相调用。解决方案就是用window.location对象的hash属性。hash属性就是 `http://domian/web/a.htm#dshakjdhsjka` 里面的` #dshakjdhsjka`。利用JS改变hash值网页不会刷新，可以这样实现通过JS访问hash值来做到通信。不过除了IE之外其他大部分浏览器只要改变hash就会记录历史，你在前进和后退时就需要处理，非常麻烦。不过再做简单的处理时还是可以用的，具体的代码我再下面有下载。大体的过程是页面a和页面b在不同域下,b通过iframe添加到a里，a通过JS修改iframe的hash值，b里面做一个监听（因为JS只能修改hash，数据是否改变只能由b自己来判断），检测到b的hash值被修改了，得到修改的值，经过处理返回a需要的值，再来修改a的hash值（这个地方要注意，如果a本身是那种查询页面的话比如`http://domian/web/a.aspx?id=3`,在b中直接`parent.window.location`是无法取得数据的，同样报没有权限的错误，需要a把这个传过来，所以也比较麻烦），同样a里面也要做监听，如果hash变化的话就取得返回的数据，再做相应的处理。

> 三、这种情形是最经常遇到的，也是用的最多的了。就是www.aa.com和www.bb.com你只能修改一个，也就是另外一个是别人的，人家告诉你你要取得数据就访问某某连接参数是什么样子的，最后返回数据是什么格式的。而你需要做的就是在你的域下新建一个网页，让服务器去别人的网站上取得数据，再返回给你。domain1下的a向同域下的GetData.aspx请求数据，GetData.aspx向domain2下的ResponseData.aspx发送请求,ResponseData.aspx返回数据给GetData.aspx, GetData.aspx再返回给a,这样就完成了一次数据请求。GetData.aspx在其中充当了代理的作用。具体可以看下我的代码。

> 四、这个和上个的区别就是请求是使用`<script>`标签来请求的，这个要求也是两个域都是由你来开发才行。原理就是JS文件注入，在本域内的a内生成一个JS标签，它的SRC指向请求的另外一个域的某个页面b，b返回数据即可，可以直接返回JS的代码。因为script的src属性是可以跨域的。具体看代码，这个也比较简单。

> code:
http://www.live-share.com/files/300697/Cross_The_Site_Test_code.rar.html


**总结**
> 第一种情况：域和子域的问题，可以完全解决交互。
> 第二种情况：跨域，实现过程非常麻烦，需要两个域开发者都能控制，适用于简单交互。
> 第三种情况：跨域，开发者只控制一个域即可，实现过程需要增加代理取得数据，是常用的方式。
> 第四种情况：跨域，两个域开发者都需要控制，返回一段js代码。

_PS:代码自己按照情况修改即可。_

这是拿别人的参考链接，老美的文章比较多。

1. Security Considerations: Dynamic HTML
http://msdn.microsoft.com/library/default.asp?url=/workshop/author/dhtml/sec_dhtml.asp

2. About Cross-Frame Scripting and Security
http://msdn.microsoft.com/library/default.asp?url=/workshop/author/om/xframe_scripting_security.asp

3. Cross-Domain Proxy
http://ajaxpatterns.org/Cross-Domain_Proxy

4. Cross Domain XMLHttpRequest using an IFrame Proxy
http://manual.dojotoolkit.org/WikiHome/DojoDotBook/Book75

5. Back Button Support for Atlas UpdatePanels
http://www.nikhilk.net/BackButtonSupport.aspx

6. Cross-document messaging hack
http://blog.monstuff.com/archives/000304.html

7. Building Mash-ups with "Atlas"
http://atlas.asp.net/docs/Walkthroughs/DevScenarios/bridge.aspx

8. Calling web services hosted outside of your application with “Atlas”
http://blogs.msdn.com/federaldev/archive/2006/07/31/684229.aspx
http://www.federaldeveloper.com/Shared%20Documents/Presentations%20by%20Marc%
20Schweigert/CallAtlasWebServiceInDifferentProject.zip

9. AJAX Tip: Passing Messages Between iframes
http://www.25hoursaday.com/weblog/PermaLink.aspx?guid=3b03cf9d-b589-4838-806e-64efcc0a1a15

10. OSCON Cross-site Ajax Slides
http://blog.plaxo.com/archives/2006/07/oscon_crosssite.html
http://www.plaxo.com/css/api/Joseph-Smarr-Plaxo-OSCON-2006.ppt

11. OSCON 2006: Cross-site Ajax
http://www.sitepoint.com/blogs/2006/07/28/oscon-2006-cross-site-ajax/