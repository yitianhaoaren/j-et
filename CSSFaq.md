### 如何用CSS控制文字长度？ ###

最近出差做个需要DIV+CSS布局的项目，才发现其中有很多问题需要解决。这里把一些问题记录下来，方便以后。

通常的我们在读取文章标题的时候，遇到字符过多，都是通过程序在SERVER端截取一定的字符数，然后添加…来实现标题长度截取的。其实我们也可以通过CSS来控制。

实列如下：
```
.title
{
 width:200px;
 white-space:nowrap;
 word-break:keep-all;
 overflow:hidden;
 text-overflow:ellipsis;
}
```
可用span或div引用,例如:
```
<span class=title>客户端解决标题显示太长省略多余部分并加省略号的样式</span> 
<div class=title>客户端解决标题显示太长省略多余部分并加省略号的样式</div> 
```
以上2例显示在超过样式定义的200px宽度后,后面的字符将被…替换.