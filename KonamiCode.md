在 Facebook 上有一个彩蛋：
登录 facebook.com ，点击你首页的任何地方，键盘输入 Up, Up, Down, Down, Left, Right, Left, Right, B, A, Enter 后，再点击页面或滚动一下滚动条，你会发现特殊的变化，嘿嘿 ^^

玩过“魂斗罗”的朋友，肯定一眼就能看出输入的字符原来就是“魂斗罗”中的“秘技”。其实“秘技”的术语叫 Konami Code, 那如何用 JavaScript 也在自己的页面上添加一个类似的彩蛋呢？
Abhi 在 《Konami Code on Facebook : How to implement it on your site》 一文中提供了大体思路：
```
var $ = {
    enabled: false,
    tmp: Array(),
    _konamiCode: Array(65,66,39,37,39,37,40,40,38,38),
    init: function() {
        this.tmp = Array(65,66,39,37,39,37,40,40,38,38);
    },
    konamiCode: function(e) {
        if(!this.enabled) {
            var t = this.tmp.pop();
            if((e.keyCode-t) == 0) {
                if(this.tmp.length == 0) {
                    this.enabled = true;
                }
            } else {
                this.init();
            }
        } else {
            this.action();
        }
    },
    // Change the action() function to whatever you want to
    action: function() {
        //alert("Konami Code Activated");
    }
}
```
然后在 load 的时候调用 $.init() 方法，在 keydown 的时候调用 $.konamiCode(event) 方法。
不过 Abhi 的方法还是冗余了点，Jan Jarfalk 在留言中提供了一个短小精悍的代码：
```
// Tweetable Konami code
var k=[];
function(e){
    k.push(e.keyCode);
    if(k.toString().indexOf("38,38,40,40,37,39,37,39,66,65")>=0) {
        //alert("Konami Code Activated");
    }
}
```