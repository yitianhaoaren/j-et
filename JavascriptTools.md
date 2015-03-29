# 编辑器 #

**Spket**
http://www.spket.com/

**Notepad++**
http://notepad-plus.sourceforge.net/tw/site.htm

**Vim**
http://www.vim.org/

vim相关插件
外所有插件在gnome-terminal中都测试过，在其他终端中应该不会有太大问题。

  * 语法高亮－javascript.vim
http://www.vim.org/scripts/script.php?script_id=1491
该插件安装在~/.vim/syntax/目录下。下载后需要修改一个地方，一般javascript编程，折叠层数不需要太深，我自己设置为1，即：
setlocal foldlevel=1。
需要在.vimrc中加入
" 打开javascript折叠
let b:javascript\_fold=1
" 打开javascript对dom、html和css的支持
let javascript\_enable\_domhtmlcss=1



  * 变量标记和检查－mark.vim
http://www.vim.org/scripts/script.php?script_id=1238
该插件安装到~/.vim/plugin/目录。在对变量进行检查和跟踪的时候会很有用，同时还可以防止变量名拼写错误。打开／关闭变量标记的默认快捷键是m。也可以使用v选中一段进行标记。
截屏（点击可查看大图）


  * 字典补全－javascript.dict
http://lazy-people.org/browser/project/dotfiles/users/dann/.vim/dict/javascript.dict?rev=122
该字典可以放在任意目录，我一般放在~/.vim/dict/目录中。使用字典补全需要在插入模式下，快捷键是Ctrl+X，然后Ctrl+K。有些javascript内置函数名超长，经常记不住，这时候字典就比较有用。字典其实就是一个普通文件，里面是关键词的列表，一行一个，所以你也可以加入一些你在项目中经常使用的函数。
另外需要在.vimrc中加入

"设置字典 ~/.vim/dict/javascript.dict是字典文件的路径
autocmd FileType javascript set dictionary=~/.vim/dict/javascript.dict
截屏（点击可查看大图）


  * YUI自动补全
待续…

  * 运行代码片段－spidermonkey
http://www.mozilla.org/js/spidermonkey/
有时想测试一个小东西，没有必要写一个html然后到浏览器去运行，spidermonkey能帮你忙，而且spidermonkey还能作一些很geek的事情。ubuntu系统安装很简单，sudo apt-get install spidermonkey-bin，其他系统请参考网站的文档。安装完毕后，输入js，则会进入一个js shell，和python类似。输入help()回车，会看到一个简单的帮助。
在vim编写javascript代码后，输入!js %即可执行当前文件的代码。也可以选中一段代码然后执行:’<,'>!js，这样会插入执行结果到当前文件。
截屏（点击可查看大图）


  * 语法检查和快速调试－javascriptlint
http://www.javascriptlint.com/
这个工具的代码基于Douglas Crockford’s的jslint，在代码检查方面很强大，可以说非常苛刻。如果从头开始写代码，建议经常用它来检查代码，能明显提高代码的质量。下载时不要从代码库check out最新版本，而是下载稳定的0.3.0版本。
```
$ cd jsl-0.3.0/src/ #这里的jsl-0.3.0是解压缩目录
$ make -f Makefile.ref all
$ cd Linux_All_DBG.OBJ/
$ cp jsl jscpucfg /home/xp/bin/js/ #/home/xp/bin/js/要拷贝到的目录，可以任意位置
$ cd /home/xp/bin/js/
$ jsl -help:conf > jsl.conf #生成默认配置文件
```

另外需要在.vimrc中加入
```
设置javascript lint
autocmd FileType javascript set makeprg=/home/xp/bin/js/jsl -nologo -nofilelisting -nosummary -nocontext -conf '/home/xp/bin/js/jsl.conf' -process %
autocmd FileType javascript set errorformat=%f(%l): %m
autocmd FileType javascript inoremap <silent> <F9> <C-O>:make<CR>
autocmd FileType javascript map <silent> <F9> :make<CR>
```
使用时使用:make命令即可，或者使用F9快捷键。还需要理解的是quickfix，输入命令help quickfix看以下文档，主要涉及的命令有:cw :cn :cp等。
截屏（点击可查看大图）


  * 其他常用插件
虽然我不怎么用，但是可能对你有一些帮助
winmanager
http://www.vim.org/scripts/script.php?script_id=95
类似资源管理器，如果从editplus或者其他图形编辑器转过来的朋友，这个可能很有用。
截屏（点击可查看大图）

minibufexplorer
http://www.vim.org/scripts/script.php?script_id=159
类似标签页，管理当前打开的文件

Tlist
http://www.vim.org/scripts/script.php?script_id=273
可以显示代码结构



# 压缩工具 #

**JSA**
http://www.xidea.org/project/jsa/

**YUI Compressor**
http://yuilibrary.com/projects/yuicompressor





# 文档生成工具 #

**jsdoc-toolkit**
http://code.google.com/p/jsdoc-toolkit/


**YUIDoc**
http://github.com/yui/yuidoc/downloads



  * **yuidoc 集成版使用指南 for Win**
> (基于 yuidoc 2009-05-20 版本：http://github.com/yui/yuidoc/downloads)

  1. 下载 python for win ：http://www.python.org/download/releases/2.5.2/ (建议2.5.2版本，可同时适用 Google App)
  1. 下载 安装 setuptools ：http://pypi.python.org/pypi/setuptools
  1. 依次执行：
```
    %PYTHON_HOME%\Scripts\easy_install pygments
    %PYTHON_HOME%\Scripts\easy_install Cheetah
    %PYTHON_HOME%\Scripts\easy_install simplejson
```

  1. 复制 yuidoc\ext\_namemapper.pyd 文件到 %PYTHON\_HOME%\Lib\site-packages\cheetah-2.x.x-py2.5.egg\Cheetah 目录下，_namemapper.pyd下载地址：http://cheetahtemplate.org/_namemapper.pyd2.5 ，去掉后缀2.5，yuidoc自带的namemapper版本对应python2.4，直接拷贝过去会报python24.dll未找到。
  1. 修改 yuidoc\template\ 目录下的模板及资源文件（慎!）
  1. 运行 yuidoc\bin\yui\_2.7.0b.bat 构建相应版本的yui文档