http://developer.yahoo.com/yui/yuidoc

## 简介 ##

　　生成的前提是注释写法符合Jsdoc标准和YUI给出的标准

　　YUI Team实践出了一个高效易协作的前端代码开发流程：代码首先由Ant来组织管理和版本化、接着由JsLint来验证，然后由YUI Doc文档化、最后由YUI Compressor进行压缩发布。上个月初，YUI Team公布了这个新的JavaScript API文档生成工具YUI Doc，它本来专门为YUI提供API级别的文档的，现在它开源为人民服务了。

　　YUI Doc和JavaDoc、JSDoc和JsDoc Toolkit相似。YUI Doc是由注解驱动（comment-driven ）的系统，它通过解析代码中描述结构的注解来生成文档。由于它纯粹的依赖于注解，所以并不像一些模拟系统一样需要有惯用语和代码模式。更详细的介绍可以看YUI Doc的官方文档和YUIblog上的《YUI Doc: A New Tool for Generating JavaScript APIDocumentation》（由于YUI blog咱们无法访问，比较好的解决方案就是在Google Reader中订阅它的Feed，直接输入http://yuiblog.com即可。）


## 使用详解 ##

　　YUI Doc是基于Python开发，且依赖几个扩展库，加之其Getting Started写的也比较含糊，所以如何使用这个工具反而成为第一道门槛，尤其对于那些对Python不熟悉的同学来说。所以，下面的重点是介绍如何在Windows上使用YUI Doc：

  * **下载Python2.5.2安装之。**

　　虽然Python3.0和Python2.6都已经出来很久了，但之所以依旧选择Python2.5.2，是因为后面要用到的安装Python扩展库的工具setuptools在Windows下的最新版本对应的是Python2.5。我不知道它是否支持2.5以上，有兴趣的可以试试。

　　下载setuptools-0.6c9.win32-py2.5.exe并安装之，setuptools会自动安装到Python所在安装目录的Scripts目录下。

　　setuptools为Python提供了简单的包管理和发行功能。后面的扩展库的安装就是利用它的easy\_install，非常方便。有兴趣的可以看看《可爱的Python: 使用setuptools孵化Python egg》。

  * **配置Python**

　　为了使用方便需要配置一下“环境变量”，即在“我的电脑>右键>属性>高级>环境变量>系统变量>选中Path>编辑”，在弹出框中加入：
```
D:\Program Files\python;D:\Program Files\python\Scripts
```
　　然后应用即可。前面的两个路径分别是我的Python和setuptools的安装路径，你需要修改成你自己的。

　　开始>运行>(Win + R)输入“cmd”，

　　输入：
```
python -c "import pkg_resources"
```

　　没有任何输出，即表示setuptools安装成功。接着依次输入运行：
```
easy_install Pygments
easy_install simplejson
easy_install Cheetah
```

　　setuptools会自动寻找并下载Pygments、SimpleJSON和Cheetah这三个扩展库，并安装它。

  * **下载YUI Doc**

　　下载YUI Doc，并解压在某个目录下。

  * **运行YUI Doc**
　　复制其bin目录下的example.bat文件，重命名为test.bat，然后用记事本或其他编辑器打开并配置它:

```
SET yuidoc_home="D:\yui\yuidoc"
REM YUI Doc的路径
parser_in="D:\yui\src"
REM 要生成文档的JS文件路径，比如为了测试就我临时建一个，里面就放着YUI 的 dom.js
parser_out="D:\yui\src\parser"
REM YUI Doc会把解析的JS文件提取出来所要存放的位置
generator_out="D:\yui\src\generator"
REM 生成文档存放的位置
```

　　保存并运行test.bat后，就会发现D:\yui\src中多了parser和generator两个目录，而generator中正是你要的文档。

　　学会使用工具仅仅是开始了一小步，仔细看看YUI Doc的官方文档吧，利用其来促使我们写出更高效优雅的前端代码并惠及更多的人才是一大步。