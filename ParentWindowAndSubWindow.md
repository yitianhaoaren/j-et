# iframe 父窗口和子窗口 #

**父窗口调用子窗口**
```
iframe_ID.iframe_document_object.object_attribute = attribute_value 
```

例子
```
onClick="iframe_text.myobject.innerText='Hello,父窗口调用子窗口';" 
```

**子窗口调用父窗口**
```
parent.parent_document_object.object_attribute = attribute_value 
```
例子
```
onclick="parent.myobject.innerText='Hello,子窗口调用父窗口';" 
```

上面在IE下没有问题，但在firefox下不正常。在firefox下，应该是
**父窗口调用子窗口**
```
window.frames["iframe_ID"].document.getElementById("iframe_document_object" ).object_attribute = attribute_value 
```
例子
```
window.frames["iframe_text"].document.getElementById("myobject").innerHTML= 'Hello,父窗口调用子窗口';" 
```
**子窗口调用父窗口**
```
parent.document.getElementById("parent_document_object").object_attribute = attribute_value 
```
例子
```
parent.document.getElementById("myobject").innerHTML = 'Hello,子窗口调用父窗口';"
```
ps:不能跨域获取，例如iframe的src是`'http://www.xxx.xxx/'`

调用
```
<iframe src="b.html" width = '100%' id = 'iframeTest'></iframe> 
```

# window.open 父窗口和子窗口 #

window.opener 是window.open 打开的子页面调用父页面对象

**用子窗口调用父窗口**
```
window.opener.document.getElementById("iframe_document_object" ).object_attribute = attribute_value 
```
例子
```
window.opener.document.getElementById("myobject").innerHTML= 'Hello,用子窗口调用父窗口';" 
```
**子窗口调用父窗口**
PS:确实需要注意的是，模态窗口的子窗口是没有办法修改父窗口页面中的任何内容的。

**当子窗口关闭的时候，就会自动刷新父窗口**
```
<script language="javascript"> 
   window.onunload = function(){ 
   window.opener.location.reload(); 
} 
</script>
```



调用
```
window.open('tar.html', 'newwindow', 'height=1024, width=1300, top=0, left=0, toolbar=no, menubar=yes, scrollbars=yes,resizable=yes,location=no, status=no');
window.showModalDialog("tar.html",'newwindow',"dialogHeight:100px,center:yes,resizable:no,status:no");
```