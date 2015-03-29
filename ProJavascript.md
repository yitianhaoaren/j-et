# **高效 JavaScript** #

作者 Mark 'Tarquin' Wilton-Jones · 2006年11月2日
本文翻译自 Efficient JavaScript;

# 简介 #

　　传统上，网页中不会有大量的脚本，至少脚本很少会影响网页的性能。但随着网页越来越像 Web 应用程序，脚本的效率对网页性能影响越来越大。而且使用 Web 技术开发的应用程序现在越来越多，因此提高脚本的性能变得很重要。

　　对于桌面应用程序，通常使用编译器将源代码转换为二进制程序。编译器可以花费大量时间优化最终二进制程序的效率。Web 应用程序则不同。因为 Web 应用程序需要运行在不同的浏览器、平台和架构中，不可能事先完全编译。浏览器在获得脚本后要执行解释和编译工作。用户要求不仅要求网页能快速的载入，而且要求最终 Web 应用程序执行的效果要和桌面应用程序的一样流畅。Web 应用程序应能运行在多种设备上，从普通的桌面电脑到手机。

　　浏览器并不很擅长此项工作。虽然 Opera 有着当前最快的脚本引擎，但浏览器有不可避免的局限性，这时就需要 Web 开发者的帮助。Web 开发者提高 Web 应用程序的性能的方法很多而且也很简单，如只需要将一种循环变成另一种、将组合样式分解成三个或者只添加实际需要的脚本。

　　本文从 ECMAScript/JavaScript, DOM, 和页面载入方面分别介绍几种简单的能提高 Web 应用程序性能的方法。

# 目录 #

**一、ECMAScript**
  1. 避免使用 eval 或 Function 构造函数
    1. 重写 eval
    1. 如果你需要函数，那就用函数
  1. 避免使用 with
  1. 不要在影响性能的关键函数中使用 try-catch-finally
  1. 分隔 eval 和 with
  1. 避免使用全局变量
  1. 注意隐式对象转换
  1. 在关键函数中避免 for-in
  1. 优化 string 合并
  1. 基本运算符比函数调用更快
  1. 向 setTimeout() 和 setInterval()传送函数名，而不要传送字符串

**二、DOM**
  1. 重绘和 reflow
    1. 减少 reflow 次数
    1. 最小化 reflow 影响
  1. 修改 DOM 树
  1. 修改不可见元素
  1. 测量大小
  1. 一次修改多个样式值
  1. 用流畅性换取速度
  1. 避免搜索大量节点
  1. 使用 XPath 提高速度
  1. 避免在遍历 DOM 时修改 DOM
  1. 使用变量保存 DOM 值

**三、页面载入**
  1. 避免保存来自其他文档的引用
  1. 快速历史浏览
  1. 使用 XMLHttpRequest
  1. 动态创建 SCRIPT 元素
  1. location.replace() 控制历史项


# 正文 #

## 一、ECMAScript ##

### 1.避免使用 eval 或 Function 构造函数 ###
　　每次 eval 或 Function 构造函数作用于字符串表示的源代码时，脚本引擎都需要将源代码转换成可执行代码。这是很消耗资源的操作 —— 通常比简单的函数调用慢100倍以上。
eval 函数效率特别低，由于事先无法知晓传给 eval 的字符串中的内容，eval在其上下文中解释要处理的代码，也就是说编译器无法优化上下文，因此只能有浏览器在运行时解释代码。这对性能影响很大。

　　Function 构造函数比 eval 略好，因为使用此代码不会影响周围代码；但其速度仍很慢。

  * **重写 eval**

　　eval 不仅效率低下，而且绝大部分情况下完全没有使用的必要。很多情况下使用 eval 是因为信息以字符串形式提供，开发者误认为只有 eval 能使用此信息。下例是一个典型的错误：
```
function getProperty(oString) {
  var oReference;
  eval('oReference = test.prop.'+oString);
  return oReference;
}
```

　　下面的代码执行完全相同的函数，但没有使用 eval：
```
function getProperty(oString) {
  return test.prop[oString];
```
　　在 Opera 9, Firefox, 和 Internet Explorer 中后者比前者快95%，在 Safari 中快85%。(注意此比较中不含函数本身调用时间。)

  * **如果你需要函数，那就用函数**

　　下面是常见的 Function 构造函数使用：
```
function addMethod(oObject,oProperty,oFunctionCode) {
  oObject[oProperty] = new Function(oFunctionCode);
}
addMethod(myObject,'rotateBy90','this.angle=(this.angle+90)%360');
addMethod(myObject,'rotateBy60','this.angle=(this.angle+60)%360');
```
　　下面的代码没有使用 Function 构造函数，但提供了相同的功能：通过创建匿名函数：
```
function addMethod(oObject,oProperty,oFunction) {
  oObject[oProperty] = oFunction;
}
addMethod(myObject,'rotateBy90',function () { this.angle=(this.angle+90)%360; });
addMethod(myObject,'rotateBy60',function () { this.angle=(this.angle+60)%360; });
```

### 2.避免使用 with ###

　　尽管看起来挺方便，但 with 效率很低。with 结构又创建了一个作用域，以便使用变量时脚本引擎搜索。这本身只轻微的影响性能。但严重的是编译时不知道此作用域内容，因此编译器无法像对其他作用域（如函数产生的作用域）那样对之优化。
　　另一个高效而且也挺方便的方法是使用变量引用对象，然后使用变量访问对象属性。但只有属性不是 literal type 时才适用，如字符串或布尔值。
　　考虑下面的代码：
```
with( test.information.settings.files ) {
  primary = 'names';
  secondary = 'roles';
  tertiary = 'references';
}
```

　　下面的代码效率更高：
```
var testObject = test.information.settings.files;
testObject.primary = 'names';
testObject.secondary = 'roles';
testObject.tertiary = 'references';
```

### 3.不要在影响性能的关键函数中使用 try-catch-finally ###

　　try-catch-finally 结构比较特殊。和其他语法结构不同，它在 runtime 的当前作用域中创建新变量。每当 catch 执行时，就会将捕获到的 exception 对象赋给一个变量。这个变量不属于任何脚本。它在 catch 语句开始时被创建，在结束时被销毁。
　　由于此函数比较特殊，且是在运行时动态创建动态销毁，有些浏览器对其的处理并不高效。把 catch 语句放在关键循环中将极大影响性能。
　　如果可能，应在脚本中不频繁被调用的地方进行异常处理，或通过检查某种动作是否被支持来避免使用。下面的例子中，如果所需的属性不存在，将在循环语句中抛出许多异常：
```
var oProperties = ['first','second','third',...,'nth'], i;
for( i = 0; i < oProperties.length; i++ ) {
  try {
    test[oProperties[i]].someproperty = somevalue;
  } catch(e) {
    ...
  }
}
```

　　很多情况下，可把 try-catch-finally 结构移到循环外部。这样做稍微改变了程序语义，因为如果抛出异常，将停止整个循环：
```
var oProperties = ['first','second','third',...,'nth'], i;
try {
  for( i = 0; i < oProperties.length; i++ ) {
    test[oProperties[i]].someproperty = somevalue;
  }
} catch(e) {
  ...
}
```

　　有时可用属性检测或其他检测代替 try-catch-finally 结构：
```
var oProperties = ['first','second','third',...,'nth'], i;
for( i = 0; i < oProperties.length; i++ ) {
  if( test[oProperties[i]] ) {
    test[oProperties[i]].someproperty = somevalue;
  }
}
```


### 4.分隔 eval 和 with ###

　　因为 eval 和 with 结构严重影响性能，应该尽量避免使用这些结构。但如不得不使用时， 避免在频繁被调用的函数中或循环中使用这些结构。最好将这些结构放在只运行一次，或少量几次的代码中，并不要将其放在对性能要求较高的代码中。
　　如果可能，尽量将这些结构和其他代码分隔开，这样他们就不会影响脚本性能。如将其放在顶级函数中，或只执行一次然后保存运行结果，避免再次使用。
　　try-catch-finally 结构在一些浏览器中也会影响性能，包括 Opera ，因此最好也将其分隔。

### 5.避免使用全局变量 ###

　　全局变量使用简单，因此很容易禁不住诱惑在脚本中使用全局变量。但有时全局变量也会影响脚本性能。
　　首先，如果函数或其他作用域内引用了全局变量，则脚本引擎不得不一级一级查看作用域直到搜索到全局作用域。查询本地作用域变量更快。
　　其次，全局变量将始终存在在脚本生命周期中。而本地变量在本地作用域结束后就将被销毁，其所使用的内存也会被垃圾收集器回收。
　　最后，window 对象也共享全局作用域，也就是说本质上是两个作用域而不是一个。使用全局变量不能像使用本地变量那样使用前缀，因此脚本引擎要花更多时间查找全局变量。
　　也可在全局作用域中创建全局函数。函数中可以调用其他函数，随着函数调用级数增加，脚本引擎需要花更多时间才能找到全局变量以找到全局变量。
　　考虑下面的简单例子，i 和 s 是全局作用域且函数使用这两个全局变量：
```
var i, s = '';
function testfunction() {
  for( i = 0; i < 20; i++ ) {
    s += i;
  }
}
testfunction();
```

　　下面的函数效率更高。在大多数浏览器中，包括 Opera 9、最新版 Internet Explorer, Firefox, Konqueror 和 Safari，后者执行速度比上面代码快30%。
```
function testfunction() {
  var i, s = '';
  for( i = 0; i < 20; i++ ) {
    s += i;
  }
}
testfunction();
```

### 6.注意隐式对象转换 ###

　　Literal，如字符串、数字和布尔值在 ECMAScript 中有两种表示方法。 每个类型都可以创建变量值或对象。如 var oString = 'some content';, 创建了字符串值，而 var oString = new String('some content');创建了字符串对象。
　　所有的属性和方法都定义在 string 对象中，而不是 string 值中。每次使用 string 值的方法或属性， ECMAScript 引擎都会隐式的用相同 string 值创建新的 string 对象。此对象只用于此请求，以后每次视图调用 string 值方法是都会重新创建。
　　下面的代码将要求脚本引擎创建21个新 string 对象，每次使用 length 属性时都会产生一个，每一个 charAt 方法也会产生一个：
```
var s = '0123456789';
for( var i = 0; i < s.length; i++ ) {
  s.charAt(i);
}
```


　　下面的代码和上面相同，但只创建了一个对象，因此其效率更高：
```
var s = new String('0123456789');
for( var i = 0; i < s.length; i++ ) {
  s.charAt(i);
}
```

　　如果代码中常调用 literal 值的方法，你应像上面例子那样考虑创建对象。
　　注意本文中大部分技巧对于所有浏览器都有效，但此技巧特别针对于 Opera。此优化技巧在 Internet Explorer 和 Firefox 中改进效果没有在 Opera 中明显。

### 7.在关键函数中避免 for-in ###

　　for-in 常被误用，特别是简单的 for 循环更合适时。for-in 循环需要脚本引擎创建所有可枚举的属性列表，然后检查是否存在重复。
　　有时脚本已知可枚举的属性。这时简单的 for 循环即可遍历所有属性，特别是当使用顺序数字枚举时，如数组中。
　　下面是不正确的 for-in 循环使用：
```
var oSum = 0;
for( var i in oArray ) {
  oSum += oArray[i];
}
for 循环无疑会更高效：
var oSum = 0;
var oLength = oArray.length;
for( var i = 0; i < oLength; i++ ) {
  oSum += oArray[i];
}
```

### 8.优化 string 合并 ###
　　字符串合并是比较慢的。+ 运算符并不管是否将结果保存在变量中。它会创建新 string 对象，并将结果赋给此对象；也许新对象会被赋给某个变量。下面是一个常见的字符串合并语句：
```
a += 'x' + 'y';
```

　　此代码首先创建临时string对象保存合并后的'xy'值，然后和a变量合并，最后将结果赋给a。下面的代码使用两条分开的命令，但每次都直接赋值给a ，因此不需要创建临时string对象。结果在大部分浏览器中，后者比前者快20%，而且消耗更少的内存：
```
a += 'x';
a += 'y';
```

### 9.基本运算符比函数调用更快 ###
　　尽管单独使用效果不明显，但如果在需要高性能的关键循环和函数中使用基本运算符代替函数调用将可能提高脚本性能。例子包括数组的 push 方法，其效率低于直接在数组末位赋值。另一个例子是 Math 对象方法，大部分情况下，简单的数学运算符效率更高更合适。
```
var min = Math.min(a,b);
A.push(v);
```

　　下面代码实现相同功能，但效率更高：
```
var min = a < b ? a : b;
A[A.length] = v;
```

### 10.向 setTimeout() 和 setInterval()传送函数名，而不要传送字符串 ###

　　setTimeout() 和 setInterval() 方法近似于 eval。如果传进参数是字符串，则在一段时间之后，会和 eval一样执行字符串值，当然其低效率也和 eval 一样。
　　但这些方法也可以接受函数作为第一个参数。在一段时间后将调用此函数，但此函数可在编译时被解释和优化，也就是说会有更好的性能。典型的使用 string 作为参数例子如下：
```
setInterval('updateResults()',1000);
setTimeout('x+=3;prepareResult();if(!hasCancelled){runmore();}',500);
```

　　第一个语句可以直接传递函数名。第二个语句中，可以使用匿名函数封装代码：
```
setInterval(updateResults,1000);
setTimeout(function () {
  x += 3;
  prepareResult();
  if( !hasCancelled ) {
    runmore();
  }
},500);
```

　　需要注意的是 timeout 或时间延迟可能并不准确。通常浏览器会花比要求更多的时间。有些浏览器会稍微提早完成下一个延迟以补偿。有些浏览器每次可能都会等待准确时间。很多因素，如 CPU 速度、线程状态和 JavaScript 负载都会影响时间延迟的精度。大多数浏览器无法提供1ms以下的延迟，可能会设置最小可能延迟，通常在10 和 100 ms之间。


## 二、DOM ##

　　通常主要有三种情况引起 DOM 运行速度变慢。第一就是执行大量 DOM 操作的脚本，如从获取的数据中建造新的 DOM 树。第二种情况是脚本引起太多的 reflow 或重绘。第三种情况是使用较慢的 DOM 节点定位方法。
　　第二种和第三种情况比较常见且对性能影响比较严重，因此先介绍前两种情况。

### 1.重绘(Repaint)和 reflow ###

　　重绘也被称为重画，每当以前不可见的元素变得可见（或反之）时就需要重绘操作；重绘不会改变页面布局。如给元素添加轮廓、改变背景颜色、改变样式。重绘对性能影响很大，因为需要脚本引擎搜索所有元素以确定哪些是可见的及哪些是应被显示的。
　　Reflow 是更大规模的变化。当 DOM 数被改变时、影响布局的样式被修改时、当元素的 className 属性被修改时或当浏览器窗口大小变化时都会引起 reflow。脚本引擎必须 reflow 相关元素以确定哪些部分不应被现实。其子节点也会被 reflow 以考虑其父节点的新布局。DOM 中此元素之后出现的元素也被 reflow 以计算新布局，因为它们的位置可能已被移动了。祖先节点也需要 reflow 以适应子节点大小的改变。总之，所有元素都需被重绘。
　　Reflow 从性能角度来说是非常耗时的操作，是导致 DOM 脚本较慢的主要原因之一，特别在手机等处理能力较弱的设备上。很多情况下，reflow 和重新布局整个网页耗时相近。

  * **减少 reflow 次数**

　　很多情况下脚本需要进行会引起 reflow 或重绘的操作，如动画就需要 reflow 操作，因此 reflow 是 Web 开发不可或缺的特性。为了让脚本能快速运行，应在不影响整体视觉效果的情况下尽量减少 reflow 次数。
　　浏览器可以选择缓存 reflow 操作，如可以等到脚本线程结束后才 reflow 以呈现变化。Opera 可以等待足够数量的改变后才 reflow、或等待足够长时间后才 reflow、或等待脚本线程结束后才 reflow。也就是说如果一个脚本线程中的发生很多间隔很小的改变时，可能只引起一个 reflow 。但开发者不能依赖此特性，特别是考虑到运行 Opera 的不同设备的运算速度有很大差异。
　　注意不同元素的 reflow 消耗时间不同。Reflow 表格元素消耗的时间最多是 Reflow 块元素时间的3倍。

  * **最小化 reflow 影响**

　　正常的 reflow 可能影响整个页面。reflow 的页面内容越多，则 reflow 操作的时间也越长。Reflow 的页面内容越多，需要的时间也就越长。位置固定的元素不影响页面的布局，因此如果它们 reflow 则只需 reflow 其本身。其背后的网页需要被重绘，但这比 reflow 整个页面要快得多。
　　所以动画不应该被用于整个页面，最好用于固定位置元素。大部分动画符合此要求。


### 2.修改 DOM 树 ###

　　修改 DOM 树会导致 reflow 。向 DOM 中添加新元素、修改 text 节点值或修改属性都可能导致 reflow。顺序执行多个修改会引起超过一个 reflow，因此最好将多个修改放在不可见的 DOM 树 fragment 中。这样就只需要一次 DOM 修改操作：
```
var docFragm = document.createDocumentFragment();
var elem, contents;
for( var i = 0; i < textlist.length; i++ ) {
  elem = document.createElement('p');
  contents = document.createTextNode(textlist[i]);
  elem.appendChild(contents);
  docFragm.appendChild(elem);
}
document.body.appendChild(docFragm);
```

　　也可以在元素的克隆版本中进行多个 DOM 树修改操作，在修改结束后用克隆版本替换原版本即可，这样只需要一个 reflow 操作。注意如果元素中包含表单控件，则不能使用此技巧，因为用户所做修改将无法反映在 DOM 树种。此技巧也不应该用于绑定事件处理器的元素，因为理论上不应该克隆这些元素。
```
var original = document.getElementById('container');
var cloned = original.cloneNode(true);
cloned.setAttribute('width','50%');
var elem, contents;
for( var i = 0; i < textlist.length; i++ ) {
  elem = document.createElement('p');
  contents = document.createTextNode(textlist[i]);
  elem.appendChild(contents);
  cloned.appendChild(elem);
}
original.parentNode.replaceChild(cloned,original);
```

### 3.修改不可见元素 ###

　　如果一个元素的 display 样式被设置为 none，即使其内容变化也不再需要重绘此元素，因为根本就不会显示此元素。可以利用这一点。如果需要对一个元素或其内容做出多个修改，又无法将这些更改放在一个重绘中，则可以先将元素设置为 display:none ，做出修改后，在把元素改回原来状态。
　　上面方法将导致两个额外的 reflow，一个是隐藏元素时另一个是重新显示此元素时，但此方法的总体效率仍较高。如果隐藏的元素影响滚动条位置，上面的方法也有可能会引起滚动条跳动。但此技术也被用于固定位置元素而不会引起任何不好看的影响。
```
var posElem = document.getElementById('animation');
posElem.style.display = 'none';
posElem.appendChild(newNodes);
posElem.style.width = '10em';
... other changes ...
posElem.style.display = 'block';
```


### 4.测量大小 ###

　　如上面所述，浏览器可能会缓存多个修改一起执行，并只执行一次 reflow 。但注意为保证结果正确，测量元素大小也会引起 reflow 。尽管这不会造成任何重绘，但仍会在后台进行 reflow 操作。
　　使用 offsetWidth 这样的属性或 getComputedStyle 这样的方法都会引起 reflow 。即使不使用返回的结果，上述操作也会引起立即 reflow。如果重复需要测量结果，可以考虑只测量一次但用变量保存结果。
```
var posElem = document.getElementById('animation');
var calcWidth = posElem.offsetWidth;
posElem.style.fontSize = ( calcWidth / 10 ) + 'px';
posElem.firstChild.style.marginLeft = ( calcWidth / 20 ) + 'px';
posElem.style.left = ( ( -1 * calcWidth ) / 2 ) + 'px';
... other changes ...
```


### 5.一次修改多个样式值 ###

　　与 DOM 树修改相似，可将多个样式修改一次进行，以尽量减少重绘或 reflow数目。常见设置样式方法是逐个设置：
```
var toChange = document.getElementById('mainelement');
toChange.style.background = '#333';
toChange.style.color = '#fff';
toChange.style.border = '1px solid #00f';
```

　　上面代码可能引起多次 reflow 和重绘。有两种改进方法。如果元素采用了多个样式，而且这些样式值事先知道，可以通过修改元素 class 使用新样式：
```
div {
  background: #ddd;
  color: #000;
  border: 1px solid #000;
}
div.highlight {
  background: #333;
  color: #fff;
  border: 1px solid #00f;
}
...
document.getElementById('mainelement').className = 'highlight';
```


　　第二种方法是为元素定义新样式，而不是一个个赋值。这主要用于动态修改，如在动画中，无法事前知道新样式值。通过使用 style 对象的 cssText 属性，或者通过 setAttribute. 可以实现此技巧。Internet Explorer 不允许第二种形式，支持第一种形式。有些较老的浏览器，包括 Opera 8 需要使用第二种形式，不支持第一种形式。最简单的方式是测试看是否支持第一种形式，如果支持就使用，如果不支持则使用第二种形式。
```
var posElem = document.getElementById('animation');
var newStyle = 'background: ' + newBack + ';' +
  'color: ' + newColor + ';' +
  'border: ' + newBorder + ';';
if( typeof( posElem.style.cssText ) != 'undefined' ) {
  posElem.style.cssText = newStyle;
} else {
  posElem.setAttribute('style',newStyle);
}
```

### 6.用流畅性换取速度 ###

　　作为开发者，当然想要动画运行的越流畅越好，通常使用较小的时间间隔或较小的变化。如每10ms更新一次动画，或者每次移动1个像素。此动画可能在桌面电脑上或某些浏览器中可以完美运行。但10ms时间间隔可能是浏览器使用100%CPU才能达到的最小值。有些浏览器甚至不能完成——要求每秒100个 reflow 对大部分浏览器来说都不容易。低性能的电脑或者其他设备可能无法达到此种速度，在这些设备上动画可能非常慢甚至失去响应。
　　因此最好暂时把开发者的骄傲放在一边，牺牲流畅性而换取速度。把时间间隔改为50ms或把动画步长设为5个像素，会消耗更少的计算资源，在低性能设备上也能正常运行。

### 7.避免搜索大量节点 ###

　　当需要查找节点时，尽量使用 DOM 内置方法和集合缩小搜索范围。如你想要定位某个包含某种属性的元素，可使用下面代码：
```
var allElements = document.getElementsByTagName('*');
for( var i = 0; i < allElements.length; i++ ) {
  if( allElements[i].hasAttribute('someattr') ) {
    ...
  }
}
```

　　即使没听说过 XPath 这样的高级技巧，也可以看出上面的代码有两个问题导致速度变慢。首先它搜索每一个元素，而不是尝试缩小搜索范围。其次即使已经找到所需元素上卖弄代码还继续搜索。如果已知要找的元素在 id 为 inhere的 div 中，最好使用下面的代码：
```
var allElements = document.getElementById('inhere').getElementsByTagName('*');
for( var i = 0; i < allElements.length; i++ ) {
  if( allElements[i].hasAttribute('someattr') ) {
    ...
    break;
  }
}
```

　　如果已知要找元素是 div 的直接子节点，则下面的代码速度更快：
```
var allChildren = document.getElementById('inhere').childNodes;
for( var i = 0; i < allChildren.length; i++ ) {
  if( allChildren[i].nodeType == 1 && allChildren[i].hasAttribute('someattr') ) {
    ...
    break;
  }
}
```

　　基本的思想就是尽量避免逐个查看 DOM 节点。DOM 有很多更好更快的方法，如 DOM 2 Traversal TreeWalker，效率要高于递归查找 childNodes 集合。

### 8.使用 XPath 提高速度 ###

　　假如需要基于 H2-H4 元素在 HTML 网页中创建目录。在 HTML 中标题元素可以出现在很多地方，因此无法使用递归函数获取这些元素。传统 DOM 可能使用如下方法：
```
var allElements = document.getElementsByTagName('*');
for( var i = 0; i < allElements.length; i++ ) {
  if( allElements[i].tagName.match(/^h[2-4]$/i) ) {
    ...
  }
}
```

　　若网页有超过2000个元素，此方法速度会很慢。如果支持 XPath，则可以使用一个快得多的方法，因为 XPath 查询引擎可比需被解释的 JavaScript 更好的被优化。在有些情况下，XPath 速度可能会快2个数量级以上。下面代码和上面完成一样的功能，但使用 XPath 因此速度要更快：
```
var headings = document.evaluate( '//h2|//h3|//h4', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
var oneheading;
while( oneheading = headings.iterateNext() ) {
  ...
}
```

　　下面版本代码融合上述两种方法；在支持 XPath 的地方使用快速方法，在不支持时使用传统 DOM 方法：
```
if( document.evaluate ) {
  var headings = document.evaluate( '//h2|//h3|//h4', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null );
  var oneheading;
  while( oneheading = headings.iterateNext() ) {
    ...
  }
} else {
  var allElements = document.getElementsByTagName('*');
  for( var i = 0; i < allElements.length; i++ ) {
    if( allElements[i].tagName.match(/^h[2-4]$/i) ) {
      ...
    }
  }
}
```

### 9.避免在遍历 DOM 时修改 DOM ###

　　有些 DOM 集合是实时的，如果在你的脚本遍历列表时相关元素产生变化，则此集合会立刻变化而不需要等待脚本遍历结束。childNodes 集合和 getElementsByTagName 返回的节点列表都是这样的实时集合。
　　如果在遍历这样的集合的同时向其中添加元素，则可能会遇到无限循环，因为你不停的向列表中添加元素，永远也不会碰到列表结束。这不是唯一的问题。为提高性能，可能会对这些集合做出优化，如记住其长度、记住脚本中上一个访问元素序号，这样在你访问下一个元素时可快速定位。
　　如果你此时修改 DOM 树，即使修改的元素不在此集合中，集合还是会重新搜索以查看是否有新元素。这样就无法记住上一个访问元素序号或记住集合长度，因为集合本身可能已经变了，这样就无法使用优化：
```
var allPara = document.getElementsByTagName('p');
for( var i = 0; i < allPara.length; i++ ) {
  allPara[i].appendChild(document.createTextNode(i));
}
```

　　下面的代码在 Opera 和 Internet Explorer 等主流浏览器中比上面代码快10倍以上。先创建一个要修改元素的静态列表，然后遍历静态列表并作出相应修改，而不是遍历 getElementsByTagName 返回的节点列表：
```
var allPara = document.getElementsByTagName('p');
var collectTemp = [];
for( var i = 0; i < allPara.length; i++ ) {
  collectTemp[collectTemp.length] = allPara[i];
}
for( i = 0; i < collectTemp.length; i++ ) {
  collectTemp[i].appendChild(document.createTextNode(i));
}
collectTemp = null;
```

### 10.使用变量保存 DOM 值 ###

　　有些 DOM 返回值无法缓存，每次调用时都会重新调用函数。如 getElementById 方法。下面是一个低效率代码的例子：
```
document.getElementById('test').property1 = 'value1';
document.getElementById('test').property2 = 'value2';
document.getElementById('test').property3 = 'value3';
document.getElementById('test').property4 = 'value4';
```

　　此代码为定位同一个对象调用了四次 getElementById 方法。下面的代码只调用了一次并将结果保存在变量中，单看这一个操作可能比上面单个操作要略慢，因为需要执行赋值语句。但后面不再需要调用 getElementById 方法！下面的代码比上面的代码要快5-10倍：
```
var sample = document.getElementById('test');
sample.property1 = 'value1';
sample.property2 = 'value2';
sample.property3 = 'value3';
sample.property4 = 'value4';
```

## 三、页面载入 ##

### 1.避免保存来自其他文档的引用 ###

　　如果文档访问过其他文档中的节点或对象，在脚本结束后避免保留这些引用。如果在全局变量或对象属性中保存过这些引用，通过设置为 null 清除之或者直接删除之。
　　原因是另一个文档被销毁后，如弹出窗口被关闭，尽管那个文档已经不再了，所有对那个文档中对象的引用都会在内存中保存整个 DOM 树和脚本环境。这也适用那些包含在frame，内联 frame，或 OBJECT 元素中的网页。
```
var remoteDoc = parent.frames['sideframe'].document;
var remoteContainer = remoteDoc.getElementById('content');
var newPara = remoteDoc.createElement('p');
newPara.appendChild(remoteDoc.createTextNode('new content'));
remoteContainer.appendChild(newPara);
//remove references
remoteDoc = null;
remoteContainer = null;
newPara = null;
```

### 2.快速历史浏览（history navigation） ###

　　Opera (和许多其他浏览器) 默认使用快速历史浏览。当用户点击后退或前进时，将记录当前页面的状态及页面中的脚本。当用户回到刚才的页面时，将立即显示刚才的页面，如同从没有离开此页一样。不需要重新载入页面也不需要重新初始化。脚本继续运行，DOM 也和离开此页前完全相同。对用户来说这样反应很快，载入较慢的网页应用程序会有更好的性能。
　　尽管 Opera 提供开发者控制此行为的方式，最好还是尽量保持快速历史浏览功能。也就是说最好避免会影响此功能的动作，包括提交表单时禁用表单控件或让页面内容透明或不可见的渐出特效。
　　简单的解决方法是使用 onunload 监听器 reset 渐出效果或重新 enable 表单控件。注意对有些浏览器来说，如 Firefox 和 Safari，为 unload 事件添加监听器会禁用历史浏览。而在 Opera 中禁用提交按钮会导致禁用历史浏览。
```
window.onunload = function () {
  document.body.style.opacity = '1';
};
```

### 3.使用 XMLHttpRequest ###

　　此技巧不一定适用于每一个项目，但它能显著降低从服务器下载数据量，也能避免重载页面时销毁及创建脚本环境的开销。开始时正常载入页面，然后使用 XMLHttpRequest 下载最少量的新内容。这样 JavaScript 环境会一直存在。
　　注意此方法也可能会导致问题。首先此方法完全破坏历史浏览。尽管可通过内联frame储存信息来解决此问题，但这显然不符合使用 XMLHttpRequest 的初衷。因此尽量少用，只在不需要回退到先前内容时使用。此方法还会影响辅助器具的使用（ assistive device），因为将无法察觉 DOM 已被更改，因此最好在不会引起问题的地方使用XMLHttpRequest。
　　若 JavaScript 不可用或不支持 XMLHttpRequest 则此技巧也会失效。最简单避免此问题的方法是使用正常链接指向新页面。增加一个检测链接是否被激活的事件处理器。处理器可以探测是否支持 XMLHttpRequest ，如果支持则载入新数据并阻止链接默认动作。载入新数据后，用其取代页面的部分内容，然后 request 对象就可以被销毁并允许垃圾收集器回收内存资源。
```
document.getElementById('nextlink').onclick = function () {
  if( !window.XMLHttpRequest ) { return true; }
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if( request.readyState != 4 ) { return; }
    var useResponse = request.responseText.replace( /^[\w\W]*<div id="container">|<\/div>\s*<\/body>[\w\W]*$/g , '' );
    document.getElementById('container').innerHTML = useResponse;
    request.onreadystatechange = null;
    request = null;
  };
  request.open( 'GET', this.href, true );
  request.send(null);
  return false;
}
```

### 4.动态创建 SCRIPT 元素 ###

　　加载和处理脚本需要时间，但有些脚本在载入后却从来未被使用。载入这样的脚本浪费时间和资源，并影响当前的脚本执行，因此最好不要引用这种不用的脚本。可以通过简单的加载脚本判断需要哪些脚本，并只为后面需要的脚本创建 script 元素。
　　理论上，这个加载脚本可在页面载入结束后通过创建 SCRIPT 元素加入 DOM。这在所有主流浏览器中都可以正常工作，但这可能对浏览器的提出更多的要求，甚至大于要载入的脚本本身。而且在页面载入之前可能就需要脚本，因此最好在页面加载过程中，通过 document.write 创建 script 标签。记住一定要转义‘/’字符防止终止当前脚本运行：
```
if( document.createElement && document.childNodes ) {
  document.write('<script type="text\/javascript" src="dom.js"><\/script>');
}
if( window.XMLHttpRequest ) {
  document.write('<script type="text\/javascript" src="xhr.js"><\/script>');
}
```

### 5.location.replace() 控制历史项 ###

　　有时需要通过脚本修改页面地址。常见的方法是给 location.href 赋新地址。这将和打开新链接一样添加新历史项、载入新页面。
　　有时不想添加新历史项，因为用户不需要回到前面的页面。这在内存资源有限的设备中很有用。通过替换历史项恢复当前页面所使用的内存。可以通过 location.replace()方法实现。
```
location.replace('newpage.html');
```
　　注意页面仍被保存在 cache 中，仍占用内存，但比保存在历史中要少的多。
本文采用的授权是创作共用的“署名-非商业性使用-相同方式共享 2.5 通用许可”。





补充:

　　我们在做性能优化的时候，第一步需要判定哪部分程序最需要做优化，一般来说程序运行最耗时的那部分，也就是程序热点（Hotspots）是我们的候选，而优化热点函数后性能提升效果也最明显。