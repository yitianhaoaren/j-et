/**	
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * http://code.google.com/p/j-et/
 *
 * @version	1.0
 * @author	Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * 
 */

/**
 * 1.[JET core]: JET 微内核
 */
;(function(){
	var version = "1.0",
		mark = "JetMark",
		topNamespace = this,
		
		// 将顶级命名空间中可能存在的 Jet 对象引入
		Jet = topNamespace.Jet,
		
		VERSIONS = {},
		PACKAGES = {},
		
		DEBUG = {
			NO_DEBUG: 0,
			SHOW_ERROR: 1,
			SHOW_WARNING: 2,
			SHOW_INFO: 3,
			SHOW_ALL: 4
		},
		
		option = {
			console: false,
			debug: DEBUG.SHOW_ALL
		},
		
		/**
		 * @ignore
		 */
		out = function(msg, type){
			msg = String(msg);
			type = type || 3;
			if(type < option.debug){
				if(this.console){
					this.console.out(msg, type);
				}else{
					alert(msg+" - 消息类型["+type+"]");
				}
			}
			return msg;
		};
		
	//this.name="pp"
	//alert("jet:"+this.name)
	try{
		// 判断Jet名字空间是否已经存在
		if(typeof Jet === "undefined" || (Jet.mark && Jet.mark === mark)){
			
			// 如果已经有Jet对象则记录已有的信息
			if(Jet){
				VERSIONS = Jet.VERSIONS;
				PACKAGES = Jet.PACKAGES;
			}
			
			/**
			 * 【Jet 对象原型】
			 * 
			 * @class Jet
			 * @constructor Jet
			 * @global
			 * 
			 * @since version 1.0
			 * @description Jet 对象原型的描述
			 * 
			 * @param {Number} ver 要使用的 Jet 的版本号，当前是1.0
			 * @param {Boolean} isCreateNew 是否创建一个新的 Jet 实例，默认为 false 不创建新的 Jet 实例，只返回同一版本在全局中的唯一一个实例，注意：除非特殊需要，否则一般不要创建新的 Jet 实例
			 * @return {Object} 返回对应版本的 Jet 对象
			 * 
			 * @example
			 * //代码组织方式一(传统)：
			 * var J = new Jet();
			 * J.out(J.version);	//输出当前Jet的版本
			 * 
			 * @example
			 * //代码组织方式二(推荐)：
			 * Jet().$package(function(J){
			 * 	J.out(J.version);	//输出当前Jet的版本
			 * };
			 * //注：此种方式可以利用匿名函数来防止变量污染全局命名空间，尤其适合大型WebApp的构建！
			 * 
			 * @example
			 * //范例：
			 * Jet().$package("tencent.qqweb", function(J){
			 * 	var $ = J.dom.id,
			 * 	$D = J.dom,
			 * 	$E = J.event,
			 * 	$H = J.http;
			 * 	this.name = "腾讯WebQQ";
			 * 	J.out(this.name);
			 * };
			 * 
			 */
			Jet = function(ver, isCreateNew){
				var J = this;

				if(isCreateNew){
					// 如果是第一次执行则初始化对象
					this._init();
				}else{
					if(ver){
						ver = String(ver);
						try{
							if(Jet.VERSIONS[ver]){
								J = Jet.VERSIONS[ver];
							}else{
								J = Jet.VERSIONS[Jet.DEFAULT_VERSION];
								throw new Error("没有找到 JET version " + ver + ", 所以返回默认版本 JET version " + Jet.DEFAULT_VERSION + "!");
							}
						}catch(e){
							//J.out(e.fileName+";"+e.lineNumber+","+typeof e.stack+";"+e.name+","+e.message, 2);
							J.out("A.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
						}
					}else{
						J = Jet.VERSIONS[Jet.DEFAULT_VERSION];
					}
				}
				return J;
			};
			
			Jet.prototype = {
				/**
				 * 当前 Jet 的版本号，此版本是 1.0 <br/>
				 * Version 1.0
				 * 
				 * @description {Num} 当前 Jet 的版本号！
				 * @constant
				 * @type Number
				 */
				version: version,
				
				DEBUG: DEBUG,
				
				/**
				 * Jet 配置
				 * @ignore
				 */
				option: option,
				
				/**
				 * Jet 的初始化方法
				 * initialize method
				 * 
				 * @private
				 * @param {Object} o config 对象
				 */
				_init: function(){
					this.constructor = Jet;
					//return true;
				},
			
				/**
				 * 创建一个命名空间，创建的命名空间将会在 window 根命名空间下。
				 * Create a new namespace, the top namespace is window.
				 * 
				 * @since version 1.0
				 * @description 可以一次性连续创建命名空间
				 * 
				 * @param {String} name 命名空间名称
				 * @returns {Object} 返回对最末命名空间的引用
				 * 
				 * @example
				 * //在全局环境中创建tencent.qqweb名字空间, $namespace完成的操作相当于在全局环境中执行如下语句：
				 * //var tencent = {};
				 * //tencent.qqweb = {};
				 * 
				 * J.$namespace("tencent.qqweb");
				 * 
				 * //注：Jet的$namespace方法与其他JS框架的namespace的方法不同，其他框架如YUI是在其YAHOO对像下创
				 * //建命名空间，而Jet的$namespace测试直接在顶级命名空间window的下边直接创建命名空间。
				 * 
				 */
				$namespace: function(name) {
					var i,
						ni,
						nis = name.split("."),
						ns = topNamespace;

					for(i = 0; i < nis.length; i=i+1){
						ni = nis[i];
						ns[ni] = ns[ni] || {};
						ns = ns[nis[i]];
					}

					return ns;
				},
	
				/**
				 * 创建一个 Javascript 代码包
				 * 
				 * @param {String} name 要创建的包的名字空间
				 * @param {Function} func 要创建的包的包体
				 * @returns {Mixed} 返回任何自定义的变量
				 * 
				 * @example
				 * //创建一个匿名package包：
				 * Jet().$package(function(J){
				 * 	//这时上下文对象this指向全局window对象
				 * 	alert("Hello world! This is " + this);
				 * };
				 * 
				 * @example
				 * //创建一个名字为tencent.kinvix的package包：
				 * Jet().$package("tencent.kinvix", function(J){
				 * 	//这时上下文对象this指向window对象下的tencent.kinvix对象
				 * 	alert("Hello world! This is " + this);
				 * };
				 * 
				 * 
				 * 
				 */
				$package: function(){
					var name = arguments[0],
						func = arguments[arguments.length-1],
						ns = topNamespace,
						returnValue;
					try{
						if(typeof func === "function"){
							if(typeof name === "string"){
								ns = this.$namespace(name);
								if(Jet.PACKAGES[name]){
									//throw new Error("Package name [" + name + "] is exist!");
								}else{
							   		Jet.PACKAGES[name] = {
										isLoaded: true,
										returnValue: returnValue
									};
								}
							}
							ns.packageName = name;
							returnValue = func.call(ns, this);
						}else{
							throw new Error("Function required");
						}
					}catch(e){
						// 全局异常捕获
						this.out("B.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 1);
						//this.out(e, 1);
					}
				},
				
				/**
				 * 检查一个 Javascript 模块包是否已经存在
				 * 
				 * @param {String} name 包名
				 * @return {Object} 如果已加载则返回包对象，否则返回 undefined
				 * 
				 * @example
				 * //创建一个匿名package包：
				 * Jet().$package(function(J){
				 * 	// 输出undefined
				 * 	J.out(J.checkPackage("tencent.kinvix"));
				 * };
				 * 
				 * 
				 * @example
				 * //创建一个名字为tencent.kinvix的package包：
				 * Jet().$package("tencent.kinvix", function(J){
				 * 	//这时上下文对象this指向window下的tencent.kinvix对象
				 * 	alert("Hello world! This is " + this);
				 * };
				 * 
				 * Jet().$package(function(J){
				 * 	// J.checkPackage("tencent.kinvix")结果返回的将是tencent.kinvix的引用
				 * 	var kinvix = J.checkPackage("tencent.kinvix");
				 * 	if(kinvix){
				 * 		J.out("tencent.kinvix包已加载...");
				 * 	}
				 * };
				 * 
				 */
				checkPackage: function(name){
					return Jet.PACKAGES[name];
				},
				
				/**
				 * 标准化 Javascript 的核心输出方法，注意：在不同的Javascript嵌入宿主中会覆盖此方法！
				 * 
				 * @method out
				 * @function
				 * 
				 * @param {String} msg 要输出的信息
				 * @param {Number} type 输出信息的类型
				 * @return {String} msg 返回要输出的信息
				 * 
				 * @example
				 * //创建一个匿名package包：
				 * Jet().$package(function(J){
				 * 	// 向Jet的控制台输出信息,在不同的js宿主中具体实现细节会不同,但不会影响out方法的使用;
				 * 	J.out("Hello, world!");
				 * };
				 * 
				 */
				out: out,
				
				startTime: +new Date(),
				
				/**
				 * 关于 Jet
				 * 
				 * @return {String} 返回 Jet 的 about 信息
				 */
				about: function(){
					return this.out("JET (Javascript Extend Tools)\nversion: " + this.version + "\n\nCopyright (c) 2009, KDV.cn, All rights reserved.", 3);
				},
				
				/**
				 * Jet 对象转化为字符串的方法
				 * 
				 * @ignore
				 * @return {String} 返回 Jet 对象串行化后的信息
				 */
				toString: function(){
					return "JET version " + this.version + " !";
				}
			};

			/**
			 * Jet 版本库对象
			 * 
			 * @ignore
			 * @type Object
			 */
			Jet.VERSIONS = VERSIONS;
			
			/**
			 * 记录加载的包的对象
			 * 
			 * @ignore
			 * @type Object
			 */
			Jet.PACKAGES = PACKAGES;

			/**
			 * 创建一个当前版本 Jet 的实例
			 * 
			 * @ignore
			 * @type Object
			 */
			Jet.VERSIONS[version] = new Jet(version, true);
		
			/**
			 * Jet 默认版本的版本号，默认将会是最后一个加载的Jet版本
			 * 
			 * @constant
			 * @type Number
			 */
			Jet.DEFAULT_VERSION = version;
			/**
			 * Jet 对象验证标记
			 * 
			 * @ignore
			 * @description 用于验证已存在的Jet对象是否是本框架某子版本的Jet对象
			 * @type String
			 */
			Jet.mark = mark;
			
			// 让顶级命名空间的 Jet 对象引用新的 Jet 对象
			topNamespace.Jet = Jet;
		}else{
			throw new Error("\"Jet\" name is defined in other javascript code !!!");
		}
	}catch(e){
		// 微内核初始化失败，输出出错信息
		out("JET 微内核初始化失败! " + "错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 1);
	}
})();











/**
 * 2.[Javascript core]: 常用工具函数扩展
 */
Jet().$package(function(J){
	var isUndefined,
		isNull,
		isNumber,
		isString,
		isBoolean,
		isObject,
		isArray,
		isArguments,
		isFunction,
		$typeof,
		
		$return,
		$try,
		
		emptyFunc,
		
		random,
		extend,
		clone,
		now,
		timedChunk,

		getLength,


		rebuild,
		pass,
		bind,
		bindNoEvent,

		formatDate,
		

		
		Class;

	/**
	 * 判断变量的值是否是 undefined
	 * Determines whether or not the provided object is undefined
	 * 
	 * @method isUndefined
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的值是 undefined 时返回 true
	 */
	isUndefined = function(o) {
		return typeof o === "undefined";
	};
		
	/**
	 * 判断变量的值是否是 null
	 * Determines whether or not the provided object is null
	 * 
	 * @method isNull
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的值是 null 时返回 true
	 */
	isNull = function(o) {
		return o === null;
	};
	
	/**
	 * 判断变量的类型是否是 Number
	 * Determines whether or not the provided object is a number
	 * 
	 * @memberOf Jet.prototype
	 * @method isNumber
	 * 
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的类型是 number 时返回 true
	 */
	isNumber = function(o) {
		return o && o.constructor === Number;
	};
	
	/**
	 * 判断变量的类型是否是 Boolean
	 * Determines whether or not the provided object is a boolean
	 * 
	 * 
	 * @method isBoolean
	 * @memberOf Jet.prototype
	 * 
	 * @static
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的类型是 boolean 时返回 true
	 */
	isBoolean = function(o) {
		return o && (o.constructor === Boolean);
	};
	
	/**
	 * 判断变量的类型是否是 String
	 * Determines whether or not the provided object is a string
	 * 
	 * 
	 * @method isString
	 * @memberOf Jet.prototype
	 * 
	 * @static
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的类型是 string 时返回 true
	 */
	isString = function(o) {
		return o && (o.constructor === String);
	};
	
	/**
	 * 判断变量的类型是否是 Object
	 * Determines whether or not the provided object is a object
	 * 
	 * 
	 * @method isObject
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的类型是 object 时返回 true
	 */
	isObject = function(o) {
		return (o && (o.constructor === Object))
			|| (String(o)==="[object Object]");
	};
	
	/**
	 * 判断变量的类型是否是 Array
	 * Determines whether or not the provided object is a array
	 * 
	 * 
	 * @method isArray
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的类型是 array 时返回 true
	 */
	isArray = function(o) {
		return o && (o.constructor === Array);
	};
	
	/**
	 * 判断变量的类型是否是 Arguments
	 * Determines whether or not the provided object is a arguments
	 * 
	 * 
	 * @method isArguments
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的类型是 arguments 时返回 true
	 */
	isArguments = function(o) {
		return o && o.length && o.callee;
	};
	
	/**
	 * 判断变量的类型是否是 Function
	 * Determines whether or not the provided object is a function
	 * 
	 * 
	 * @method isFunction
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {Boolean} 当 o 的类型是 function 时返回 true
	 */
	isFunction = function(o) {
		return o && (o.constructor === Function);
	};
	
	/**
	 * 判断变量类型的方法
	 * Determines the type of object
	 * 
	 * 
	 * @method $typeof
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 传入被检测变量的名称
	 * @return {String} 返回变量的类型，如果不识别则返回 other
	 */
	$typeof = function(o) {
		if(isUndefined(o)){
			return "undefined";
		}else if(isNull(o)){
			return "null";
		}else if(isNumber(o)){
			return "number";
		}else if(isBoolean(o)){
			return "boolean";
		}else if(isString(o)){
			return "string";
		}else if(isObject(o)){
			return "object";
		}else if(isArray(o)){
			return "array";
		}else if(isArguments(o)){
			return "arguments";
		}else if(isFunction(o)){
			return "function";
		}else{
			return "other";
		}
		
	};
	
	/**
	 * 生成随机数的方法
	 * 
	 * @method random
	 * @memberOf Jet.prototype
	 * 
	 * @param {Number} min 生成随机数的最小值
	 * @param {Number} max 生成随机数的最大值
	 * @return {Number} 返回生成的随机数
	 */
	random = function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	
	
	
	/**
	 * 克隆一个对象
	 * 
	 * @method clone
	 * @memberOf Jet.prototype
	 * 
	 * @param {Object} o 要克隆的对象
	 * @return {Object} 返回通过克隆创建的对象
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	var objA = {name: "Kinvix"};
	 * 	// 克隆一个 objA 对象，并存入 objB 中。
	 * 	var objB = J.clone(objA);
	 * };
	 */
	clone = function(o){
		var tempClass = function(){};
		tempClass.prototype = o;
		
		// 返回新克隆的对象
		return (new tempClass());
	};

	

	

	
	
	
	/**
	 * 生成一个返回值是传入的 value 值的函数
	 * 
	 * @method $return
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} value 要返回的值
	 * @return {Mixed} 返回一个返回值是 value 的函数
	 */
	$return = function(result){
		return J.isFunction(result) ? result : function(){
				return result;
			};
	};
	
	/**
	 * 从第一个函数开始try，直到尝试出第一个可以成功执行的函数就停止继续后边的函数，并返回这个个成功执行的函数结果
	 * 
	 * @method $try
	 * @memberOf Jet.prototype
	 * 
	 * @param {Function} fn1, fn2, .... 要尝试的函数
	 * @return {Mixed} 返回第一个成功执行的函数的返回值
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	// 按顺序执行 funcA, funcB, funcC，当中途有一个 func 的执行结果返回 true 则不再往下执行，并返回成功执行的 func 的返回值；
	 * 	J.$try(funcA, funcB, funcC);
	 * };
	 */
	$try = function(){
		var i,
			l = arguments.length,
			result;
			
		for(i = 0; i < l; i++){
			try{
				result = arguments[i]();
				// 如果上边语句执行成功则执行break跳出循环
				break;
			}catch(e){
				J.out("C.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
			}
		}
		return result;
	};
	
	/**
	 * 对一个对象或数组进行扩展
	 * 
	 * @method extend
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} beExtendObj 被扩展的对象或数组
	 * @param {Mixed} extendObj1, extendObj2, .... 用来参照扩展的对象或数组
	 * @return {Mixed} 返回被扩展后的对象或数组
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	// 用 objB 和objC 扩展 objA 对象；
	 * 	J.extend(objA, objB, objC);
	 * };
	 * 
	 */
	extend = function(beExtendObj, extendObj1, extendObj2){
    	var a = arguments,
    		i,
    		p,
    		beExtendObj,
    		extendObj;
    		
    	if(a.length === 1){
    		beExtendObj = this;
    		i=0;
    	}else{
    		beExtendObj = a[0] || {};
    		i=1;
    	}
    	
    	for(; i<arguments.length; i++){
    		extendObj = arguments[i];
			for(p in extendObj){
				var src = beExtendObj[p],
					obj = extendObj[p];
				if ( src === obj ){
					continue;
				}
				
				if ( obj && isObject(obj) && !obj.nodeType && !isFunction(obj)){
					src = beExtendObj[p] = {};
					src = extend( beExtendObj[p], 
						// Never move original objects, clone them
						obj || ( obj.length != null ? [ ] : { } ));

				// Don't bring in undefined values
				}else if ( obj !== undefined ){
					beExtendObj[p] = obj;
				}
			}
    	}

		return beExtendObj;
    };
    
    
    /*
	extend = function(beExtendObj, target, extendObj2) {
		
		// copy reference to target object
		var target = arguments[0] || {}, 
		i = 2, 
		length = arguments.length, 
		options;
	
	
		target = arguments[1] || {};


	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !J.isFunction(target) ){
			target = {};
		}
		// extend jQuery itself if only one argument is passed
		if ( length == i ) {
			target = this;
			--i;
		}
	
		for ( ; i < length; i++ ){
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ){
				// Extend the base object
				for ( var name in options ) {
					var src = target[ name ], 
						copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ){
						continue;
					}
					// Recurse if we're merging object values
					if ( copy && typeof copy === "object" && !copy.nodeType ){
						target[ name ] = extend( target, 
							// Never move original objects, clone them
							src || ( copy.length != null ? [ ] : { } )
						, copy );
	
					// Don't bring in undefined values
					}else if ( copy !== undefined ){
						target[ name ] = copy;
					}
				}
			}
		}
		// Return the modified object
		return target;
	};
    */
    
    /**
	 * 获取当前时间的函数
	 * 
	 * @method now
	 * @memberOf Jet.prototype
	 * 
	 * 
	 * 
	 * @example
	 * alert(J.now());
	 * 
	 */
    now = function(){
		return +new Date;
	}
	
    
	/**
	 * 通用分时处理函数
	 * 
	 * @method timedChunk
	 * @memberOf Jet.prototype
	 * 
	 * 
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * };
	 * 
	 */
    timedChunk = function(items, process, context, isShift, callback) {
        var todo = items.concat(), delay = 25;
        if(isShift){
        	todo = items;
        }
 
        window.setTimeout(function() {
            var start = +new Date();
 
            do {
                process.call(context, todo.shift());
            } while(todo.length > 0 && (+new Date() - start < 50));
 
            if(todo.length > 0) {
                window.setTimeout(arguments.callee, delay);
            } else if(callback) {
                callback(items);
            }
 
        }, delay);
    }
    

	
	/**
	 * 获取对象自身具有的属性和方法的数量
	 * 
	 * @method getLength
	 * @memberOf Jet.prototype
	 * 
	 * @param {Object} obj 要获取的对象
	 * @return {Number} 返回对象自身具有属性和方法的数量
	 */
	getLength = function(obj) {
		var p,
			count = 0;
		for(p in obj){
			if(obj.hasOwnProperty(p)){
				count++;
			}
		}
		return count;
	};
	
	/**
	 * 一个空函数函数
	 * 
	 * @memberOf Jet.prototype
	 */
    emptyFunc = function(){};
    


		
	/**
	 * 函数的重构方法
	 * 
	 * 
	 * @private
	 * @memberOf Jet.prototype
	 * @param {Object} option 选项对象
	 * @return {Function} 返回重构后的函数的执行结果
	 */
	rebuild = function(func, option){
		option = option || {};
		
		func.$$rebuildedFunc = func.$$rebuildedFunc || function(){
			var self2 = this,
				scope,
				args,
				returns;
			scope = option.contextObj || self2;
			args = Array.prototype.slice.call(arguments, 0);

			if(args !== undefined){
				args = args.concat(option.arguments);
			}
			if(option.event === false){
				args = args.slice(1);
			}

			return func.apply(scope, args);
		};

		return func.$$rebuildedFunc;
	};
	
	/**
	 * 给函数传入参数并执行
	 * 
	 * @memberOf Jet.prototype
	 * @param {Mixed} args 参数列表
	 * @return {Mixed} 返回函数执行结果
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	// 将"a"、"b"两个字符串传入funcA函数并执行
	 * 	funcA.pass("a","b");
	 * };
	 * 
	 */
	pass = function(func, var_args) {
		var slice = Array.prototype.slice;
		var a = slice.call(arguments, 1);
		return function(){
			var context = this;
			return func.apply(context, a.concat(slice.call(arguments)));
		};
	};
	/*
	pass = function(func){
		var args = Array.prototype.slice.call(arguments, 1);
		return rebuild(func, {contextObj: null, arguments: args});
	};
	*/
	
	/**
	 * 给函数绑定一个上下文对象再执行
	 * 
	 * @memberOf Jet.prototype
	 * @param {Object} contextObj 要绑定的上下文对象
	 * @param {Mixed} args 参数列表
	 * @return {Mixed} 返回函数执行结果
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	// 以 contextObjB 对象为上下文对象 this 来执行funcA函数
	 * 	funcA.bind(contextObjB);
	 * };
	 * 
	 */
	/*
	bind = function(func, contextObj){
		var args = Array.prototype.slice.call(arguments, 2);
		//args = [this].extend(args);
		return rebuild(func, {contextObj: contextObj, arguments: args});
	};
	*/
	
	/**
	 * 将一个函数绑定给一个对象作方法，返回的函数将总被传入{@code obj} as {@code this}
	 * 
	 * @memberOf Jet.prototype
	 * @param {Function} func 要绑定的函数
	 * @param {Object} contextObj 要绑定的对象
	 * @param {Mixed} args 参数列表，长度任意
	 * @return {Function} 返回一个被绑定this上下文对象的函数
	 * 
	 * @example
	 * Jet().$package(function(J){
	 *   funcB = J.bind(funcA, obj, a, b)
	 *   funcB(c, d) // 相当于执行 funcA.call(obj, a, b, c, d)
	 * };
	 */
	
	bind = function(func, context, var_args) {
		var slice = Array.prototype.slice;
		var a = slice.call(arguments, 2);
		return function(){
			return func.apply(context, a.concat(slice.call(arguments)));
		};
	};
	


	
	
	/**
	 * 让日期和时间按照指定的格式显示的方法
	 * 
	 * @memberOf Jet.prototype
	 * @param {String} format 格式字符串
	 * @return {String} 返回生成的日期时间字符串
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	var d = new Date();
	 * 	// 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
	 * 	J.formatDate(d, "YYYY-MM-dd hh:mm:ss");
	 * };
	 * 
	 */
	formatDate = function(date, format){
		/*
		 * eg:format="YYYY-MM-dd hh:mm:ss";
		 */
		var o = {
		"M+" :  date.getMonth()+1,  //month
		"d+" :  date.getDate(),     //day
		"h+" :  date.getHours(),    //hour
		"m+" :  date.getMinutes(),  //minute
		"s+" :  date.getSeconds(),	//second
		"q+" :  Math.floor((date.getMonth()+3)/3),  //quarter
		"S"  :  date.getMilliseconds() //millisecond
		}
	
		if(/(y+)/.test(format)){
			format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
		}
	
		for(var k in o){
			if(new RegExp("("+ k +")").test(format)){
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
			}
		}
		return format;
	};
	
	
	
	/**
	 * 创建Class类的类
	 * 
	 * @class Class
	 * @param {Object} option = {extend: superClass} 在option对象的extend属性中指定要继承的对象，可以不写
	 * @param {Object} object 扩展的对象
	 * @return {Object} 返回生成的日期时间字符串
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	var Person = new J.Class({
	 *  	init : function(name){
	 *  		this.name = name;
	 *  		alert("init");
	 *  	},
	 *  	showName : function(){
	 *  		alert(this.name);
	 *  
	 *  	}
	 *  
	 *  });
	 *  
	 *  // 继承Person
	 * 	var Person2 = new J.Class({extend : Person}, {
	 *  	init : function(name){
	 *  		this.name = name;
	 *  		alert("init");
	 *  	},
	 *  	showName : function(){
	 *  		alert(this.name);
	 *  
	 *  	}
	 *  
	 *  });
	 * 	
	 * };
	 * 
	 */
	Class = function(){
		var length = arguments.length;
		var option = arguments[length-1];
		
		option.init = option.init || function(){};
		
		// 如果参数中有要继承的父类
		if(length === 2){
			/**
			 * @ignore
			 */
			var superClass = arguments[0].extend;
			
			/**
			 * @ignore
			 */
			var tempClass = function() {};
			tempClass.prototype = superClass.prototype;
			
			/**
			 * @ignore
			 */
			var subClass = function() {
				this.init.apply(this, arguments);
			}
			
			// 加一个对父类原型引用的静态属性
			subClass.superClass = superClass.prototype;
			
			// 指定原型
			subClass.prototype = new tempClass();
			
			// 重新指定构造函数
			subClass.prototype.constructor = subClass;
			
			J.extend(subClass.prototype, option);
			
			// 重载init方法，插入对父类init的调用
			subClass.prototype.init = function(){
				// 调用父类的构造函数
				subClass.superClass.init.apply(this, arguments);
				// 调用此类自身的构造函数
				option.init.apply(this, arguments);
			};
			
			return subClass;
			
		// 如果参数中没有父类，则单纯构建一个类
		}else if(length === 1){
			/**
			 * @ignore
			 */
			var newClass = function() {
				this.init.apply(this, arguments);
			}
			newClass.prototype = option;
			return newClass;
		}
		
		
	};
	
	/*
	Class = function(obj){
		var tempClass = function() {
			this.init.apply(this, arguments);
		}
		tempClass.prototype = obj;
		return tempClass;
	};
	*/
	
	
	
	
	
	J.isUndefined = isUndefined;
	J.isNull = isNull;
	J.isNumber = isNumber;
	J.isString = isString;
	J.isBoolean = isBoolean;
	J.isObject = isObject;
	J.isArray = isArray;
	J.isFunction = isFunction;
	J.$typeof = $typeof;
	
	J.$return = $return;
	J.$try = $try;
	
	J.emptyFunc = emptyFunc;
	
	J.clone = clone;

	J.getLength = getLength;
	J.random = random;
	J.extend = extend;
	
	J.now = now;
	J.timedChunk = timedChunk;
	
	
	J.rebuild = rebuild;
	J.pass = pass;
	J.bind = bind;
	J.bindNoEvent = bindNoEvent;
	
	J.formatDate = formatDate;
	
	J.Class = Class;
	


});
















/**
 * 6.[Browser part]: Browser 资料分析包
 */
Jet().$package(function(J){
	J.browserOptions = {
		adjustBehaviors: true,
		htmlClass: true
	};
	//J.query = J.string.mapQuery(window.location.search);
	J.host = window.location.host;
	
	// 设置 domain
	// document.domain = 'kdv.cn';
	
	
	var pf = navigator.platform.toLowerCase(),
		ua = navigator.userAgent.toLowerCase(),
		plug = navigator.plugins,
		
		platform,
		browser,
		engine,

		toFixedVersion,
		s;
	
	/**
	 * @ignore
	 * @param String ver
	 * @param Number floatLength
	 * @return Number 
	 */
	toFixedVersion = function(ver, floatLength){
		floatLength = floatLength || 1;
		ver = String(ver).split(".");
		ver = ver[0] + "." + (ver[1] || "0");
		ver = Number(ver).toFixed(floatLength);
		return ver;
	};
	
	/**
	 * platform 名字空间
	 * 
	 * @namespace
	 * @name platform
	 * @type Object
	 */
	platform = {
		getPlatform:function(){
			return pf;
		},
		
		/**
    	 * @property name
		 * @lends platform
		 */
		name: (window.orientation != undefined) ? 'ipod' : (pf.match(/mac|win|linux/i) || ['unknown'])[0],
		
		version: 0,
		ipod: 0,
		win: 0,
		linux: 0,
		mac: 0,
		/**
		 * 设置浏览器类型和版本
		 * 
		 * @ignore
		 * @private
		 * @memberOf browser
		 * 
		 */
		set: function(name, ver){
			this.name = name;
			this.version = ver;
			this[name] = ver;
		}
	};
	
	platform[platform.name] = true;
	
	// 探测操作系统版本
    (s = ua.match(/windows ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
    (s = ua.match(/windows nt ([\d.]+)/)) ? platform.set("win",toFixedVersion(s[1])):
    (s = ua.match(/mac ([\d.]+)/)) ? platform.set("mac",toFixedVersion(s[1])):
    (s = ua.match(/ipod ([\d.]+)/)) ? platform.set("ipod",toFixedVersion(s[1])):
    (s = ua.match(/linux ([\d.]+)/)) ? platform.set("linux",toFixedVersion(s[1])) : 0;
	
	/**
	 * browser 名字空间
	 * 
	 * @namespace
	 * @name browser
	 */
	browser = {
		/**
    	 * @namespace
    	 * @name features
		 * @memberOf browser
		 */
		features: 
		/**
		 * @lends browser.features
		 */	
		{
			/**
	    	 * @property xpath
			 */
			xpath: !!(document.evaluate),
			
			/**
	    	 * @property air
			 */
			air: !!(window.runtime),
			
			/**
	    	 * @property query
			 */
			query: !!(document.querySelector)
		},
		
		getPlugins: function(){
			return plug;
		},
		
		/**
    	 * @namespace
    	 * @name plugins
		 * @memberOf browser
		 */
		plugins: {
			flash: (function(){
				var ver = "none";
				if (plug && plug.length) {
				    flash = plug['Shockwave Flash'];
				    if (flash && flash.description) {
				    	ver = toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
				    }
				} else {
					var startVer = 13;
				    while (startVer--) {
				        try {
				            new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
				            ver = toFixedVersion(startVer);
				            break;
				        } catch(e) {}
				    }
				}
				
				return ver;
			})()
		},
		
		
		
		/**
		 * @memberOf browser
		 */
		getUserAgent: function(){
			return ua;
		},
		
		/**
    	 * @property name
		 * @lends browser
		 */
		name: "unknown",
		
		/**
    	 * @property version
		 * @lends browser
		 */
		version: 0,
		
		/**
		 * IE 浏览器
		 * 
		 * @property ie
		 * @lends browser
		 */
		ie: 0,
		
		/**
		 * Firefox 浏览器
		 * 
		 * @property firefox
		 * @lends browser
		 */
		firefox: 0,
		
		/**
		 * Chrome 浏览器
		 * 
		 * @property chrome
		 * @lends browser
		 */
		chrome: 0,
		
		
		/**
		 * Opera浏览器
		 * 
		 * @property opera
		 * @lends browser
		 */
		opera: 0,
		
		/**
		 * Safari 浏览器
		 * 
		 * @property safari
		 * @lends browser
		 */
		safari: 0,
		
		/**
		 * 设置浏览器类型和版本
		 * 
		 * @ignore
		 * @private
		 * @memberOf browser
		 * 
		 */
		set: function(name, ver){
			this.name = name;
			this.version = ver;
			this[name] = ver;
		}
	};
	
	// 探测浏览器并存入 browser 对象
    (s = ua.match(/msie ([\d.]+)/)) ? browser.set("ie",toFixedVersion(s[1])):
    (s = ua.match(/firefox\/([\d.]+)/)) ? browser.set("firefox",toFixedVersion(s[1])) :
    (s = ua.match(/chrome\/([\d.]+)/)) ? browser.set("chrome",toFixedVersion(s[1])) :
    (s = ua.match(/opera.([\d.]+)/)) ? browser.set("opera",toFixedVersion(s[1])) :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? browser.set("safari",toFixedVersion(s[1])) : 0;
    
    //J.out(browser.name);
    //J.out(browser.ua);
    
    //!!navigator.userAgent.match(/Apple.*Mobile.*Safari/);
	
	/**
	 * engine 名字空间
	 * 
	 * @namespace
	 * @name engine
	 * @memberOf browser
	 */
	engine = {
		/**
    	 * @property name
		 * @lends browser.engine
		 */
		name: 'unknown',
		
		/**
    	 * @property version
		 * @lends browser.engine
		 */
		version: 0,
		
		/**
		 * trident 引擎的浏览器
		 * 
		 * @lends browser.engine
		 * @property trident
		 */
		trident: 0,
		
		/**
		 * gecko 引擎的浏览器
		 * 
		 * @lends browser.engine
		 * @property gecko
		 * 
		 */
		gecko: 0,
		
		/**
		 * webkit 引擎的浏览器
		 * 
		 * @lends browser.engine
		 * @property webkit
		 */
		webkit: 0,
		
		/**
		 * presto 引擎的浏览器
		 * 
		 * @lends browser.engine
		 * @property presto
		 */
		presto: 0,
		
		/**
		 * 设置浏览器引擎的类型和版本
		 * 
		 * @ignore
		 * @private
		 * @memberOf browser.engine
		 * 
		 */
		set: function(name, ver){
			this.name = name;
			this.version = ver;
			this[name] = ver;
		}
		
	};
	
	/*
	// 探测浏览器的内核并存入 browser.engine 对象
    (s = (!window.ActiveXObject) ? 0 : ((window.XMLHttpRequest) ? 5 : 4)) ? engine.set("trident", s):
    (s = (document.getBoxObjectFor == undefined) ? 0 : ((document.getElementsByClassName) ? 19 : 18)) ? engine.set("gecko",s) :
    (s = (navigator.taintEnabled) ? false : ((browser.features.xpath) ? ((browser.features.query) ? 525 : 420) : 419)) ? engine.set("webkit", s) :
    (s = (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925))) ? engine.set("presto", s) : 0;
    */
	
    // 探测浏览器的内核并存入 browser.engine 对象
	
    (s = ua.match(/trident\/([\d.]+)/)) ? engine.set("trident",toFixedVersion(s[1])):
    (s = ua.match(/gecko\/([\d.]+)/)) ? engine.set("gecko",toFixedVersion(s[1])) :
    (s = ua.match(/applewebkit\/([\d.]+)/)) ? engine.set("webkit",toFixedVersion(s[1])) :
    (s = ua.match(/presto\/([\d.]+)/)) ? engine.set("presto",toFixedVersion(s[1])) : 0;
    
	if(browser.ie){
		if(browser.ie == 6){
			engine.set("trident", toFixedVersion("4"));
		}else if(browser.ie == 7 || browser.ie == 8){
			engine.set("trident", toFixedVersion("5"));
		}
	}
    
    
    /**
	 * 调整浏览器行为
	 * 
	 * @ignore
	 */
	var adjustBehaviors = function() {
		// ie6 背景图片不能被缓存的问题
		if (browser.ie && browser.ie < 7) {
			try {
				document.execCommand('BackgroundImageCache', false, true);
			}catch(e){
				//J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
			}
		}
	}
	
	if(J.browserOptions.adjustBehaviors){
		 adjustBehaviors();
	}
	
	var filterDot = function(string){
		//return J.string.replaceAll(string, "\.", "_");
		return String(string).replace(/\./gi,"_");
	};
	
	// 给html标签添加不同浏览器的参数className
	var addHtmlClassName = function() {
		var htmlTag = document.documentElement;
    	var htmlClassName = [htmlTag.className];
    	htmlClassName.push('javascriptEnabled');
    	htmlClassName.push(platform.name);
    	htmlClassName.push(platform.name + filterDot(platform.version));
    	htmlClassName.push(browser.name);
    	htmlClassName.push(browser.name + filterDot(browser.version));
    	htmlClassName.push(engine.name);
    	htmlClassName.push(engine.name + filterDot(engine.version));
    	if(browser.plugins.flash){
    		htmlClassName.push("flash");
    		htmlClassName.push("flash" + filterDot(browser.plugins.flash));
    	}
    	htmlTag.className = htmlClassName.join(' ');
	}

	
    if(J.browserOptions.htmlClass){
    	addHtmlClassName();
    }
    
    



	
	
	
	
	// set reference
	var topNamespace = this, 
	    console,
	    firebug;
	
	// init debug console
	if (!topNamespace.console) {
	    console = topNamespace.console = {
	    	out: function() {},
	        log: function() {},
	        debug: function() {},
	        info: function() {},
	        warn: function() {},
	        error: function() {},
	        assert: function() {},
	        dir: function() {},
	        dirxml: function() {},
	        trace: function() {},
	        group: function() {},
	        groupCollapsed: function() {},
	        groupEnd: function() {},
	        time: function() {},
	        timeEnd: function() {},
	        profile: function() {},
	        profileEnd: function() {},
	        count: function() {}
	    };
	} else {
	    console = topNamespace.console;
	}
	
	
	

	
	J.platform = platform;
	J.browser = browser;
	J.browser.engine = engine;

	

	
});














/**
 * 7.[Browser part]: dom 扩展包
 */
Jet().$package(function(J){
	var $D,
		$B,
		id,
		name,
		tagName,
		getText,
		node,
		setClass,
		getClass,
		hasClass,
		addClass,
		removeClass,
		toggleClass,
		replaceClass,
		setStyle,
		getStyle,
		setCssText,
		getCssText,
		addCssText,
		show,
		isShow,
		recover,
		hide,
		
		getScrollLeft,
		getScrollTop,
		getScrollHeight,
		getScrollWidth,
		getClientHeight,
		getClientWidth,
		getOffsetHeight,
		getOffsetWidth,
		getClientXY,
		setClientXY,
		getXY,
		setXY,
		getRelativeXY,
		
		getSelection,
		getSelectionText,
		getTextFieldSelection,
		
	
		getDoc,
		getWin,
		w,
		getDocumentElement;
	/**
	 * dom 名字空间
	 * 
	 * @namespace
	 * @name dom
	 * @type Object
	 */
	J.dom = J.dom || {};
	$D = J.dom;
	$B = J.browser;
	
		

	// find targeted window and @TODO create facades
	w = ($D.win) ? ($D.win.contentWindow) : $D.win  || window;
	$D.win = w;
	$D.doc = w.document;
	
	/**
	 * 获取DocumentElement
	 * 
	 * @memberOf dom
	 */
	getDocumentElement = function(){
		if(document.compatMode === 'CSS1Compat'){
			return document.documentElement;
		}else{
			return document.body;
		}
		
	};
	
	/**
	 * 获取元素所属的根文档
	 * 
	 * @memberOf dom
	 */
	getDoc = function(element) {
		element = element || window.document;
		return (element["nodeType"] === 9) ? element : element["ownerDocument"]
			|| $D.doc;
	};
	
	/**
	 * 获取元素所属的 window 对象
	 * returns the appropriate window.
	 * 
	 * @memberOf dom
	 * @private
	 * @param {HTMLElement} element optional Target element.
	 * @return {Object} The window for the given element or the default window. 
	 */
	getWin = function(element) {
		var doc = getDoc(element);
		return (element.document) ? element : doc["defaultView"] ||
			doc["parentWindow"] || $D.win;
	};
	
	/**
	 * 
	 * 根据 id 获取元素
	 * 
	 * @method id
	 * @memberOf dom
	 * 
	 * @param {String} id 元素的 id 名称
	 * @param {Element} doc 元素所属的文档对象，默认为当前文档
	 * @return {Element} 返回元素
	 * 
	 * @example
	 * 
	 * 
	 */
	id = function(id, doc) {
		return getDoc(doc).getElementById(id);
	};
	
	/**
	 * 
	 * 根据 name 属性获取元素
	 * 
	 * @memberOf dom
	 * 
	 * @param {String} name 元素的 name 属性
	 * @param {Element} doc 元素所属的文档对象，默认为当前文档
	 * @return {Element} 返回元素
	 */
	name = function(name, doc) {
		var el = doc;
		return getDoc(doc).getElementsByName(name);
	};
	
	/**
	 * 
	 * 根据 tagName 获取元素
	 * 
	 * @memberOf dom
	 * 
	 * @param {String} tagName 元素的 tagName 标签名
	 * @param {Element} doc 元素所属的文档对象，默认为当前文档
	 * @return {Element} 返回元素
	 */
	tagName = function(tagName, el) {
		var el = el || getDoc();
		return el.getElementsByTagName(tagName);
	};
	
	/**
	 * 获取元素中的文本内容
	 * Returns the text content of the HTMLElement. 
	 * 
	 * @memberOf dom
	 * @param {HTMLElement} element The html element. 
	 * @return {String} The text content of the element (includes text of any descending elements).
	 */
	getText = function(element) {
		var text = element ? element[TEXT_CONTENT] : '';
		if (text === UNDEFINED && INNER_TEXT in element) {
			text = element[INNER_TEXT];
		} 
		return text || '';
	};

	/** 
	 * 生成一个 DOM 节点
     * Generates an HTML element, this is not appended to a document
     * 
     * @memberOf dom
     * 
     * @param type {string} the type of element
     * @param attr {string} the attributes
     * @param win {Window} optional window to create the element in
     * @return {HTMLElement} the generated node
     */
    node = function(type, attrObj, win){
        var p,
        	w = win || $D.win,
        	d = w.document,
        	n = d.createElement(type);

        for (p in attrObj) {
        	var mapObj = {
        		"class":function(){
        			n.className = attrObj[p];
        		}
        	}
			if(mapObj[p]){
				mapObj[p]();
			}else{
				n.setAttribute(p, attrObj[p]);
			}
        }

        return n;
    };
    
    


	/**
	 * 获取文档的 scroll 高度，即文档的实际高度
     * Returns the height of the document.
     * 
     * @method getDocumentHeight
     * @memberOf dom
     * 
     * @param {HTMLElement} element The html element. 
     * @return {Number} The height of the actual document (which includes the body and its margin).
     */
    getScrollHeight = function(el) {
        var scrollHeight;
    	if(el){
    		scrollHeight = el.scrollHeight;
    	}else{
    		scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    	}
        return scrollHeight || 0;
    };
    
    /**
     * 获取文档的 scroll 宽度，即文档的实际宽度
     * Returns the width of the document.
     * 
     * @method getDocumentWidth
     * @memberOf dom
     * 
     * @param {HTMLElement} element The html element. 
     * @return {Int} The width of the actual document (which includes the body and its margin).
     */
    getScrollWidth = function(el) {
        var scrollWidth;
    	if(el){
    		scrollWidth = el.scrollWidth;
    	}else{
    		scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    	}
        return scrollWidth || 0;
    };

    /**
     * 获取当前视窗的高度
     * Returns the current height of the viewport.
     * 
     * @method getViewportHeight
     * @memberOf dom
     * @return {Int} The height of the viewable area of the page (excludes scrollbars).
     */
    getClientHeight = function(el) {
    	var name = J.browser.engine.name;
    	if(name=="webkit" || name=="presto"){
    		el = el || w;
    		return el.innerHeight; // Safari, Opera
    	}else{
    		el = el || getDocumentElement();
    		return el.clientHeight; // IE, Gecko
    	}
    };
    
    /**
     * 获取元素的client宽度
     * Returns the current width of the viewport.
     * @method getViewportWidth
     * @memberOf dom
     * @param {Element} el 要获取client宽度的元素
     * @return {Number} 宽度值.
     */
    
    getClientWidth = function(el) {
    	var name = J.browser.engine.name;
    	if(name==="webkit" || name==="presto"){
    		el = el || w;
    		return el.innerWidth; // Safari, Opera
    	}else{
    		el = el || getDocumentElement();
    		return el.clientWidth; // IE, Gecko
    	}
    };
    
    
        /**
     * 获取当前视窗的高度
     * Returns the current height of the viewport.
     * 
     * @method getViewportHeight
     * @memberOf dom
     * @return {Int} The height of the viewable area of the page (excludes scrollbars).
     */
    getOffsetHeight = function(el) {
    	var name = J.browser.engine.name;
    	if(name=="webkit" || name=="presto"){
    		el = el || w;
    		return el.offsetHeight; // Safari, Opera
    	}else{
    		el = el || getDocumentElement();
    		return el.offsetHeight; // IE, Gecko
    	}
    };
    
    /**
     * 获取元素的client宽度
     * Returns the current width of the viewport.
     * @method getViewportWidth
     * @memberOf dom
     * @param {Element} el 要获取client宽度的元素
     * @return {Number} 宽度值.
     */
    
    getOffsetWidth = function(el) {
    	var name = J.browser.engine.name;
    	if(name==="webkit" || name==="presto"){
    		el = el || w;
    		return el.offsetWidth; // Safari, Opera
    	}else{
    		el = el || getDocumentElement();
    		return el.offsetWidth; // IE, Gecko
    	}
    };
    
    /**
     * 获取当前文档的左边已卷动的宽度
     * Returns the left scroll value of the document 
     * @method getDocumentScrollLeft
     * @memberOf dom
     * @param {HTMLDocument} document (optional) The document to get the scroll value of
     * @return {Int}  The amount that the document is scrolled to the left
     */
    getScrollLeft = function(el) {
    	var scrollLeft;
    	if(el){
    		scrollLeft = el.scrollLeft;
    	}else{
    		scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    	}
        return scrollLeft || 0;
    };

    /**
     * 获取当前文档的上边已卷动的宽度
     * Returns the top scroll value of the document 
     * @method getDocumentScrollTop
     * @memberOf dom
     * @param {HTMLDocument} document (optional) The document to get the scroll value of
     * @return {Int}  The amount that the document is scrolled to the top
     */
    getScrollTop = function(el) {
        var scrollTop;
    	if(el){
    		scrollTop = el.scrollTop;
    	}else{
    		scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    	}
        return scrollTop || 0;
    };

    
    /**
	 * 
	 * 设置元素的class属性
	 * 
	 * @method setClass
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
    setClass = function(el, className){
    	el.className = className;
    };
    
    /**
	 * 
	 * 获取元素的class属性
	 * 
	 * @method getClass
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
    getClass = function(el){
    	return el.className;
    };

    /**
	 * 
	 * 判断元素是否含有 class
	 * 
	 * @method hasClass
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
    hasClass = function(el, className){
		return el.className.indexOf(' ' + className + ' ') !== -1;
	};

	/**
	 * 
	 * 给元素添加 class
	 * 
	 * @method addClass
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
	addClass = function(el, className){
		if (!hasClass(el, className)){
			el.className = el.className + " " + className;
		}
	};

	/**
	 * 
	 * 给元素移除 class
	 * 
	 * @method addClass
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
    removeClass = function(el, className){
		el.className = el.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
	};
    
	/*
	removeClass2 = function(el, className){
    	replaceClass(el, className, "");
    };
	*/
    
    
    /**
	 * 
	 * 对元素 class 的切换方法，即：如果元素用此class则移除此class，如果没有此class则添加此class
	 * 
	 * @method toggleClass
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
    toggleClass = function(el, className){
		return hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
	};

	/**
	 * 
	 * 替换元素 oldClassName 为 newClassName
	 * 
	 * @method toggleClass
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} oldClassName 被替换的 class 名称
	 * @param {String} newClassName 要替换成的 class 名称
	 */
    replaceClass = function(el, oldClassName, newClassName){
    	removeClass(el, oldClassName);
    	addClass(el, newClassName);
    	//el.className = (" "+el.className+" ").replace(" "+oldClassName+" "," "+newClassName+" ");
    };
    /*
    replaceClass2 = function(el, oldClassName, newClassName){
    	var i,
    		tempClassNames = el.className.split(" ");
    		
		for(i=0; i<tempClassNames.length; i++){
			if(tempClassNames[i] === oldClassName){
				tempClassNames[i] = newClassName;
			}
		}
    	//J.out(tempClassNames);

    	el.className = tempClassNames.join(" ");
    };
    */
	
    /**
	 * 
	 * 设置元素的样式，css 属性需要用驼峰式写法，如：fontFamily
	 * 
	 * @method setStyle
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} styleName css 属性名称
	 * @param {String} value css 属性值
	 */
    setStyle = function(el, styleName, value){
		if(!el){
    		return;
    	}
    	
		var name = J.browser.name;
		if(styleName === "float" || styleName === "cssFloat"){
    		if(name === "ie"){
    			styleName = "styleFloat";
    		}else{
    			styleName = "cssFloat";
    		}
    	}
    	
    	//J.out(styleName);
    	
    	if(styleName === "opacity" && name === "ie"){
    		
    		el.style.filter = 'alpha(opacity=' + (value*100) + ')';
    		if(!el.style.zoom){
    			el.style.zoom = 1;
    		}
			return;
    	}
		el.style[styleName] = value;
    };
    
    /**
	 * 
	 * 获取元素的当前实际样式，css 属性需要用驼峰式写法，如：fontFamily
	 * 
	 * @method getStyle
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} styleName css 属性名称
	 * @return {String} 返回元素样式
	 */
    getStyle = function(el, styleName){
    	if(!el){
    		return;
    	}
    	
    	var win = getWin(el);
    	var name = J.browser.name;
    	//J.out(name);
		if(styleName === "float" || styleName === "cssFloat"){
    		if(name === "ie"){
    			styleName = "styleFloat";
    		}else{
    			styleName = "cssFloat";
    		}
    	}
    	if(styleName === "opacity" && name === "ie"){
    		var opacity = 1,
    			result = el.style.filter.match(/opacity=(\d+)/);
    		if(result && result[1]){
    			opacity = result[1]/100;
    		}
			return opacity;
    	}
    	
    	if(el.style[styleName]){
    		return el.style[styleName];
    	}else if(el.currentStyle){
    		//alert(el.currentStyle[styleName]);
    		return el.currentStyle[styleName];
    	}else if(win.getComputedStyle){
    		//J.out(win.getComputedStyle(el, null));
    		return win.getComputedStyle(el, null)[styleName];
    	}else if(document.defaultView && document.defaultView.getComputedStyle){
    		styleName = styleName.replace(/([/A-Z])/g, "-$1");
    		styleName = styleName.toLowerCase();
    		var style = document.defaultView.getComputedStyle(el, "");
    		return style && style.getPropertyValue(styleName);
    	}

    };
    
    
    
    
    /**
	 * 
	 * 给元素添加cssText
	 *  
	 * @method addCssText
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} cssText css 属性
	 */
    addCssText = function(el, cssText){
    	el.style.cssText += ';' + cssText;
    };
    
    /**
	 * 
	 * 给元素设置cssText
	 *  
	 * @method setCssText
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} cssText css 属性
	 */
    setCssText = function(el, cssText){
    	el.style.cssText = cssText;
    };
    /**
	 * 
	 * 获取元素的cssText
	 *  
	 * @method getCssText
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 */
    getCssText = function(el){
    	return el.style.cssText;
    };
    
    /**
	 * 
	 * 显示元素
	 * 
	 * @method show
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} displayStyle 强制指定以何种方式显示，如：block，inline，inline-block等等
	 */
    show = function(el, displayStyle){
    	var display;
    	var _oldDisplay = el.getAttribute("_oldDisplay");
    	
    	if(_oldDisplay){
    		display = _oldDisplay;
    	}else{
    		display = getStyle(el, "display");
    	}

    	if(displayStyle){
    		setStyle(el, "display", displayStyle);
    	}else{
	    	if(display === "none"){
	    		setStyle(el, "display", "block");
	    	}else{
	    		setStyle(el, "display", display);
	    	}
    	}
    };
    
    /**
	 * 
	 * 判断元素是否是显示状态
	 * 
	 * @method isShow
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 */
    isShow = function(el){
    	var display = getStyle(el, "display");
    	if(display === "none"){
    		return false;
    	}else{
    		return true;
    	}
    };
    
    /**
	 * 
	 * 还原元素原来的display属性
	 * 
	 * @method recover
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 */
    recover = function(el){
    	var display;
    	var _oldDisplay = el.getAttribute("_oldDisplay");
    	
    	if(_oldDisplay){
    		display = _oldDisplay;
    	}else{
    		display = getStyle(el, "display");
    	}
    	if(display === "none"){
    		setStyle(el, "display", "");
    	}else{
    		setStyle(el, "display", display);
    	}
    };
    
    /**
	 * 
	 * 隐藏元素
	 * 
	 * @method hide
	 * @memberOf dom
	 * 
	 * @param {Element} el 元素
	 */
    hide = function(el){
    	var display = getStyle(el, "display");
    	var _oldDisplay = el.getAttribute("_oldDisplay");
    	
    	if(!_oldDisplay){
    		if(display === "none"){
    			el.setAttribute("_oldDisplay", "");
    		}else{
    			el.setAttribute("_oldDisplay", display);
    		}
    	}
    	setStyle(el, "display", "none");
    };
	
    
    
    /**
	 * 获取对象坐标
	 *
	 * @method getClientXY
	 * @memberOf dom
	 * 
	 * @param {HTMLElement} el
	 * @return Array [top,left]
	 * @type Array
	 */
	getClientXY = function(el) {
		var _t = 0,
			_l = 0;

		if (el) {
			//这里只检查document不够严谨, 在el被侵染置换(jQuery做了这么恶心的事情)
			//的情况下, el.getBoundingClientRect() 调用回挂掉
			if (document.documentElement.getBoundingClientRect && el.getBoundingClientRect) { // 顶IE的这个属性，获取对象到可视范围的距离。
				//现在firefox3，chrome2，opera9.63都支持这个属性。
				var box = el.getBoundingClientRect();
				var oDoc = el.ownerDocument;
				
				var _fix = J.browser.ie ? 2 : 0; //修正ie和firefox之间的2像素差异
				
				_t = box.top - _fix + getScrollTop(oDoc);
				_l = box.left - _fix + getScrollLeft(oDoc);
			} else {//这里只有safari执行。
				while (el.offsetParent) {
					_t += el.offsetTop;
					_l += el.offsetLeft;
					el = el.offsetParent;
				}
			}
		}
		return [_l, _t];
	};
	
	/**
	 * 设置dom坐标
	 * 
	 * @method setClientXY
	 * @memberOf dom
	 
	 * @param {HTMLElement} el
	 * @param {string|number} x 横坐标
	 * @param {string|number} y 纵坐标
	 */
	setClientXY = function(el, x, y) {
		x = parseInt(x) + getScrollLeft();
		y = parseInt(y) + getScrollTop();
		setXY(el, x, y);
	};

	/**
	 * 获取对象坐标
	 * 
	 * @method getXY
	 * @memberOf dom
	 *
	 * @param {HTMLElement} el
	 * @return Array [top,left]
	 * @type Array
	 */
	getXY = function(el) {
		var xy = getClientXY(el);

		xy[0] = xy[0] + getScrollLeft();
		xy[1] = xy[1] + getScrollTop();
		return xy;
	}

	/**
	 * 设置dom坐标
	 * @method setXY
	 * @memberOf dom
	 * 
	 * @param {HTMLElement} el
	 * @param {string|number} x 横坐标
	 * @param {string|number} y 纵坐标
	 */
	setXY = function(el, x, y) {
		var _ml = parseInt(getStyle(el, "marginLeft")) || 0;
		var _mt = parseInt(getStyle(el, "marginTop")) || 0;

		setStyle(el, "left", parseInt(x) - _ml + "px");
		setStyle(el, "top", parseInt(y) - _mt + "px");
	};
	
	/**
	 * 获取对象坐标
	 *
	 * @method getRelativeXY
	 * @memberOf dom
	 * 
	 * @param {HTMLElement} el
	 * @return Array [top,left]
	 * @type Array
	 */
	getRelativeXY = function(el, relativeEl) {
		var xyEl = getXY(el);
		var xyRelativeEl = getXY(relativeEl);
		var xy=[];
		
		xy[0] = xyEl[0] - xyRelativeEl[0];
		xy[1] = xyEl[1] - xyRelativeEl[1];
		return xy;
	}
	
	/**
	 * 获取选择的文本
	 *
	 * @method getSelectionText
	 * @memberOf dom
	 * 
	 * @param {Window} win
	 * @return {String} 返回选择的文本
	 */
	getSelectionText = function(win) {
		win = win || window;
		var doc = win.document;
		if (win.getSelection) {
			// This technique is the most likely to be standardized.
			// getSelection() returns a Selection object, which we do not document.
			return win.getSelection().toString();
		}else if (doc.getSelection) {
			// This is an older, simpler technique that returns a string
			return doc.getSelection();
		}else if (doc.selection) {
			// This is the IE-specific technique.
			// We do not document the IE selection property or TextRange objects.
			return doc.selection.createRange().text;
		}
	
	};


	/**
	 * FireFox 下获取 input 或者 textarea 中选中的文字
	 *
	 * @method getTextFieldSelection
	 * @memberOf dom
	 * 
	 * @param {HTMLElement} el
	 * @return {String} 返回选择的文本
	 */
	getTextFieldSelection = function(el) {
		if (el.selectionStart != undefined && el.selectionEnd != undefined) {
			var start = el.selectionStart;
			var end = el.selectionEnd;
			return el.value.substring(start, end);
		}else{
			return ""; // Not supported on this browser
		}
	
	};
	
	
	
	
	
	
    
    
    var scripts = tagName("script");
    for(var i=0; i<scripts.length; i++){
    	
    	if(scripts[i].getAttribute("hasJet")=="true"){
    		//J.out("hasJet: "+(scripts[i].getAttribute("hasJet")=="true"));
    		J.src = scripts[i].src;
    	}
    }
    if(!J.src){
    	J.src = scripts[scripts.length-1].src;
    }
	
	J.filename = J.src.replace(/(.*\/){0,}([^\\]+).*/ig,"$2");
	//J.out(J.src+" _ "+J.filename)
	J.path = J.src.split(J.filename)[0];
	
	
	$D.getDoc = getDoc;
	
	$D.id = id;
	$D.name = name;
	$D.tagName = tagName;
	$D.getText = getText;
	$D.node = node;
	$D.setClass = setClass;
	$D.getClass = getClass;
	$D.hasClass = hasClass;
	
	$D.addClass = addClass;
	$D.removeClass = removeClass;
	$D.toggleClass = toggleClass;
	$D.replaceClass = replaceClass;
	
	$D.setStyle = setStyle;
	$D.getStyle = getStyle;
	
	$D.setCssText = setCssText;
	$D.getCssText = getCssText;
	$D.addCssText = addCssText;
	
	$D.show = show;
	$D.isShow = isShow;
	$D.recover = recover;
	$D.hide = hide;
	
	
	$D.getScrollLeft = getScrollLeft;
	$D.getScrollTop = getScrollTop;
	$D.getScrollHeight = getScrollHeight;
	$D.getScrollWidth = getScrollWidth;
	
	$D.getClientHeight = getClientHeight;
	$D.getClientWidth = getClientWidth;
	
	$D.getOffsetHeight = getOffsetHeight;
	$D.getOffsetWidth = getOffsetWidth;
	
	$D.getClientXY = getClientXY;
	$D.setClientXY = setClientXY;
	
	$D.getXY = getXY;
	$D.setXY = setXY;
	$D.getRelativeXY = getRelativeXY;
	$D.getSelection = getSelection;
	$D.getSelectionText = getSelectionText;
	
	$D.getTextFieldSelection = getTextFieldSelection;
	
	$D.getDocumentElement = getDocumentElement;
	
	
	
});


/**
 * 8.[Browser part]: event 扩展包
 */
Jet().$package(function(J){
	var $E,
		addEventListener,
		removeEventListener,
		onDomReady,
		isDomReady,
		Publish,
		addObserver,
		notifyObservers,
		removeObserver;
	/**
	 * event 名字空间
	 * 
	 * @namespace
	 * @name event
	 */
	J.event = J.event || {};
	
	$E = J.event;
	/*
	 	经典的彩蛋必备代码:老外称之为 Tweetable Konami code
		[上上下下左右左右BA]
		var k=[];
		addEventListener("keyup",function(e){ 
		   k.push(e.keyCode);
		   if(k.toString().indexOf("38,38,40,40,37,39,37,39,66,65")>=0){      
		       cheat();
		   }
		},true);
		
		什么不知道 Konami Code? 只能说明你没童年了 - -!
		http://en.wikipedia.org/wiki/Konami_Code
	 */
	
	// From: David Flanagan.
	// In DOM-compliant browsers, our functions are trivial wrappers around
	// addEventListener( ) and removeEventListener( ).
	if (document.addEventListener) {
		/**
		 * 
		 * 添加事件监听器
		 * 
		 * @method addEventListener
		 * @memberOf Event
		 * 
		 * @param element 元素
		 * @param eventType 事件类型，不含on
		 * @param handler 事件处理器
		 * @return {Element} 返回元素
		 */
		addEventListener = function(element, eventType, handler) {
			//var id = $E._uid( );  // Generate a unique property name
			var isExist = false;
			if(!element._eventTypes){
				element._eventTypes = {};
			}
			if (!element._eventTypes[eventType]){
				element._eventTypes[eventType] = [];
			}
	        element.addEventListener(eventType, handler, false);
	        
	        var handlers= element._eventTypes[eventType];
	        for(var i=0; i<handlers.length; i++){
	        	if(handlers[i] == handler){
	        		isExist = true;
	        	}
	        }
	        if(!isExist){
	        	handlers.push(handler);
	        }
		};
		
		/**
		 * 
		 * 移除事件监听器
		 * 
		 * @memberOf event
		 * @method removeEventListener
		 * 
		 * @param element 元素
		 * @param eventType 事件类型，不含on
		 * @param handler 事件处理器
		 * @return {Element} 返回元素
		 */
		removeEventListener = function(element, eventType, handler) {
			if(eventType){
				if(handler){
					element.removeEventListener(eventType, handler, false);
					if(element._eventTypes && element._eventTypes[eventType]){
						var handlers = element._eventTypes[eventType];
						for(var i=0; i<handlers.length; i++){
							if(handlers[i] === handler){
								handlers.splice(i, 1);
							}
						}
					}
				}else{
					
					if(element._eventTypes && element._eventTypes[eventType]){
						var handlers = element._eventTypes[eventType];
						
						for(var i=0; i<handlers.length; i++){
							element.removeEventListener(eventType, handlers[i], false);
						}
						element._eventTypes[eventType] = [];
					}
					
				}
			}else{
				if(element._eventTypes){
					var eventTypes = element._eventTypes;
					for(var p in eventTypes){
						var handlers = element._eventTypes[p];
						for(var i=0; i<handlers.length; i++){
							element.removeEventListener(p, handlers[i], false);
						}
					}
					eventTypes = {};
				}
			}
	        
			
		};
	}
	// In IE 5 and later, we use attachEvent( ) and detachEvent( ), with a number of
	// hacks to make them compatible with addEventListener and removeEventListener.
	else if (document.attachEvent) {
		/**
		 * 兼容ie的写法
		 * @ignore
		 */
		addEventListener = function(element, eventType, handler) {

			if ($E._find(arguments) != -1){
				return;
			}
		
			var wrappedEvent = function(e){
				if(!e){
					e = window.event;
				}

				var event = {
					_event: e,// In case we really want the IE event object
					
					type: e.type,           // Event type
	                target: e.srcElement,   // Where the event happened
	                currentTarget: element, // Where we're handling it
	                relatedTarget: e.fromElement ? e.fromElement : e.toElement,
	                eventPhase: (e.srcElement == element) ? 2 : 3,
	
	                // Mouse coordinates
	                clientX: e.clientX,
					clientY: e.clientY,
	                screenX: e.screenX,
					screenY: e.screenY,
					layerX: e.offsetX,
					layerY: e.offsetY,
					pageX: e.clientX + document.body.scrollLeft,
					pageY: e.clientY + document.body.scrollTop,
	                
	               // Key state
	                altKey: e.altKey,
					ctrlKey: e.ctrlKey,
	                shiftKey: e.shiftKey,
	                //原有的charCode
					charCode: e.keyCode,
					//keyCode
					keyCode: e.keyCode,
					/*
					 * keyCode 值附表：
					 * ===============================
					 * 
					 * 1.主键盘区字母和数字键的键码值
					 * 按键 	键码
					 * 0 	48
					 * 1 	49
					 * 2 	50
					 * 3 	51
					 * 4 	52
					 * 5 	53
					 * 6 	54
					 * 7 	55
					 * 8 	56
					 * 9 	57
					 * 
					 * A 	65
					 * B 	66
					 * C 	67
					 * D 	68
					 * E 	69
					 * F 	70
					 * G 	71
					 * H 	72
					 * I 	73
					 * J 	74
					 * K 	75
					 * L 	76
					 * M 	77
					 * N 	78
					 * O 	79
					 * P 	80
					 * Q 	81
					 * R 	82
					 * S 	83
					 * T 	84
					 * U 	85
					 * V 	86
					 * W 	87
					 * X 	88
					 * Y 	89
					 * Z 	90
					 * 
					 * 
					 * 3.控制键键码值
					 * 按键			键码
					 * BackSpace	8
					 * Tab			9
					 * Clear		12
					 * Enter		13
					 * Shift		16
					 * Control		17
					 * Alt			18
					 * Cape Lock	20
					 * Esc			27
					 * Spacebar		32 
					 * Page Up		33
					 * Page Down	34
					 * End			35
					 * Home			36
					 * Left Arrow	37
					 * Up Arrow 	38
					 * Right Arrow	39
					 * Down Arrow	40
					 * Insert		45
					 * Delete		46
					 * 
					 * Num Lock		144
					 * 
					 * ;:			186
					 * =+			187
					 * ,<			188
					 * -_			189
					 * .>			190
					 * /?			191
					 * `~			192
					 * 
					 * [{			219
					 * \|			220
					 * }]			221
					 * ’"			222
					 * 
					 * 2.功能键键码值
					 * F1 	112
					 * F2 	113
					 * F3 	114
					 * F4 	115
					 * F5 	116
					 * F6 	117
					 * F7 	118
					 * F8 	119
					 * F9 	120
					 * F10 	121
					 * F11 	122
					 * F12 	123
					 * 
					 * 2.数字键盘上的键的键码值
					 * 按键 	键码
					 * 0 	96
					 * 1 	97
					 * 2 	98
					 * 3 	99
					 * 4 	100
					 * 5 	101
					 * 6 	102
					 * 7 	103
					 * 8 	104
					 * 9 	105
					 * 
					 * * 	106
					 * + 	107
					 * Enter108
					 * - 	109
					 * . 	110
					 * / 	111
					 * 
					 */

	                stopPropagation: function(){
	                	this._event.cancelBubble = true;
	                },
	                preventDefault: function(){
	                	this._event.returnValue = false;
	                }
	            }
	

	            if (Function.prototype.call){
	                handler.call(element, event);
	            }else {
	                // If we don't have Function.call, fake it like this.
	                element._currentHandler = handler;
	                element._currentHandler(event);
	                element._currentHandler = null;
	            }
	        };
	
	        // Now register that nested function as our event handler.
	        element.attachEvent("on" + eventType, wrappedEvent);
	

	        var h = {
	            element: element,
	            eventType: eventType,
	            handler: handler,
	            wrappedEvent: wrappedEvent
	        };
	

	        var d = element.document || element;
	        // Now get the window associated with that document.
	        var w = d.parentWindow;
	
	        // We have to associate this handler with the window,
	        // so we can remove it when the window is unloaded.
	        var id = $E._uid( );  // Generate a unique property name
	        if (!w._allHandlers) w._allHandlers = {};  // Create object if needed
	        w._allHandlers[id] = h; // Store the handler info in this object
	
	        // And associate the id of the handler info with this element as well.
	        if (!element._handlers) element._handlers = [];
	        element._handlers.push(id);
	
	        // If there is not an onunload handler associated with the window,
	        // register one now.
	        if (!w._onunloadEventRegistered) {
	            w._onunloadEventRegistered = true;
	            w.attachEvent("onunload", $E._removeAllEvents);
	        }
	    };
		
	    /**
		 * 兼容ie的写法
		 * @ignore
		 */
	    removeEventListener = function(element, eventType, handler) {
	    	
	        // Find this handler in the element._handlers[] array.
	        var handlersIndex = $E._find(arguments);
	        if (handlersIndex == -1) return;  // If the handler was not registered, do nothing
	        // Get the window of this element.
	        var d = element.document || element;
	        var w = d.parentWindow;
			for(var j=0; j<handlersIndex.length; j++){
				var i = handlersIndex[j];
		        // Look up the unique id of this handler.
		        var handlerId = element._handlers[i];
		        // And use that to look up the handler info.
		        var h = w._allHandlers[handlerId];
		        // Using that info, we can detach the handler from the element.
		        element.detachEvent("on" + h.eventType, h.wrappedEvent);
		        // Remove one element from the element._handlers array.
		        element._handlers.splice(i, 1);
		        // And delete the handler info from the per-window _allHandlers object.
		        delete w._allHandlers[handlerId];
			}
	    };
	
	    // A utility function to find a handler in the element._handlers array
	    // Returns an array index or -1 if no matching handler is found
	    $E._find = function(args) {
	    	var element = args[0],
				eventType = args[1],
				handler = args[2],
				handlers = element._handlers;
				
	        if (!handlers){
	        	return -1;  // if no handlers registered, nothing found
	        }
	
	        // Get the window of this element
	        var d = element.document || element;
	        var w = d.parentWindow;
	
	        var handlersIndex = [];

			if(args.length === 3){
				// Loop through the handlers associated with this element, looking
		        // for one with the right type and function.
		        // We loop backward because the most recently registered handler
		        // is most likely to be the first removed one.
		        for(var i = handlers.length-1; i >= 0; i--) {
		            var handlerId = handlers[i];        // get handler id
		            var h = w._allHandlers[handlerId];  // get handler info
		            // If handler info matches type and handler function, we found it.
		            if (h.eventType == eventType && h.handler == handler){
		            	handlersIndex.push(i);
		                return handlersIndex;
		            }
		        }
			}else if(args.length === 2){
				
				for(var i = handlers.length-1; i >= 0; i--) {
		            var handlerId = handlers[i];        // get handler id
		            var h = w._allHandlers[handlerId];  // get handler info
		            // If handler info matches type and handler function, we found it.
		            if (h.eventType == eventType){
		                handlersIndex.push(i);
		            }
		        }
		        if(handlersIndex.length>0){
		        	return handlersIndex;
		        }
				
			}else if(args.length === 1){

				for(var i = handlers.length-1; i >= 0; i--) {
		            handlersIndex.push(i);
		        }
		        if(handlersIndex.length>0){
		        	return handlersIndex;
		        }
			}
	        
	        
	        
	        
	        
	        
	        return -1;  // No match found
	    };
	
	    $E._removeAllEvents = function( ) {
	        // This function is registered as the onunload handler with
	        // attachEvent. This means that the this keyword refers to the
	        // window in which the event occurred.
	        var id,
	        	w = this;
	
	        // Iterate through all registered handlers
	        for(id in w._allHandlers) {
	            // Get handler info for this handler id
	            var h = w._allHandlers[id];
	            // Use the info to detach the handler
	            h.element.detachEvent("on" + h.eventType, h.wrappedEvent);
	            // Delete the handler info from the window
	            delete w._allHandlers[id];
	        }
	    }
	
	    // Private utility to generate unique handler ids
	    $E._counter = 0;
	    $E._uid = function(){
	    	return "h" + $E._counter++;
	    };
	}
	
	
	
	
	
	
	
	
	
	/**
	 * 
	 * 文档加载完成时事件监听器
	 * 
	 * @method onDomReady
	 * @memberOf event
	 * 
	 * @param element 元素
	 * @param eventType 事件类型，不含on
	 * @param handler 事件处理器
	 */
	onDomReady = function( f ) {
	    // If the DOM is already loaded, execute the function right away
	    if ( onDomReady.done ) {
	    	return f();
	    }
	
	    // If we’ve already added a function
	    if ( onDomReady.timer ) {
	        // Add it to the list of functions to execute
	        onDomReady.ready.push( f );
	    } else {
	        // 初始化onDomReady后要执行的function的数组
	        onDomReady.ready = [ f ];
	        
	        // Attach an event for when the page finishes  loading,
	        // just in case it finishes first. Uses addEvent.
	        $E.on(window, "load", isDomReady);
	
	        //  Check to see if the DOM is ready as quickly as possible
	        onDomReady.timer = window.setInterval( isDomReady, 300 );
	    }
	}
	
	/**
	 * 
	 * 判断文档加载是否完成
	 * 
	 * @method isDomReady
	 * @memberOf event
	 * 
	 * @param element 元素
	 * @param eventType 事件类型，不含on
	 * @param handler 事件处理器
	 */
	// Checks to see if the DOM is ready for navigation
	isDomReady = function() {
	    // If we already figured out that the page is ready, ignore
	    if ( onDomReady.done ) {
	    	return true;
	    }
	
	    // Check to see if a number of functions and elements are
	    // able to be accessed
	    if ( document && document.getElementsByTagName && document.getElementById && document.body ) {
	    	// Remember that we’re now done
			onDomReady.done = true;
			
	        // If they’re ready, we can stop checking
	        window.clearInterval( onDomReady.timer );
	        onDomReady.timer = null;
	
	        // Execute all the functions that were waiting
	        for ( var i = 0; i < onDomReady.ready.length; i++ ){
	            onDomReady.ready[i]();
	        }

	        onDomReady.ready = null;
	        
	        return true;
	    }
	}
	
	
	
	
	/**
	 * 创建一个消息源发布者的类
	 * 
	 * @class Publish
	 * @return {Object} 返回生成的消息源
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	var onMsg = new J.Publish();
	 *  var funcA = function(option){
	 *  	alert(option);
	 *  };
	 *  // 注册一个事件的观察者
	 * 	onMsg.subscribe(funcA);
	 * 	var option = "demo";
	 * 	onMsg.deliver(option);
	 * 	onMsg.unsubscribe(funcA);
	 * 	onMsg.deliver(option);
	 * 	
	 * };
	 * 
	 */
	Publish = function(){
		this.subscribers = [];
	};
	
	/**
	 * 注册观察者
	 * @memberOf Publish.prototype
	 * @param {Function} func 要注册的观察者
	 * @return {Function} 返回结果
	 */
	Publish.prototype.subscribe = function(func){
		var alreadyExists = J.array.some(this.subscribers, function(el){
			return el === func;
		});
		if(!alreadyExists){
			this.subscribers.push(func);
		}
		return func;
	};
	
	/**
	 * 触发事件
	 * @memberOf Publish.prototype
	 * @param {Mixed} msg 要注册的观察者
	 * @return {Function} 返回结果
	 */
	Publish.prototype.deliver = function(msg){
		J.array.forEach(this.subscribers, function(fn){
			fn(msg);
		});
	};
	
	/**
	 * 注销观察者
	 * @memberOf Publish.prototype
	 * @param {Function} func 要注销的观察者
	 * @return {Function} 返回结果
	 */
	Publish.prototype.unsubscribe = function(func){
		this.subscribers = J.array.filter(this.subscribers, function(el){
			return el !== func;
		});
		return func;
	};
	
	
	
	
	
	
	
	
	/**
	 * 
	 * 为自定义Model添加事件监听器
	 * 
	 * @method addObserver
	 * @memberOf event
	 * 
	 * @param targetModel 目标 model，即被观察的目标
	 * @param eventType 事件类型，不含on
	 * @param handler 观察者要注册的事件处理器
	 */
	addObserver = function(targetModel, eventType, handler){
		var handlers,
			length,
			index,
			i;
		
		// 转换成完整的事件描述字符串
		eventType = "on" + eventType;
		
		// 判断对象是否含有$events对象
		if(!!!targetModel._$events){
			targetModel._$events={};
		}
		
		// 判断对象的$events对象是否含有eventType描述的事件类型
		if(!targetModel._$events[eventType]){
			//若没有则新建
			targetModel._$events[eventType]=[];
		}
	
		handlers = targetModel._$events[eventType];
		length = handlers.length;
		index = -1;
	
		// 通过循环，判断对象的handlers数组是否已经含有要添加的handler
		for(i=0; i<length; i++){
			if(handlers[i] === handler){
				index = i;
				break;
			}		
		}
		// 如果没有找到，则加入此handler
		if(index === -1){
			handlers.push(handler);
			//alert(handlers[handlers.length-1])
		}
	
	};
	
	/**
	 * 
	 * 触发自定义Model事件的监听器
	 * 
	 * @method notifyObservers
	 * @memberOf event
	 * 
	 * @param targetModel 目标 model，即被观察目标
	 * @param eventType 事件类型，不含on
	 * @param options 触发的参数对象
	 * @return {Boolean} 是否出发到至少一个的观察者
	 */
	notifyObservers = function(targetModel, eventType, argument){
		var handlers,
			length,
			i;
			
		eventType = "on" + eventType;
		
		if(targetModel._$events && targetModel._$events[eventType]){
			handlers = targetModel._$events[eventType];
			length = handlers.length;
			if(length > 0){
				// 通过循环，执行handlers数组所包含的所有函数function
				for(i=0; i<length; i++){
					handlers[i].apply(targetModel, [argument]);
				}
				return true;
			}
		}else{
			// throw new Error("还没有定义 [" + targetModel + "] 对象的: " + eventType + " 事件！");
			return false;
		}
	};
	
	
	/**
	 * 
	 * 为自定义 Model 移除事件监听器
	 * 
	 * @method removeObserver
	 * @memberOf event
	 * 
	 * @param targetModel 目标 model，即被观察的目标
	 * @param eventType 事件类型，不含on
	 * @param handler 观察者要取消注册的事件处理器
	 */
	// 按照对象和事件处理函数来移除事件处理函数
	removeObserver = function(targetModel, eventType, handler){
		var i,
			j,
			handlers,
			length,
			events = targetModel._$events;
		
		if(handler){
			
			if(events){
				eventType = "on" + eventType;
				handlers = events[eventType];
				
				if(handlers){
					length = handlers.length;
					for(i=0; i<length; i++){
						if(handlers[i] == handler){
							handlers[i] = null;
							handlers.splice(i, 1);
							break;
						}	
					}
				}
				
				
			}
		}else if(eventType){
			if(events){
				eventType = "on" + eventType;
				handlers = events[eventType];
				if(handlers){
					length = handlers.length;
					for(i=0; i<length; i++){
						handlers[i] = null;
					}
					delete events[eventType];
				}
				
			}
			
		}else if(targetModel){
			if(events){
				for(i in events){
					delete events[i];
				}
				delete targetModel._$events;
			}
		}

	};
	
	$E.addEventListener = addEventListener;
	$E.removeEventListener = removeEventListener;
	// alias
	$E.on = $E.addEventListener;
	$E.off = $E.removeEventListener;
	
	$E.onDomReady = onDomReady;
	
	$E.Publish = Publish;
	
	// Model 事件方法
	$E.addObserver = addObserver;
	$E.notifyObservers = notifyObservers;
	$E.removeObserver = removeObserver;
});










/**
 * 9.[Browser part]: http 包
 */
Jet().$package(function(J){
	var $=J.dom.id,
		$D=J.dom,
		$E=J.event,
		ajax,
		comet,
		load,
		loadCss,
		loadScript;
	
	// 兼容不同浏览器的 Adapter 适配层
	if(typeof window.XMLHttpRequest === "undefined"){
		window.XMLHttpRequest = function(){
			return new window.ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >=0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
		};
	}
	
	/**
	 * http 名字空间
	 * 
	 * @namespace
	 * @name http
	 */
	J.http = J.http || {};

	/**
	 * 这是Ajax对象名字空间的一个方法
	 * 
	 * @memberOf http
	 * @method	ajax
	 * 
	 * @param {Object} options 一个配置对象
	 * @return {Object} ajax 返回一个ajax对象
	 */
	ajax = function(uri, options){
		var httpRequest,
			httpSuccess,
			timeout,
			isTimeout = false,
			isComplete = false;
		
		options = {
			method: options.method || "GET",
			data: options.data || null,
			arguments: options.arguments || null,

			onSuccess: options.onSuccess || function(){},
			onError: options.onError || function(){},
			onComplete: options.onComplete || function(){},
			//尚未测试
			onTimeout: options.onTimeout || function(){},

			isAsync: options.isAsync || true,
			timeout: options.timeout ? options.timeout : 10000,
			contentType: options.contentType ? options.contentType : "utf-8",
			type: options.type || "xml"
		};
		uri = uri || "";
		timeout = options.timeout;
		
		
		httpRequest = new window.XMLHttpRequest();
		httpRequest.open(options.method, uri, options.isAsync);
		//设置编码集
		//httpRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		httpRequest.setRequestHeader("Content-Type",options.contentType);

		/**
		 * @ignore
		 */
		httpSuccess = function(r){
			try{
				return (!r.status && location.protocol == "file:")
					|| (r.status>=200 && r.status<300)
					|| (r.status==304)
					|| (navigator.userAgent.indexOf("Safari")>-1 && typeof r.status=="undefined");
			}catch(e){
				//J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
			}
			return false;
		}
		

		httpRequest.onreadystatechange=function (){
			if(httpRequest.readyState==4){
				if(!isTimeout){
					var o={};
						o.responseText = httpRequest.responseText;
						o.responseXML = httpRequest.responseXML;
						o.uri=uri;
						o.arguments=options.arguments;
						
					if(httpSuccess(httpRequest)){
						if(options.type === "script"){
							eval.call(window, data);
						}
						options.onSuccess(o);
						
					}else{
						options.onError(o);
					}
					options.onComplete(o);
				}
				isComplete = true;
				//删除对象,防止内存溢出
				httpRequest=null;
			}
		};
		
		httpRequest.send(options.data);
		
		window.setTimeout(function(){
			var o;
			if(!isComplete){
				isTimeout = true;
				o={};
				o.uri=uri;
				o.arguments=options.arguments;
				options.onTimeout(o);
				options.onComplete(o);
			}
		}, timeout);	
		
		return httpRequest;
	};

	
	/**
	 * comet方法
	 * 
	 * @memberOf http
	 * @method	comet
	 * @param {String} uri uri地址
	 * @param {Object} options 配置对象
	 * @return {Object} 返回一个comet dom对象
	 */
	comet = function(uri, options){

		uri = uri || "";
		options = {
			method : options.method || "GET",
			data : options.data || null,
			arguments : options.arguments || null,
			callback : options.callback || function(){},
			onLoad : options.onLoad || function(){},

			contentType: options.contentType ? options.contentType : "utf-8"
		};

		var connection;
		if(J.browser.ie){
			var htmlfile = new ActiveXObject("htmlfile");
			htmlfile.open();
			htmlfile.close();
			var iframediv = htmlfile.createElement("div");
			htmlfile.appendChild(iframediv);
			htmlfile.parentWindow._parent = self;
      		iframediv.innerHTML = '<iframe id="_cometIframe" src="'+uri+'?callback=window.parent._parent.'+options.callback+'"></iframe>';
      		
			connection = htmlfile.getElementById("_cometIframe");
		
		}
		else{
			connection = $D.node("iframe");
			connection.setAttribute("id", "_cometIframe");
			connection.setAttribute("src", uri+'?callback=window.parent._parent.'+options.callback);
			connection.style.position = "absolute";
			connection.style.visibility = "hidden";
			connection.style.left = connection.style.top = "-999px";
			connection.style.width = connection.style.height = "1px";
			document.body.appendChild(connection);
			self._parent = self;
		};

		$E.on(connection,"load", options.onLoad);

		return connection;
		
	};
	

	
	
	
	
	/**
	 * 这是load方法
	 * 
	 * @memberOf http
	 * @method load
	 * 
	 * @param {String} type 一个配置对象
	 * @param {Object} options 一个配置对象
	 * @return {Object} ajax 返回一个ajax对象
	 */
	load = function(type, uri, options){
		var node,
			linkNode,
			scriptNode,
			id,
			head = document.getElementsByTagName("head") ? document.getElementsByTagName("head")[0] : document.documentElement,
			timer,
			isTimeout = false,
			isComplete = false,
			options = options || {},
			query = options.query || null,
			arguments = options.arguments || null,
			
			onSuccess = options.onSuccess || function(){},
			onError = options.onError || function(){},
			onComplete = options.onComplete || function(){},
			purge,
			//尚未测试
			onTimeout = options.onTimeout || function(){},

			timeout = options.timeout ? options.timeout : 10000,
			charset = options.charset ? options.charset : "utf-8",
			win = options.win || window,
			o,
			
			getId;

        uri = uri || "";
		if(query !== null){
			uri = uri + "?" + query;
		}
		/**
		 * @ignore
		 */
		getId = function(){
	    	return load.Id++;
	    };
	    id = getId();
	    
	    /**
		 * @ignore
		 */
	    purge = function(id){
	    	head.removeChild($("jet_load_" + id));
	    };

        /**
	     * Generates a link node
	     * @method _linkNode
	     * @param uri {string} the uri for the css file
	     * @param win {Window} optional window to create the node in
	     * @return {HTMLElement} the generated node
	     * @private
	     */
	    linkNode = function(uri, win, charset) {
	        var c = charset || "utf-8";
	        return $D.node("link", {
		                "id":		"jet_load_" + id,
		                "type":		"text/css",
		                "charset":	c,
		                "rel":		"stylesheet",
		                "href":		uri
		            }, win);
	    };
	    
		/**
	     * Generates a script node
	     * @method _scriptNode
	     * @param uri {string} the uri for the script file
	     * @param win {Window} optional window to create the node in
	     * @return {HTMLElement} the generated node
	     * @private
	     */
	    scriptNode = function(uri, win, charset) {
	        var c = charset || "utf-8";
	        return $D.node("script", {
		                "id":		"jet_load_" + id,
		                "defer":	"defer",
		                "type":		"text/javascript",
		                "charset":	c,
		                "src":		uri
		            }, win);
	    };
	    
        
	    
	    if(type === "script"){
            node = options.node || scriptNode(uri, win, charset);
        }else if(type === "css"){
            node = options.node || linkNode(uri, win, charset);
        }
        
        
        
        if(J.browser.engine.trident){
            node.onreadystatechange = function() {
                var rs = this.readyState;
                if (rs === "loaded" || rs === "complete") {
                    node.onreadystatechange = null;

                    if(!isTimeout){
                    	isComplete = true;
                    	window.clearTimeout(timer);
                		timer = null;
                    	o={};
						o.id = id;
						o.uri = uri;
						o.arguments = arguments;
                    	onSuccess(o);
                    	onComplete(o);
                    	if(type === "script"){
	                		purge(id);
	                	}
                    }
                }
            };

        // webkit prior to 3.x is no longer supported
        }else if(J.browser.engine.webkit){
			
            // Safari 3.x supports the load event for script nodes (DOM2)
            $E.on(node, "load", function(){
            	var o;
                if(!isTimeout){
                	isComplete = true;
                	window.clearTimeout(timer);
                	timer = null;
                	o={};
					o.id = id;
					o.uri = uri;
					o.arguments = arguments;
                	onSuccess(o);
                	onComplete(o);
                	if(type === "script"){
                		purge(id);
                	}
                }
            });


        // FireFox and Opera support onload (but not DOM2 in FF) handlers for
        // script nodes.  Opera, but not FF, supports the onload event for link
        // nodes.
        }else{ 
			
            node.onload = function(){
            	var o;
            	//J.out("else:"+J.browser.engine.name);
                if(!isTimeout){
                	isComplete = true;
                	window.clearTimeout(timer);
                	timer = null;
                	o={};
					o.id = id;
					o.uri = uri;
					o.arguments = options.arguments;
                	onSuccess(o);
                	onComplete(o);
                	
                	if(type === "script"){
                		purge(id);
                	}
                }
            };

            node.onerror = function(e){
            	var o;
            	//J.out("else:"+J.browser.engine.name);
                if(!isTimeout){
                	isComplete = true;
                	window.clearTimeout(timer);
                	timer = null;
                	o={};
					o.id = id;
					o.uri = uri;
					o.arguments = arguments;
					o.error = e;
                	onError(o);
                	onComplete(o);
                	//if(type === "script"){
                		purge(id);
                	//}
                }
            };
        }
        if(options.node){
        	
        	if(type === "script"){
	            node.src = uri;
	        }else if(type === "css"){
	            node.href = uri;
	        }
        }else{
        	head.appendChild(node);
        }
       
        
        if(type === "script"){
            timer = window.setTimeout(function(){
				var o;
				if(!isComplete){
					isTimeout = true;
					o = {};
					o.uri = uri;
					o.arguments = arguments;
					onTimeout(o);
					onComplete(o);
					purge(id);
				}
			}, timeout);
        }
        
		var func = function(node){
			this._node = node;
			this._head = head;
		};
		func.prototype={
			abort:function(){
				this._node.src="";
				this._head.removeChild(this._node);
				delete this._node;
			}
			
		};
		return new func(node);
	};
	load.Id=0;
	
	/**
	 * 加载CSS
	 * 
	 * @memberOf http
	 * @method loadCss
	 * 
	 * @param {String} uri 一个uri
	 * @param {Object} options 一个配置对象
	 * @return {Object} ajax 返回一个ajax对象
	 */
	loadCss = function(uri, options){
		return load("css", uri, options);
	};
	
	/**
	 * 加载Javascript
	 * 
	 * @memberOf http
	 * @method loadScript
	 * 
	 * @param {String} uri 一个uri
	 * @param {Object} options 一个配置对象
	 * @return {Object} ajax 返回一个ajax对象
	 */
	loadScript = function(uri, options){
		return load("script", uri, options);
	};
	
	J.http.ajax = ajax;
	J.http.comet = comet;
	J.http.load = load;
	J.http.loadCss = loadCss;
	J.http.loadScript = loadScript;
});




/**
 * cookie类
 * 
 * @namespace J.cookie
 */
Jet().$package(function(J){
	var domainPrefix = window.location.host;
	
	/**
	 * @namespace cookie 名字空间
	 * @name cookie
	 */
	J.cookie = 
	/**
	 * @lends cookie
	 */	
	{
		
		/**
		 * 设置一个cookie
		 * 
		 * @param {String} name cookie名称
		 * @param {String} value cookie值
		 * @param {String} domain 所在域名
		 * @param {String} path 所在路径
		 * @param {Number} hour 存活时间，单位:小时
		 * @return {Boolean} 是否成功
		 */
		set : function(name, value, domain, path, hour) {
			if (hour) {
				var today = new Date();
				var expire = new Date();
				expire.setTime(today.getTime() + 3600000 * hour);
			}
			window.document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
			return true;
		},
	
		/**
		 * 获取指定名称的cookie值
		 * 
		 * @param {String} name cookie名称
		 * @return {String} 获取到的cookie值
		 */
		get : function(name) {
			var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
			// var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*?)(?:;|$)");
			var m = window.document.cookie.match(r);
			return (!m ? "" : m[1]);
			// document.cookie.match(new
			// RegExp("(?:^|;+|\\s+)speedMode=([^;]*?)(?:;|$)"))
		},
	
		/**
		 * 删除指定cookie,复写为过期
		 * 
		 * @param {String} name cookie名称
		 * @param {String} domain 所在域
		 * @param {String} path 所在路径
		 */
		remove : function(name, domain, path) {
			window.document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + domainPrefix + ";"));
		}
	};

});



