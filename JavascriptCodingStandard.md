# 规范理念 #

Any violation to this guide is allowed if it enhances readability.

所有的代码都要变成可供他人容易阅读的。

--引用自Dojo Javascript 语法规范


# 规范详解 #

## 命名规范 ##

  1. 必须使用 Tab 键进行代码缩进，以节约代码大小(建议设置编辑器的tab为4个空格的宽度)
  1. 接口风格
| **结构** | **规则** | **例如** |
|:-----------|:-----------|:-----------|
| 类 | 驼峰式 | ModuleClass() |
| 公有方法 | 混合式 | getPosition() |
| 公有变量 | 混合式 | frameStyle |
| 常量 | 大写式 | DEFAULT\_FRAME\_LAYOUT |

  1. 其他建议风格，非必要
| **结构** | **规则** |
|:-----------|:-----------|
| 私有方法 | 混合，例子：_mixedCase_|
| 私有变量 | 混合，例子：_mixedCase_|
| 方法（method）参数 | 混合，例子：_mixedCase, mixedCase_|
| 本地（local）变量 | 混合，例子：_mixedCase, mixedCase_|

  1. 所有语句结束后，必须使用 ; 号结束
  1. 所有变量必须是有意义的英文，严厉禁止拼音
  1. 变量允许使用公认英文缩写
  1. 类命名必须是驼峰式
  1. 常量必须所有单词大写，并且每个单词间加下划线
  1. 枚举类型时，枚举的命名必须有意义，枚举与枚举成员必须以驼峰式
  1. 常量和枚举必须在最前端定义，merge 时注意，必须把常量与枚举定义的文件放在文件列表的第一位
  1. 变量内的简写单词不能全大写XmlDocument strHtml
  1. "on"只能用作事件的命名
  1. 函数开头必须是有意义的动词或动词短语
  1. 私有类的变量属性成员 建议 使用混合式命名，并前面下下划线
  1. 临时的全局变量放到一个全局的哈希表里，方便变量回收
  1. 所有全局变量必须初始化，尽量少用全局变量
  1. 大括号前面不能有换行符
  1. 保留字以及特有的dom属性不能作为变量名


## 特殊命名约定 ##

  1. 前面加 “is” 的变量名应该为布尔值，亦可使用 “can” “has” “should”
  1. 前面加 ”str” 的变量名应该为字符串
  1. 前面加 “arr” 的变量名应该为数组
  1. 前面加 “num” 或 “count” 的变量名应该为数字
  1. “o” 作为局部变量或参数，表示为Object
  1. “e” 作为局部变量或参数，表示为Element
  1. “evt” 作为局部变量或参数，表示为event
  1. “err” 作为局部变量或参数，表示为error
  1. 重复变量建议使用 "i", "j", "k" （依次类推）等名称的变量(全世界公认)
  1. 能缩写的单词尽量缩写
  1. 避免产生令人误解的布尔值 isNotNumber isNan
  1. 处理错误的变量，必须在后面跟着 “Error”
  1. 初始化用的函数 必须使用 “init” 开头，如果一个页面只有初始化可以单独使用 init()
  1. 尽量做有意义的代码折行，不要让一行代码过长。(HTML 字符串除外)
  1. 操作符 建议 使用空格隔开
  1. 函数调用和方法 避免 使用空白
  1. 逗号（,） 建议 使用空白隔开。
  1. 不允许频繁使用 previousSibling 和 nextSibling


## 词法结构 ##

  1. 普通代码段应该看起来如下：
```
while(!isDone){
      doSomething();
      isDone = moreToDo();
}
```
  1. if 语句应该看起来像这样：
```
if(someCondition){
        statements;
}elseif(someOtherCondition){
    statements;
}else{
    statements;
}
```
  1. for 语句应该看起来像这样：
```
for(initialization; condition; update){
        statements;
}
```
  1. while 语句应该看起来像这样：
```
while(!isDone){
        doSomething();
    isDone = moreToDo();
}
```
  1. do ... while 语句应该看起来像这样：
```
do{
        statements;
}while(condition);
```
  1. switch 语句应该看起来像这样：
```
switch(condition){
case ABC:
    statements;
    //  fallthrough
case DEF:
    statements;
    break;
default:
        statements;
    break;
}
```
  1. try ... catch 语句应该看起来像这样：
```
try{
    statements;
}catch(ex){
    statements;
}finally{
    statements;
}
```
  1. 单行的 if - else，while 或者 for 语句也必须加入括号：
```
if(condition){ statement;}
while(condition){ statement;}
for(intialization; condition; update){ statement;}
```



## 注释规范 ##

  1. 一些你不打算给其他人使用的函数，建议添加 @ignore 让文档输出时可以忽略这段注释
  1. 一些相关的功能相关的函数，建议加上@see Function 来对上下文做索引
  1. 对于一些函数不建议或则需要注意的使用方法，必须加上 @deprecated作为提醒
  1. 每个js文件的文件头都必须包含 @fileoverview @author, 建议加上@version
  1. 每个函数都必须使用JsDoc 来注释他的用意
  1. 每个带参数的函数必须包含 @param
  1. 每个有返回值的函数必须包含 @return
  1. 构造函数必须加上 @constructor
  1. 继承函数建议加上 @base 表示其继承于哪个类
  1. 常用全局变量建议使用 JsDoc 的注释方式
  1. 一般的变量及局部变量才用 // 方式进行注释，建议在需要做注释的语句的上一行
  1. 其他详情请参考 JsDoc 注释方法


## 其他 ##

  1. String 优化
> > 循环体内的字符串累加使用join方式。 例如:
```
	var r = [];
	for (var i=0;i<100;i++){
		r.push("hello");
	}
	var k = r.join("");
```
  1. Switch 建议采用hash-table
> > switch 可以才用 Object代替 例如:
```
	var a = {
		"1":doAction1,
		"2":doAction2,
	}
	
	function doAction1(){
 
	}
 
	function doAction2(){
 
	}
 
	a[1]();
```
  1. 不建议使用eval
> > 不推荐使用eval来执行脚本。除非用来解释json数据。
  1. 注意 IE 的内存泄露问题