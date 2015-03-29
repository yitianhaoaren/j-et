# Introduction #

JsDoc 是javascript的一种标准注释约定。通过JsDoc 我们可以很方便输出文档。分享经验，对代码工程有着很大的帮助

写JsDoc的推荐工具:  JsEclipse Aptana
输出JsDoc的工具:
http://jsdoc.sourceforge.net/
http://jsdoctoolkit.org/

JsDoc 标签标准
@param	Provide information about a function parameter. A datatype indicator can be added between curly braces with this tag, as follows: / **@param {String} paramName This is a string parameter**/
@argument	Synonym for @param
@return	Provide information about the return value of a function.
@returns	Synonym for @return
@author	Provide information about the author of a JavaScript file or a function.
@deprecated	Signify that a function or class is deprecated, and should not be used if possible.
@see	Link to another class or function that is of importance to the current class or function. This tag can take several forms.
To link to another method within the same class:

@see #methodName
To link to another class:

@see ClassName
To link to a specific method of another class:

@see ClassName#methodName
@version	Show the version number of the current file or class
@requires	Define a dependency upon another class. The syntax for this tag is as follows: @requires OtherClassName This is text to be shown
@throws	Show that a method can throw a certain type of exception. The syntax for this tag is: @throws ExceptionType This is the label text
@exception	Synonym for @throws
@link	This is a powerful tag that can be used to link to a large number of other pages. It is also the only tag that can be used in the description text of a documentation string before the '@'-tag section. The usage is very similar to that of the @see tag, but the entire tag is wrapped in curly braces. For example: / **This utility method is also a member of the {@link String} class,** in the form of the {@link String#utility} method. **/
@fileoverview	This is a special-use tag. If the first block of documentation in a file starts with a @fileoverview tag, the rest of the documentation block will be used to provide a file overview in the documentation.
@class	This tag is used in a constructor's documentation block to provide information about the actual class. The included documentation will then not be included in the constructor's documentation.
@constructor	Signify that a function is the constructor for a class.
@type	Show the return type of a function. For example: /** This function returns a String. **@return The name of the current user** @type String **/
@extends	Used to show that a class is a subclass of another class. JSDoc is often quite good at picking this up on its own, but in some situations this tag is required.
@private	Signify that a function or class is private. Private classes and functions will not be available in the documentation unless JSDoc is run with the --private commandline option.
@final	Flag a value as being a final (constant) value.
@member	Show that a function is a member of a given class: /** @member MyClass **/ function SomeFunc(){	}
@ignore	Tell JSDoc to totally ignore this method.
@base	Force JSDoc to view the current class constructor as a subclass of the class given as the value to this tag: /** This is a subclass of Shape **@constructor** @base Shape **/ function Circle(){ // ... }
@addon	Mark a function as being an "addon" to a core JavaScript function that isn't defined within your own sources, as shown below: /** This is an addon function to SomeCoreClass which is **not defined within our own sources.** @addon	 