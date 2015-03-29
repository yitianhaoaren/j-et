# Introduction #

区别IE6与FF：
> background:orange;**background:blue;**

区别IE6与IE7：
> background:green !important;background:blue;

区别IE7与FF：
> background:orange; **background:green;**

区别FF，IE7，IE6：
> background:orange;**background:green !important;**background:blue;

注：IE都能识别**;标准浏览器(如FF)不能识别**；
IE6能识别**，但不能识别 !important,
IE7能识别**，也能识别!important;
FF不能识别**，但能识别!important;**


IE6	IE7	FF
**√	√	×
!important	×	√	√**

另外再补充一个，下划线"_",
IE6支持下划线，IE7和firefox均不支持下划线。(推荐)_

于是大家还可以这样来区分IE6，IE7，firefox
: background:orange;