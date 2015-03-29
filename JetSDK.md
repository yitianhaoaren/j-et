# 文件说明 #
```
./build/     [压缩后的JET文件]
./demo/      [JET演示文档]
./doc/       [JET说明文档]
./sdk/       [开发工具箱]
    +- [jre6]             [java虚拟机目录]
    +- [jsdoc-toolkit]    [jsdoc文档生成工具]
    |- compress-with-compiler.bat                   (JET的源代码压缩脚本-google compiler)
    |- compress-with-yuicompressor.bat              (JET的源代码压缩脚本 - yui compressor)
    |- generate-multi-doc-with-jsdos-toolkit.bat    (JET API文档生成脚本)
    |- multi-doc-config.conf                        (文档生成配置文件)
    |- compiler.jar                                 (google compiler主程序)
    |- yuicompressor-2.4.2.jar                      (yuicompressor主程序)
./source/    [JET源代码]
    +- [assets]       [css等相关文件]
    +- [firebug]      [firebug控制台相关文件]
    |- jet.core.js         (JET微内核，此文件仅含有微内核，适用于以此内核为基础开发其它框架)
    |- jet.base.js         (JET基础包,已经包含core,基础扩展,dom,event等)
    |- jet.array.js        (JET数组模块包)
    |- jet.string.js       (JET字符串模块包)
    |- jet.cookie.js       (JET cookie模块包)
    |- jet.console.js      (JET 控制台模块包)
    |- jet.http.js         (JET http模块包，包括ajax，comet，loadCss和loadScript)
    |- jet.i18n.js         (JET国际化)
    |- jet.cssquery.js     (JET的cssQuery选择器包)
    |- jet.fx.js           (JET的fx动画包)
    |- jet.jquery.js       (JET的jQuery模块包)
    |- jet.json.js         (JET的json模块包)
    |- jet.mini.js         (JET的mini选择器包)
    |- jet.sizzle.js       (JET的sizzle模块包)
    |- jet.ui.js           (JET的ui模块包)
    |- jet.swfobject.js    (嵌入flash的工具包)
    |- jet.sound.js        (播放声音的模块包)
    |- jet.xpath.js        (JET的xpath模块包)

    |- jet-common.js       (JET 常用包集合文件)

```


  * 执行compress-with-yuicompressor.bat即可将source目录中的源代码压缩生成到build目录下边

  * 执行generate-doc-with-jsdos-toolkit.bat即可根据source目录中的源代码注释生成说明文档到doc目录下边