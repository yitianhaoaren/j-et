## 命名含义 ##
  * JET 是 Javascript Extension Tools 的缩写，即 Javascript 扩展工具套件的意思。
  * jet 本意是喷气式飞机，所以同时借喻轻巧、快速的寓意。



## 设计理念 ##
  * 保持最优的执行效率
  * 保持 Javascript 原有的代码风格，降低学习难度
  * 更好的组织工业级 Javascript 应用程序


## 其他 ##
  * 探索在前端使用 MVP、MVC 模式来构建大型 WebApp (Build Web App with MVP)
  * 探索工业级 Javascript 的开发技术

## 发展规划 ##
  1. **核心底层** - 纯Js底层功能封装/代码组织/无缝接入其它js库 - [完成]
  1. **基础扩展** - 跨浏览器封装/工具函数/设计模式相关 - [完成]
  1. **UI 基础控件** - 按钮/面板/窗口/树形列表/Tab/lightbox/widgets...
  1. **实时动画系统** - 实时定时器/关键帧动画/加速度公式/物理引擎/声音控制器...
  1. **游戏引擎** - 角色控制/地图系统/游戏异步通讯系统/寻路算法/键盘控制/人工智能/...

## 架构图 ##

> | 第一层 | **Core Javascript 扩展模块** | **代码组织模块**(轻松组织大型应用,无缝接入其它js库) |
|:----------|:---------------------------------|:-------------------------------------------------------------------------|
> | 第二层 | **Browser Javasccript 扩展模块**(跨浏览器,基础封装) | **可选模块**(设计模式相关模块,选择器模块...) |
> | 第三层 | **UI 组件** | **实时动画模块** | **游戏引擎模块** |