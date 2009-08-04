/**	
 * JET (Javascript Extend Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * http://code.google.com/p/j-et/
 * 
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview All JET base in one!
 * @version	1.0
 * @author	Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @title  JET Global
 * @description This is Javascript's original form.
 * 
 */

/**
 * [JET core]: JET 微内核
 */
;(function(){
	var Jet,
		version = 1.0,
		mark = "JetMark",
		VERSIONS = {},
		PACKAGES = {},
		topNamespace = this,
		out;

	/**
	 * @ignore
	 */
	out = function(msg, type){
		msg = String(msg);
		type = type || 3;
		if(this.Console){
			this.Console.out(msg, type);
		}else{
			alert(msg+"["+type+"]");
		}
		return msg;
	};
	
	// 将顶级命名空间中可能存在的 Jet 对象引入
	Jet = topNamespace.Jet;
	
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
			 * new Jet();
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
			 * Jet().$package("Tencent.WebQQ", function(J){
			 * 	var $ = J.Dom.id,
			 * 	$D = J.Dom,
			 * 	$E = J.Event,
			 * 	$H = J.Http;
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
						try{
							if(Jet.VERSIONS[ver]){
								J = Jet.VERSIONS[ver];
							}else{
								J = Jet.VERSIONS[Jet.DEFAULT_VERSION];
								throw new Error("No Jet version " + ver.toFixed(2) + ", so return Jet version " + Jet.DEFAULT_VERSION.toFixed(2) + "!");
							}
						}catch(e){
							J.out(e.fileName+";"+e.lineNumber+","+typeof e.stack+";"+e.name+","+e.message, 2);
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
				 * //在全局环境中创建Tencent.WebQQ名字空间, $namespace完成的操作相当于在全局环境中执行如下语句：
				 * //var Tencent = {};
				 * //Tencent.WebQQ = {};
				 * 
				 * J.$namespace("Tencent.WebQQ");
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

					for(i = (nis[0] == "window") ? 1 : 0; i < nis.length; i=i+1){
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
				 * //创建一个名字为Tencent.Kinvix的package包：
				 * Jet().$package("Tencent.Kinvix", function(J){
				 * 	//这时上下文对象this指向window下的Tencent.Kinvix对象
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
									throw new Error("Package name [" + name + "] is exist!");
								}else{
							   		Jet.PACKAGES[name] = {
										isLoaded: true,
										returnValue: returnValue
									};
								}
							}
							returnValue = func.call(ns, this);
						}else{
							throw new Error("Function required");
						}
					}catch(e){
						this.out(e, 1);
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
				 * 	J.out(J.checkPackage("Tencent.Kinvix"));
				 * };
				 * 
				 * 
				 * @example
				 * //创建一个名字为Tencent.Kinvix的package包：
				 * Jet().$package("Tencent.Kinvix", function(J){
				 * 	//这时上下文对象this指向window下的Tencent.Kinvix对象
				 * 	alert("Hello world! This is " + this);
				 * };
				 * 
				 * Jet().$package(function(J){
				 * 	// J.checkPackage("Tencent.Kinvix")结果返回的将是Tencent.Kinvix的引用
				 * 	var kinvix = J.checkPackage("Tencent.Kinvix");
				 * 	if(kinvix){
				 * 		J.out("Tencent.Kinvix包已加载...");
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
		out("Jet 微内核初始化失败，错误：" + e, 1);
	}
})();











/**
 * [Javascript core]: 常用工具函数扩展
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
		random,
		$return,
		$try,
		extend,
		forEach,
		getLength,
		Interface,
		toArray,
		clone,

		template,
		isURL,
		mapQuery;

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
		return o && o.legnth && o.callee;
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
	 * 将任意变量转换为数组的方法
	 * 
	 * @method toArray
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 任意变量
	 * @return {Array} 返回转换后的数组
	 */
	toArray = function(o){
		var type = $typeof(o);
		return (type) ? ((type != 'array' && type != 'arguments') ? [o] : o) : [];
	};
	
	/**
	 * 克隆一个变量
	 * 
	 * @method clone
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 任意类型的变量
	 * @return {Mixed} 返回通过克隆创建的变量
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	var objA = {name: "Kinvix"};
	 * 	// 克隆一个 objA 对象，并存入 objB 中。
	 * 	var objB = J.clone(objA);
	 * };
	 */
	clone = function(o){
		var i,
			cloned;
		if(J.isObject(o)){
			cloned = {};
		}else if(isArray(o) || isArguments(o)){
			cloned = [];
		}else{
			// 如果非数组和对象类型则直接返回此变量的值
			return o;
		}
		for(i in o){
			cloned[i] = o[i];
		}
		// 返回新克隆的对象
		return cloned;
	};

	
	
	
	/**
	 * 多行或单行字符串模板处理
	 * 
	 * @method template
	 * @memberOf Jet.prototype
	 * 
	 * @param {String} str 模板字符串
	 * @param {Object} obj 要套入的数据对象
	 * @return {String} 返回与数据对象合成后的字符串
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	// 用 obj 对象的数据合并到字符串模板中
	 * 	J.template("Hello, {name}!", {
	 * 		name:"Kinvix"
	 * 	});
	 * };
	 */
	template = function(str, obj){
		var p,
			RE;
	
		for(p in obj){
			if(obj.hasOwnProperty(p)){
				// RE = new RegExp("\\${" + p + "}","g");
				// str = str.replace(RE, o[p]);
				str = str.split("${" + p + "}").join(obj[p]);
			}
		}
		return str;
	}

	/**
	 * 判断是否是一个可接受的 url 串
	 * 
	 * @method isURL
	 * @memberOf Jet.prototype
	 * 
	 * @param {String} str 要检测的字符串
	 * @return {Boolean} 如果是可接受的 url 则返回 true
	 */
	isURL = function(str) {
		return isURL.RE.test(str);
	};
	
	/**
	 * @ignore
	 */
	isURL.RE = /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i;
	
	/**
	 * 将 uri 的查询字符串参数映射成对象
	 * 
	 * @method mapQuery
	 * @memberOf Jet.prototype
	 * 
	 * @param {String} uri 要映射的 uri
	 * @return {Object} 按照 uri 映射成的对象
	 * 
	 * @example
	 * Jet().$package(function(J){
	 * 	var url = "http://web.qq.com/?qq=4765078&style=blue";
	 * 	// queryObj 则得到一个{qq:"4765078", style:"blue"}的对象。
	 * 	var queryObj = J.mapQuery(url);
	 * };
	 */
	mapQuery = function(uri){
		//window.location.search
		var i,
			key,
			value,
			uri = uri || window.location.href,
			index = uri.indexOf("?"),
			pieces = uri.substring(index + 1).split("&"),
			params = {};
			
		for(i=0; i<pieces.length; i++){
			try{
				index = pieces[i].indexOf("=");
				key = pieces[i].substring(0,index);
				value = pieces[i].substring(index+1);
				if(!(params[key] = unescape(value))){
					throw new Error("uri has wrong query string.");
				}
			}
			catch(e){
				J.out(e);
			}
		}
		return params;
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
			}catch(e){}
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
	extend = function(beExtendObj, extendObj1, extendObj2 /*, ...*/){
    	var a = arguments,
    		i,
    		p,
    		beExtendObj,
    		extendObj;
    		
    	if(a.length === 1){
    		beExtendObj = this;
    	}else{
    		beExtendObj = a[0] || {};
    	}
    	
    	for(i=1; i<arguments.length; i++){
    		extendObj = arguments[i];
			for(p in extendObj){
				beExtendObj[p] = extendObj[p];
			}
    	}

		return beExtendObj;
    };
    
    /**
	 * 对对象或数组的每一个元素执行指定的函数
	 * 
	 * @method forEach
	 * @memberOf Jet.prototype
	 * 
	 * @param {Mixed} o 要遍历的对象或数组
	 * @param {Function} fn 要执行的函数
	 * @param {Array} args 要传入的参数数组
	 * @return {Mixed} 返回遍历完的对象或数组
	 */
    forEach = function(object, fn, args){
		var name,
			i = 0,
			length = object.length;

		if(args){
			if(length === undefined){
				for(name in object){
					if(fn.apply(object[name], args) === false){
						break;
					}
				}
			}else{
				for( ; i < length;){
					if(fn.apply(object[i++], args) === false){
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		}else{
			//J.out(length)
			if(length === undefined){
				for(name in object){
					if(fn.call(object[name], name, object[name]) === false){
						break;
					}
				}
			}else{
				for(var value = object[0]; (i < length && fn.call( value, i, value ) !== false); value = object[++i]){
				}
			}
		}

		return object;
	};
	
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
	 * 一个默认初始化的接口函数
	 * 
	 * @class Interface
	 * @lends Jet.prototype
	 */
    Interface = function(){
    	return function(){};
    };
	

	
	
	
	J.isUndefined = isUndefined;
	J.isNull = isNull;
	J.isNumber = isNumber;
	J.isString = isString;
	J.isBoolean = isBoolean;
	J.isObject = isObject;
	J.isArray = isArray;
	J.isFunction = isFunction;
	J.$typeof = $typeof;
	
	J.random = random;
	J.toArray = toArray;
	J.clone = clone;



	J.template = template;
	
	J.isURL = isURL;
	J.mapQuery = mapQuery;
	
	
	J.$return = $return;
	J.$try = $try;
	J.extend = extend;
	J.forEach = forEach;
	J.getLength = getLength;
	
	J.Interface = Interface;

});





/**
 * [Javascript core]: Native 对象扩展
 */
Jet().$package(function(J){
	
	/**
	 * @class String
	 * @name String
	 */
    J.extend(String.prototype,
    
	/**
	 * @lends String.prototype
	 */	
    {
    	/**
		 * 
		 * test的方法
		 * 
		 * @param {String, RegExp} regex 正则表达式，或者正则表达式的字符串
		 * @param {String} params 正则的参数
		 * @return {Boolean} 返回结果
		 */
		test: function(regex, params){
			return ((typeof regex == 'string') ? new RegExp(regex, params) : regex).test(this);
		},

		/**
		 * 判断是否含有指定的字符串
		 * 
		 * @param {String} string 是否含有的字符串
		 * @param {String} separator 分隔符，可选
		 * @return {Boolean} 如果含有，返回 true，否则返回 false
		 */
		contains: function(string, separator){
			return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : this.indexOf(string) > -1;
		},

		/**
		 * 清除字符串开头和结尾的空格
		 * 
		 * @return {String} 返回清除后的字符串
		 */
		trim: function(){
			return this.replace(/^\s+|\s+$/g, '');
		},
	
		/**
		 * 清除字符串开头和结尾的空格，并把字符串之间的多个空格转换为一个空格
		 * 
		 * @return {String} 返回清除后的字符串
		 */
		clean: function(){
			return this.replace(/\s+/g, ' ').trim();
		},
	
		/**
		 * 将“-”连接的字符串转换成驼峰式写法
		 * 
		 * @return {String} 返回转换后的字符串
		 */
		camelCase: function(){
			return this.replace(/-\D/g, function(match){
				return match.charAt(1).toUpperCase();
			});
		},
		
		/**
		 * 将驼峰式写法字符串转换成“-”连接的
		 * 
		 * @return {String} 返回转换后的字符串
		 */
		hyphenate: function(){
			return this.replace(/[A-Z]/g, function(match){
				return ('-' + match.charAt(0).toLowerCase());
			});
		},
	
		/**
		 * 将字符串转换成全大写字母
		 * 
		 * @return {String} 返回转换后的字符串
		 */
		capitalize: function(){
			return this.replace(/\b[a-z]/g, function(match){
				return match.toUpperCase();
			});
		},
	
		/**
		 * 转换 RegExp 正则表达式
		 * 
		 * @return {String} 返回转换后的字符串
		 */
		escapeRegExp: function(){
			return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
		},
	
		/**
		 * 将字符串转换成整数
		 * 
		 * @return {Number} 返回转换后的整数
		 */
		toInt: function(base){
			return parseInt(this, base || 10);
		},
	
		/**
		 * 将字符串转换成浮点数
		 * 
		 * @return {Number} 返回转换后的浮点数
		 */
		toFloat: function(){
			return parseFloat(this);
		},
	
		/**
		 * 将颜色 Hex 写法转换成 RGB 写法
		 * 
		 * @return {String} 返回转换后的字符串
		 */
		hexToRgb: function(array){
			var hex = this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
			return (hex) ? hex.slice(1).hexToRgb(array) : null;
		},
	
		/**
		 * 将颜色 RGB 写法转换成 Hex 写法
		 * 
		 * @return {String} 返回转换后的字符串
		 */
		rgbToHex: function(array){
			var rgb = this.match(/\d{1,3}/g);
			return (rgb) ? rgb.rgbToHex(array) : null;
		},
	
		/**
		 * 脱去script标签
		 * 
		 * @return {String} 返回转换后的字符串
		 */
		stripScripts: function(option){
			var scripts = '';
			var text = this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
				scripts += arguments[1] + '\n';
				return '';
			});
			if (option === true){
				$exec(scripts);
			}else if($type(option) == 'function'){
				option(scripts, text);
			}
			return text;
		},
	
		/**
		 * 。。。。
		 * 
		 * @return {String} 返回转换后的字符串
		 */
		substitute: function(object, regexp){
			return this.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
				if (match.charAt(0) == '\\') return match.slice(1);
				return (object[name] != undefined) ? object[name] : '';
			});
		},
		
		/**
		 * 全局替换指定的字符串
		 * 
		 * @return {String} 返回替换后的字符串
		 */
		replaceAll: function(reallyDo, replaceWith, ignoreCase) {
		    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
		        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
		    } else {
		        return this.replace(reallyDo, replaceWith);
		    }
		},
		
		/**
		 * 计算字符串的字节长度
		 * 
		 * @return {String} 返回自己长度
		 */
		byteLength: function(){
			return this.length+(this.match(/[^\x00-\xff]/g)).length;
		}
	});

	
	/**
	 * @class Array
	 * @name Array
	 */

	//标准方法跨浏览器统一
	/**
	 * 正向查找数组元素在数组中的索引下标
	 * 
	 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
	 * @lends Array.prototype
	 * @name indexOf
	 * 
	 * @param {Object} obj 要查找的数组元素
	 * @param {Number} fromIndex 开始的索引编号
	 * 
	 * @return {Number}返回正向查找的索引编号
	 */
	if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function (obj, fromIndex) {
	        if (fromIndex == null) {
	            fromIndex = 0;
	        } else if (fromIndex < 0) {
	            fromIndex = Math.max(0, this.length + fromIndex);
	        }
	        for (var i = fromIndex; i < this.length; i++) {
	            if (this[i] === obj)
	                return i;
	        }
	        return -1;
	    };
	}
	
	/**
	 * 反向查找数组元素在数组中的索引下标
	 * 
	 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
	 * @lends Array.prototype
	 * 
	 * @param {Object} obj 要查找的数组元素
	 * @param {Number} fromIndex 开始的索引编号
	 * 
	 * @return {Number}返回反向查找的索引编号
	 */
	if (!Array.prototype.lastIndexOf) {
	    Array.prototype.lastIndexOf = function (obj, fromIndex) {
	        if (fromIndex == null) {
	            fromIndex = this.length - 1;
	        } else if (fromIndex < 0) {
	            fromIndex = Math.max(0, this.length + fromIndex);
	        }
	        for (var i = fromIndex; i >= 0; i--) {
	            if (this[i] === obj)
	                return i;
	        }
	        return -1;
	    };
	}
	
	
	/**
	 * 遍历数组，把每个数组元素作为第一个参数来执行函数
	 * 
	 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:forEach
	 * @memberOf Array.prototype
	 * 
	 * @param {Function} fun 要执行的函数
	 * @param {Object} contextObj 执行函数时的上下文对象，可以省略
	 * 
	 */
	if (!Array.prototype.forEach) {
	    Array.prototype.forEach = function(fun /*, thisp*/) {
	        var len = this.length;
	        if (typeof fun != "function") {
	            throw new TypeError();
	        }
	        var thisp = arguments[1];
	        for (var i = 0; i < len; i++) {
	            if (i in this) {
	                fun.call(thisp, this[i], i, this);
	            }
	        }
	    };
	}
	
	/**
	 * 用一个自定义函数来过滤数组
	 * 
	 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:filter
	 * @memberOf Array.prototype
	 * 
	 * @param {Function} fun 过滤函数
	 * @param {Object} contextObj 执行函数时的上下文对象，可以省略
	 * 
	 * @return {Array}返回筛选出的新数组
	 */
	if (!Array.prototype.filter) {
	    Array.prototype.filter = function(fun) {
	        var len = this.length;
	        if (typeof fun != "function") {
	          throw new TypeError();
	        }
	        var res   = [];
	        var thisp = arguments[1];
	        for (var i = 0; i < len; i++) {
	            if (i in this) {
	                var val = this[i]; // in case fun mutates this
	                if (fun.call(thisp, val, i, this)) {
	                    res.push(val);
	                }
	            }
	        }
	        return res;
	    };
	}
	
	

	/**
	 * 遍历数组，把每个数组元素作为第一个参数来执行函数，并把函数的返回结果以映射的方式存入到返回的数组中
	 * 
	 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:map
	 * @memberOf Array.prototype
	 * 
	 * @param {Function} fun 过滤函数
	 * @param {Object} contextObj 执行函数时的上下文对象，可以省略
	 * 
	 * @return {Array}返回映射后的新数组
	 */
	if (!Array.prototype.map) {
	    Array.prototype.map = function(fun /*, thisp*/) {
	        var len = this.length;
	        if (typeof fun != "function") {
	            throw new TypeError();
	        }
	        var res   = new Array(len);
	        var thisp = arguments[1];
	        for (var i = 0; i < len; i++) {
	            if (i in this) {
	                res[i] = fun.call(thisp, this[i], i, this);
	            }
	        }
	
	        return res;
	    };
	}
	
	/**
	 * 遍历数组，把每个数组元素作为第一个参数来执行函数，如果有任意一个或多个数组成员使得函数执行结果返回 true，则最终返回 true，否则返回 false
	 * 
	 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some
	 * @memberOf Array.prototype
	 * 
	 * @param {Function} fun 要执行的函数
	 * @param {Object} contextObj 执行函数时的上下文对象，可以省略
	 * 
	 * @return {Boolean}
	 */
	if (!Array.prototype.some) {
	    Array.prototype.some = function(fun /*, thisp*/) {
	        var len = this.length;
	        if (typeof fun != "function") {
	            throw new TypeError();
	        }
	
	        var thisp = arguments[1];
	        for (var i = 0; i < len; i++) {
	            if (i in this && fun.call(thisp, this[i], i, this)) {
	                return true;
	            }
	        }
	
	        return false;
	    };
	}

	/**
	 * 遍历数组，把每个数组元素作为第一个参数来执行函数，如果所有的数组成员都使得函数执行结果返回 true，则最终返回 true，否则返回 false
	 * 
	 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
	 * @memberOf Array.prototype
	 * 
	 * @param {Function} fun 要执行的函数
	 * @param {Object} contextObj 执行函数时的上下文对象，可以省略
	 * 
	 * @return {Boolean}
	 */
	if (!Array.prototype.every) {
	    Array.prototype.every = function(fun) {
	        var len = this.length;
	        if (typeof fun != "function") {
	            throw new TypeError();
	        }
	        var thisp = arguments[1];
	        for (var i = 0; i < len; i++) {
	            if (i in this && !fun.call(thisp, this[i], i, this)) {
	                return false;
	            }
	        }
	        return true;
	    };
	}
	
	J.extend(Array.prototype,
	/**
	 * @lends Array.prototype
	 */	
	{

		/**
		 * 从数组中移除一个或多个数组成员
		 * 
		 * @param {Array} arr 要移除的数组成员，可以是单个成员也可以是成员的数组
		 */
		remove: function(arr){
			var arr = J.toArray(arr),
				i,
				j;
			for(i=0; i<arr.length; i++){
				for(j=0; j<this.length; j++){
					if(this[j] === arr[i]){
						this.splice(j,1);
					}
				}
			}
			return true;
		},
		/**
		 * 替换一个数组成员
		 * 
		 * @param {Object} oldValue 当前数组成员
		 * @param {Object} newValue 要替换成的值
		 * @return {Boolean} 如果找到旧值并成功替换则返回 true，否则返回 false
		 */
		replace: function(oldValue, newValue){
			var i;
			for(i=0; i<this.length; ij++){
				if(this[i] === oldValue){
					this[i] = newValue;
					return true;
				}else{
					return false;
				}
			}
		}
	});


	/**
	 * @class Function
	 * @name Function
	 */
    J.extend(Function.prototype,
    
	/**
	 * @lends Function.prototype
	 */
	{

    	/**
		 * 函数的重构方法
		 * 
		 * @private
		 * 
		 * @param {Object} option 选项对象
		 * @return {Function} 返回重构后的函数的执行结果
		 */
		rebuild: function(option){
			var self = this;
			option = option || {};
			
			self.$$rebuildedFn = function(){
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

				return self.apply(scope, args);
			};

			return self.$$rebuildedFn;
		},
		
		/**
		 * 给函数传入参数并执行
		 * 
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
		pass: function(){
			var args = arguments;
			return this.rebuild({contextObj: null, arguments: args});
		},
		
		/**
		 * 给函数绑定一个上下文对象再执行
		 * 
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
		bind: function(contextObj){
			var args = Array.prototype.slice.call(arguments, 1);
			//args = [this].extend(args);
			return this.rebuild({contextObj: contextObj, arguments: args});
		},

		/**
		 * 给函数绑定一个上下文对象,并剔除 event 事件对象参数后再执行
		 * 
		 * @param {Object} contextObj 要绑定的上下文对象
		 * @param {Mixed} args 参数列表
		 * @return {Mixed} 返回函数执行结果
		 * 
		 * @example
		 * Jet().$package(function(J){
		 * 	// 以 contextObjB 对象为上下文对象 this 来执行funcA函数，如果过函数被传入了 event 对象则会被去掉
		 * 	funcA.bindNoEvent(contextObjB);
		 * };
		 */
		bindNoEvent: function(contextObj){
			var args = Array.prototype.slice.call(arguments, 1);
			//args = [this].extend(args);
			return this.rebuild({contextObj: contextObj, arguments: args, event: false});
		}
		
	});
	
	
	
	
	
	/**
	 * 时间对象的格式化;
	 * 使用方法:
	 * var testDate = new Date();
	 * var testStr = testDate.format("yyyy年MM月dd日hh小时mm分ss秒");
	 * 
	 */
	
	/**
	 * @class Date
	 * @name Date
	 */
	J.extend(Date.prototype,

	/**
	 * @lends Date.prototype
	 */
	{
		
		/**
		 * 让日期和时间按照指定的格式显示的方法
		 * 
		 * @param {String} format 格式字符串
		 * @return {String} 返回生成的日期时间字符串
		 * 
		 * @example
		 * Jet().$package(function(J){
		 * 	var d = new Date();
		 * 	// 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
		 * 	d.format("YYYY-MM-dd hh:mm:ss");
		 * };
		 * 
		 */
		format: function(format){
			/*
			 * eg:format="YYYY-MM-dd hh:mm:ss";
			 */
			var o = {
			"M+" :  this.getMonth()+1,  //month
			"d+" :  this.getDate(),     //day
			"h+" :  this.getHours(),    //hour
			"m+" :  this.getMinutes(),  //minute
			"s+" :  this.getSeconds(),	//second
			"q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
			"S"  :  this.getMilliseconds() //millisecond
			}
		
			if(/(y+)/.test(format)){
				format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
			}
		
			for(var k in o){
				if(new RegExp("("+ k +")").test(format)){
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
				}
			}
			return format;
		}
	});


		

});

/**
 * [Javascript core]: I18n 国际化扩展
 */
Jet().$package(function(J){
	
	/**
	 * I18n 名字空间
	 * 
	 * @namespace
	 * @name I18n
	 */
	J.I18n = J.I18n || {};
	
	J.extend(J.I18n, 
		
	/**
	 * @lends I18n
	 * 
	 */		
	{
		
		/**
		 * 引用所有语言包的对象
		 * 
		 * @memberOf I18n
		 * @name langs
		 * @type {Object}
		 * 
		 */
		langs: {
			"en-us": {
				number:"ddd,ddd.dd",
				currency:"$ddd,ddd.dd",
				date: "MM/dd/yyyy",
				longDate:"yyyy year MM month dd day",
				time: "hh:mm:ss",
				text: {
					helloWorld:"Hello Word!",
					test: "test",
					about: "Jet Lib, Developer: Jetyu!"
				}
				
			}
		},

		/**
		 * 当前语言
		 * 
    	 * @memberOf I18n
		 * @name currentLang
		 * @type {Object}
		 */
		currentLang: null,
		
		/**
		 * 添加语言包对象
		 * 
		 * @param {Object} langObj 要添加的语言包对象
		 * 
		 * @example
		 * Jet().$package(function(J){
		 * 	// 添加一个名字为"zh-cn"中文语言包
		 * 	J.I18n.add({
		 * 		"zh-cn":{
		 * 			// 数字
		 * 			number:"ddd,ddd.dd",
		 * 			// 货币
		 * 			currency:"￥ddd,ddd.dd元",
		 * 			// 日期
		 * 			date: "yyyy-MM-dd",
		 * 			// 长日期
		 * 			longDate:"yyyy年MM月dd日",
		 * 			// 时间
		 * 			time: "hh小时mm分ss秒",
		 * 			// 文本
		 * 			text: {
		 * 				helloWorld:"你好,世界!",
		 * 				test: "测试",
		 * 				onlyDefaultHas: "只有默认语言才有的...",
		 * 				about: "Jet 框架, 开发者: 于涛!"
		 * 			}	
		 * 		}
		 * 	});
		 * };
		 */
		add: function(langObj){
			return J.extend(J.I18n.langs, langObj);
		},
		
		/**
    	 * 设置默认语言
		 * 
		 * @param {String} lang 语言包的名称
		 * 
		 * @example
		 * Jet().$package(function(J){
		 * 	// 将名字为"zh-cn"语言包设置为默认
		 * 	J.I18n.setDefault("zh-cn");
		 * };
		 */
		setDefault: function(lang){
			this.defaultLang = J.I18n.langs[lang];
			return this.defaultLang;
		},
		
		/**
    	 * 设置为当前语言
		 * 
		 * @param {String} lang 语言包的名称
		 * @param {Boolean} isSetDefault 是否同时设置为默认的语言
		 * 
		 * @example
		 * Jet().$package(function(J){
		 * 	// 将名字为"zh-cn"语言包设置为当前语言
		 * 	J.I18n.set("zh-cn");
		 * };
		 */
		set: function(lang, isSetDefault){
			this.currentLang = J.I18n.langs[lang];
			if(!this.defaultLang){
				this.defaultLang = this.currentLang;
			}
			this.text = this.text || {};
			return J.extend(this.text, this.defaultLang, this.currentLang.text);
		},
		
		/**
    	 * 按当前语言输出数字
    	 * 
		 * @param {Mixed} 数字
		 * @returns {String} 返回按当前语言输出的数字的字符串形式
		 */
		number:function(s){

	        if(/[^0-9\.]/.test(s)){
	        	return "invalid value";
	        }
	        s = s.replace(/^(\d*)$/,"$1.");
	        s = (s+"00").replace(/(\d*\.\d\d)\d*/,"$1");
	        s = s.replace(".",",");
	        var re = /(\d)(\d{3},)/;
	        while(re.test(s)){
	        	s = s.replace(re,"$1,$2");
	        }
	        s = s.replace(/,(\d\d)$/,".$1");
	        return s.replace(/^\./,"0.");
		},
		
		/**
    	 * 按当前语言输出日期
    	 * 
		 * @param {Mixed} 日期
		 * @returns {String} 返回按当前语言输出的日期字符串
		 * 
		 * @example
		 * Jet().$package(function(J){
		 * var d = new Date();
		 * 	// 安当前语言的格式输出时间字符串
		 * 	J.out(J.I18n.date(d));
		 * };
		 * 
		 */
		date: function(date){
			return date.format(J.I18n.currentLang.date);
		},
		
		/**
    	 * 按当前语言输出长日期
    	 * 
		 * @param {Mixed} 长日期
		 * @returns {String} 返回按当前语言输出的长日期字符串
		 */
		longDate: function(date){
			return date.format(J.I18n.currentLang.longDate);
		},
		
		/**
    	 * 按当前语言输出时间
    	 * 
		 * @param {Mixed} 时间
		 * @returns {String} 返回按当前语言输出的时间字符串
		 */
		time: function(time){
			return date.format(J.I18n.currentLang.time);
		},
		
		/**
    	 * @ignore
		 * @lends I18n
		 */
		toString: function(){
			return "";
		}
	
	
	});
	
	//将第一个设为默认
	for(var p in J.I18n.langs){
		J.I18n.set(p);
		break;
	}

});


/**
 * [Browser part]: Browser 资料分析包
 */
Jet().$package(function(J){
	var ua = navigator.userAgent.toLowerCase(),
		Platform,
		Browser,
		Engine,
		Support = {},
		loadBootOptions,
		s;
	/**
	 * Platform 名字空间
	 * 
	 * @namespace
	 * @name Platform
	 * @type Object
	 */
	Platform = {
		/**
    	 * @property name
		 * @lends Platform
		 */
		name: (window.orientation != undefined) ? 'ipod' : (navigator.platform.match(/mac|win|linux/i) || ['other'])[0].toLowerCase()
	};
	Platform[Platform.name] = true;
	
	/**
	 * Browser 名字空间
	 * 
	 * @namespace
	 * @name Browser
	 */
	Browser = {
		/**
    	 * @namespace
    	 * @name Features
		 * @memberOf Browser
		 */
		Features: 
		/**
		 * @lends Browser.Features
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
		/**
    	 * @namespace
    	 * @name Plugins
		 * @memberOf Browser
		 */
		Plugins: {},
		
		/**
    	 * @property ua
		 * @lends Browser
		 */
		ua: ua,
		
		/**
    	 * @property name
		 * @lends Browser
		 */
		name: "unknown",
		
		/**
    	 * @property version
		 * @lends Browser
		 */
		version: 0,
		
		/**
		 * IE 浏览器
		 * 
		 * @property ie
		 * @lends Browser
		 */
		ie: 0,
		
		/**
		 * Firefox 浏览器
		 * 
		 * @property firefox
		 * @lends Browser
		 */
		firefox: 0,
		
		/**
		 * Chrome 浏览器
		 * 
		 * @property chrome
		 * @lends Browser
		 */
		chrome: 0,
		
		
		/**
		 * Opera浏览器
		 * 
		 * @property opera
		 * @lends Browser
		 */
		opera: 0,
		
		/**
		 * Safari 浏览器
		 * 
		 * @property safari
		 * @lends Browser
		 */
		safari: 0,
		
		/**
		 * 设置浏览器类型和版本
		 * 
		 * @ignore
		 * @lends Browser
		 * 
		 */
		set: function(name, ver){
			this.name = name;
			this.version = ver;
			this[name] = ver;
		}
	};

	// 探测浏览器并存入 Browser 对象
    (s = ua.match(/msie ([\d.]+)/)) ? Browser.set("ie",Number(s[1])):
    (s = ua.match(/firefox\/([\d.]+)/)) ? Browser.set("firefox",Number(s[1])) :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Browser.set("chrome",Number(s[1])) :
    (s = ua.match(/opera.([\d.]+)/)) ? Browser.set("opera",Number(s[1])) :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Browser.set("version",Number(s[1])) : 0;
    
    //J.out(Browser.name);
    //J.out(Browser.ua);
    
    //!!navigator.userAgent.match(/Apple.*Mobile.*Safari/);
	
	/**
	 * Engine 名字空间
	 * 
	 * @namespace
	 * @name Engine
	 * @memberOf Browser
	 */
	Engine = {
		/**
    	 * @property name
		 * @lends Browser.Engine
		 */
		name: 'unknown',
		
		/**
    	 * @property version
		 * @lends Browser.Engine
		 */
		version: 0,
		
		/**
		 * trident 引擎的浏览器
		 * 
		 * @lends Browser.Engine
		 * @property trident
		 */
		trident: 0,
		
		/**
		 * gecko 引擎的浏览器
		 * 
		 * @lends Browser.Engine
		 * @property gecko
		 * 
		 */
		gecko: 0,
		
		/**
		 * webkit 引擎的浏览器
		 * 
		 * @lends Browser.Engine
		 * @property webkit
		 */
		webkit: 0,
		
		/**
		 * presto 引擎的浏览器
		 * 
		 * @lends Browser.Engine
		 * @property presto
		 */
		presto: 0,
		
		/**
		 * 设置浏览器引擎的类型和版本
		 * 
		 * @ignore
		 * @lends Engine
		 * 
		 */
		set: function(name, ver){
			this.name = name;
			this.version = ver;
			this[name] = ver;
		}
		
	};
	
	// 探测浏览器的内核并存入 Browser.Engine 对象
    (s = (!window.ActiveXObject) ? 0 : ((window.XMLHttpRequest) ? 5 : 4)) ? Engine.set("trident", s):
    (s = (document.getBoxObjectFor == undefined) ? 0 : ((document.getElementsByClassName) ? 19 : 18)) ? Engine.set("gecko",s) :
    (s = (navigator.taintEnabled) ? false : ((Browser.Features.xpath) ? ((Browser.Features.query) ? 525 : 420) : 419)) ? Engine.set("webkit", s) :
    (s = (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925))) ? Engine.set("presto", s) : 0;
    
    
	
    
    
    /**
	 * 调整浏览器行为
	 * 
	 * @ignore
	 */
	var adjustBehaviors = function() {
		// ie6 背景图片不能被缓存的问题
		if (Engine.trident && Engine.version < 7) {
			try {
				document.execCommand('BackgroundImageCache', false, true);
			}catch(e){}
		}
	}
    adjustBehaviors();
    
    
    
	
	//Support
	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + (new Date).getTime();

	div.style.display = "none";
	div.innerHTML = '   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.5;">a</a><select><option>text</option></select><object><param/></object>';

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	/**
	 * Support 名字空间
	 * 
	 * @namespace
	 * @name Support
	 * @memberOf Browser
	 */
	Support = {
		
		/**
		 * leadingWhitespace
		 * 
		 * @lends Browser.Support
		 * @property leadingWhitespace
		 * @type {Number} 
		 */
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType == 3,
		
		/**
		 * tbody
		 * 
		 * @lends Browser.Support
		 * @property tbody
		 * @type {Number} 
		 */
		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,
		
		// Make sure that you can get all elements in an <object> element
		// IE 7 always returns no results
		objectAll: !!div.getElementsByTagName("object")[0]
			.getElementsByTagName("*").length,
		
		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,
		
		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),
		
		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",
		
		// Make sure that element opacity exists
		// (IE uses filter instead)
		opacity: a.style.opacity === "0.5",
		
		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Will be defined later
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};
	
	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e){}

	root.insertBefore( script, root.firstChild );
	
	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		Support.scriptEval = true;
		delete window[ id ];
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function(){
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			Support.noCloneEvent = false;
			div.detachEvent("onclick", arguments.callee);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	/**
	 * compatMode
	 * 
	 * @lends Browser.Support
	 * @property compatMode
	 * @type {Number} 
	 */
	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	Support.compatMode = document.compatMode;
	
	
	/**
	 * loadBootOptions
	 * 
	 * @memberOf Jet.prototype
	 * @method loadBootOptions
	 */
	loadBootOptions = function(){
		var o = {};
		return o;
		
	};
	
	J.Platform=Platform;
	J.Browser = Browser;
	J.Browser.Engine = Engine;
	J.Browser.Support = Support;
	
	J.loadBootOptions = loadBootOptions;
	J.query = J.mapQuery(window.location.search);
	J.bootOptions = J.loadBootOptions();
	
});














/**
 * [Browser part]: Dom 扩展包
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
		show,
		hide,
		
		getScrollLeft,
		getScrollTop,
		getScrollHeight,
		getScrollWidth,
		getClientHeight,
		getClientWidth,
	
		getDoc,
		getWin,
		w,
		documentElement;
	/**
	 * Dom 名字空间
	 * 
	 * @namespace
	 * @name Dom
	 * @type Object
	 */
	J.Dom = J.Dom || {};
	$D = J.Dom;
	$B = J.Browser;
	
		

	// find targeted window and @TODO create facades
	w = ($D.win) ? ($D.win.contentWindow) : $D.win  || window;
	$D.win = w;
	$D.doc = w.document;
	
	if($B.Support.compatMode === 'CSS1Compat'){
		documentElement = document.documentElement;
	}else{
		documentElement = document.body;
	}
	
	/**
	 * 获取元素所属的根文档
	 * 
	 * @memberOf Dom
	 */
	getDoc = function(element) {
		element = element || {};
		return (element["nodeType"] === 9) ? element : element["ownerDocument"]
			|| $D.doc;
	};
	
	/**
	 * 获取元素所属的 window 对象
	 * returns the appropriate window.
	 * 
	 * @memberOf Dom
	 * @private
	 * @param {HTMLElement} element optional Target element.
	 * @return {Object} The window for the given element or the default window. 
	 */
	getWin= function(element) {
		var doc = getDoc(element);
		return (element.document) ? element : doc["defaultView"] ||
			doc["parentWindow"] || $D.win;
	};
	
	/**
	 * 
	 * 根据 id 获取元素
	 * 
	 * @method id
	 * @memberOf Dom
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
	 * @memberOf Dom
	 * 
	 * @param {String} name 元素的 name 属性
	 * @param {Element} doc 元素所属的文档对象，默认为当前文档
	 * @return {Element} 返回元素
	 */
	name = function(name, doc) {
		var el=(doc);
		return getDoc(doc).getElementsByName(name);
	};
	
	/**
	 * 
	 * 根据 tagName 获取元素
	 * 
	 * @memberOf Dom
	 * 
	 * @param {String} tagName 元素的 tagName 标签名
	 * @param {Element} doc 元素所属的文档对象，默认为当前文档
	 * @return {Element} 返回元素
	 */
	tagName = function(tagName, doc) {
		return doc.getElementsByTagName(tagName);
	};
	
	/**
	 * 获取元素中的文本内容
	 * Returns the text content of the HTMLElement. 
	 * 
	 * @memberOf Dom
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
     * @memberOf Dom
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
			n.setAttribute(p, attrObj[p]);
        }

        return n;
    };
    
    


	/**
	 * 获取文档的 scroll 高度，即文档的实际高度
     * Returns the height of the document.
     * 
     * @method getDocumentHeight
     * @memberOf Dom
     * 
     * @param {HTMLElement} element The html element. 
     * @return {Number} The height of the actual document (which includes the body and its margin).
     */
    getScrollHeight = function(el) {
        var el = el || documentElement;
        return el.scrollHeight;
    };
    
    /**
     * 获取文档的 scroll 宽度，即文档的实际宽度
     * Returns the width of the document.
     * 
     * @method getDocumentWidth
     * @memberOf Dom
     * 
     * @param {HTMLElement} element The html element. 
     * @return {Int} The width of the actual document (which includes the body and its margin).
     */
    getScrollWidth = function(el) {
        var el = el || documentElement;
        return el.scrollWidth;
    };

    /**
     * 获取当前视窗的高度
     * Returns the current height of the viewport.
     * 
     * @method getViewportHeight
     * @memberOf Dom
     * @return {Int} The height of the viewable area of the page (excludes scrollbars).
     */
    getClientHeight = function(el) {
    	var name = J.Browser.Engine.name;
    	if(name=="webkit" || name=="presto"){
    		el = el || w;
    		return el.innerHeight; // Safari, Opera
    	}else{
    		el = el || documentElement;
    		return el.clientHeight; // IE, Gecko
    	}
    };
    
    /**
     * 获取元素的client宽度
     * Returns the current width of the viewport.
     * @method getViewportWidth
     * @memberOf Dom
     * @param {Element} el 要获取client宽度的元素
     * @return {Number} 宽度值.
     */
    
    getClientWidth = function(el) {
    	var name = J.Browser.Engine.name;
    	if(name==="webkit" || name==="presto"){
    		el = el || w;
    		return el.innerWidth; // Safari, Opera
    	}else{
    		el = el || documentElement;
    		return el.clientWidth; // IE, Gecko
    	}
    };
    
    /**
     * 获取当前文档的左边已卷动的宽度
     * Returns the left scroll value of the document 
     * @method getDocumentScrollLeft
     * @memberOf Dom
     * @param {HTMLDocument} document (optional) The document to get the scroll value of
     * @return {Int}  The amount that the document is scrolled to the left
     */
    getScrollLeft = function(el) {
        el = el || documentElement;
        return el.scrollLeft;
    };

    /**
     * 获取当前文档的上边已卷动的宽度
     * Returns the top scroll value of the document 
     * @method getDocumentScrollTop
     * @memberOf Dom
     * @param {HTMLDocument} document (optional) The document to get the scroll value of
     * @return {Int}  The amount that the document is scrolled to the top
     */
    getScrollTop = function(el) {
        el = el || documentElement;
        return el.scrollTop;
    };

    
    /**
	 * 
	 * 设置元素的class属性
	 * 
	 * @method setClass
	 * @memberOf Dom
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
	 * @memberOf Dom
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
	 * @memberOf Dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
    hasClass = function(el, className){
		return el.className.contains(className, ' ');
	};

	/**
	 * 
	 * 给元素添加 class
	 * 
	 * @method addClass
	 * @memberOf Dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
	addClass = function(el, className){
		if (!hasClass(el, className)){
			el.className = (el.className + " " + className).clean();
		}
	};

	/**
	 * 
	 * 给元素移除 class
	 * 
	 * @method addClass
	 * @memberOf Dom
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
	 * @memberOf Dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} className class 名称
	 */
    toggleClass = function(el, className){
		return el.hasClass(className) ? el.removeClass(className) : el.addClass(className);
	};

	/**
	 * 
	 * 替换元素 oldClassName 为 newClassName
	 * 
	 * @method toggleClass
	 * @memberOf Dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} oldClassName 被替换的 class 名称
	 * @param {String} newClassName 要替换成的 class 名称
	 */
    replaceClass = function(el, oldClassName, newClassName){
    	el.className = (" "+el.className+" ").replace(" "+oldClassName+" "," "+newClassName+" ");
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
	 * @memberOf Dom
	 * 
	 * @param {Element} el 元素
	 * @param {String} styleName css 属性名称
	 * @param {String} value css 属性值
	 */
    setStyle = function(el, styleName, value){
		if(!el){
    		return;
    	}
    	
		var name = J.Browser.name;
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
	 * @memberOf Dom
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
    	var name = J.Browser.name;
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
    		return el.style[styleName];
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
	 * 显示元素
	 * 
	 * @method show
	 * @memberOf Dom
	 * 
	 * @param {Element} el 元素
	 */
    show = function(el){
    	var display;
    	if(el["$oldDisplay"]){
    		display = el["$oldDisplay"];
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
	 * @memberOf Dom
	 * 
	 * @param {Element} el 元素
	 */
    hide = function(el){
    	var display = getStyle(el, "display");
    	if(!el["$oldDisplay"]){
    		if(display === "none"){
    			el["$oldDisplay"] = "";
    		}else{
    			el["$oldDisplay"] = display;
    		}
    	}
    	setStyle(el, "display", "none");
    };
	
	
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
	
	$D.show = show;
	$D.hide = hide;
	
	
	$D.getScrollLeft = getScrollLeft;
	$D.getScrollTop = getScrollTop;
	$D.getScrollHeight = getScrollHeight;
	$D.getScrollWidth = getScrollWidth;
	
	$D.getClientHeight = getClientHeight;
	$D.getClientWidth = getClientWidth;
	
	
	
});


/**
 * [Browser part]: Event 扩展包
 */
Jet().$package(function(J){
	var $E,
		addEventListener,
		removeEventListener,
		onDOMReady,
		isDOMReady,
		addModelEvent,
		trigger,
		removeModelEvent;
	/**
	 * Event 名字空间
	 * 
	 * @namespace
	 * @name Event
	 */
	J.Event = J.Event || {};
	
	$E = J.Event;
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
			element.addEventListener(eventType, handler, false);
		};
		
		/**
		 * 
		 * 移除事件监听器
		 * 
		 * @memberOf Event
		 * @method removeEventListener
		 * 
		 * @param element 元素
		 * @param eventType 事件类型，不含on
		 * @param handler 事件处理器
		 * @return {Element} 返回元素
		 */
		removeEventListener = function(element, eventType, handler) {
			element.removeEventListener(eventType, handler, false);
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

			if ($E._find(element, eventType, handler) != -1){
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
	

	            if (Function.prototype.call)
	                handler.call(element, event);
	            else {
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
	        var i = $E._find(element, eventType, handler);
	        if (i == -1) return;  // If the handler was not registered, do nothing
	
	        // Get the window of this element.
	        var d = element.document || element;
	        var w = d.parentWindow;
	
	        // Look up the unique id of this handler.
	        var handlerId = element._handlers[i];
	        // And use that to look up the handler info.
	        var h = w._allHandlers[handlerId];
	        // Using that info, we can detach the handler from the element.
	        element.detachEvent("on" + eventType, h.wrappedEvent);
	        // Remove one element from the element._handlers array.
	        element._handlers.splice(i, 1);
	        // And delete the handler info from the per-window _allHandlers object.
	        delete w._allHandlers[handlerId];
	    };
	
	    // A utility function to find a handler in the element._handlers array
	    // Returns an array index or -1 if no matching handler is found
	    $E._find = function(element, eventType, handler) {
	        var handlers = element._handlers;
	        if (!handlers) return -1;  // if no handlers registered, nothing found
	
	        // Get the window of this element
	        var d = element.document || element;
	        var w = d.parentWindow;
	
	        // Loop through the handlers associated with this element, looking
	        // for one with the right type and function.
	        // We loop backward because the most recently registered handler
	        // is most likely to be the first removed one.
	        for(var i = handlers.length-1; i >= 0; i--) {
	            var handlerId = handlers[i];        // get handler id
	            var h = w._allHandlers[handlerId];  // get handler info
	            // If handler info matches type and handler function, we found it.
	            if (h.eventType == eventType && h.handler == handler)
	                return i;
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
	    $E._uid = function( ) { return "h" + $E._counter++; };
	}
	
	
	
	
	
	
	
	
	
	/**
	 * 
	 * 文档加载完成时事件监听器
	 * 
	 * @method onDOMReady
	 * @memberOf Event
	 * 
	 * @param element 元素
	 * @param eventType 事件类型，不含on
	 * @param handler 事件处理器
	 */
	onDOMReady = function( f ) {
	    // If the DOM is already loaded, execute the function right away
	    if ( onDOMReady.done ) return f();
	
	    // If we’ve already added a function
	    if ( onDOMReady.timer ) {
	        // Add it to the list of functions to execute
	        onDOMReady.ready.push( f  );
	    } else {
	        // Attach an event for when the page finishes  loading,
	        // just in case it finishes first. Uses addEvent.
	        $E.on(window, "load", isDOMReady);
	
	        // Initialize the array of functions to execute
	        onDOMReady.ready = [ f ];
	
	        //  Check to see if the DOM is ready as quickly as possible
	        onDOMReady.timer = setInterval( isDOMReady, 300 );
	    }
	}
	
	/**
	 * 
	 * 判断文档加载是否完成
	 * 
	 * @method isDOMReady
	 * @memberOf Event
	 * 
	 * @param element 元素
	 * @param eventType 事件类型，不含on
	 * @param handler 事件处理器
	 */
	// Checks to see if the DOM is ready for navigation
	isDOMReady = function() {
	    // If we already figured out that the page is ready, ignore
	    if ( onDOMReady.done ) return false;
	
	    // Check to see if a number of functions and elements are
	    // able to be accessed
	    if ( document && document.getElementsByTagName && 
	          document.getElementById && document.body ) {
	
	        // If they’re ready, we can stop checking
	        clearInterval( onDOMReady.timer );
	        onDOMReady.timer = null;
	
	        // Execute all the functions that were waiting
	        for ( var i = 0; i < onDOMReady.ready.length; i++ )
	            onDOMReady.ready[i]();
	
	        // Remember that we’re now done
	        onDOMReady.ready = null;
	        onDOMReady.done = true;
	    }
	}
	
	
	
	
	
	
	
	/**
	 * 
	 * 为自定义Model添加事件监听器
	 * 
	 * @method addModelEvent
	 * @memberOf Event
	 * 
	 * @param targetModel 目标 model，即被观察的目标
	 * @param eventType 事件类型，不含on
	 * @param handler 观察者要注册的事件处理器
	 */
	addModelEvent = function(targetModel, eventType, handler){
		var handlers,
			length,
			index,
			i;
		
		// 转换成完整的事件描述字符串
		eventType = "on" + eventType;
		
		// 判断对象是否含有$Events对象
		if(!targetModel._$Events){
			targetModel._$Events={};
		}
		
		// 判断对象的$Events对象是否含有eventType描述的事件类型
		if(!targetModel._$Events[eventType]){
			//若没有则新建
			targetModel._$Events[eventType]=[];
		}
	
		handlers = targetModel._$Events[eventType];
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
	 * @method trigger
	 * @memberOf Event
	 * 
	 * @param targetModel 目标 model，即被观察目标
	 * @param eventType 事件类型，不含on
	 * @param options 触发的参数对象
	 * @return {Boolean} 是否出发到至少一个的观察者
	 */
	trigger = function(targetModel, eventType, options){
		var handlers,
			length,
			i;
			
		eventType = "on" + eventType;
		
		if(targetModel._$Events && targetModel._$Events[eventType]){
			handlers = targetModel._$Events[eventType];
			length = handlers.length;

			// 通过循环，执行handlers数组所包含的所有函数function
			for(i=0; i<length; i++){
				handlers[i].apply(targetModel, J.toArray(options));
			}
			return true;
		}else{
			// throw new Error("还没有定义 [" + targetModel + "] 对象的: " + eventType + " 事件！");
			return false;
		}
	};
	
	
	/**
	 * 
	 * 为自定义 Model 移除事件监听器
	 * 
	 * @method removeModelEvent
	 * @memberOf Event
	 * 
	 * @param targetModel 目标 model，即被观察的目标
	 * @param eventType 事件类型，不含on
	 * @param handler 观察者要取消注册的事件处理器
	 */
	// 按照对象和事件处理函数来移除事件处理函数
	removeModelEvent = function(targetModel, eventType, handler){
		var i,
			j,
			handlers,
			length,
			events = targetModel._$Events;
		
		if(handler){
			if(events){
				eventType = "on" + eventType;
				handlers = events[eventType];
				if(handlers){
					length = handlers.length;
					for(i=0; i<length; i++){
						if(handlers[i] === handler){
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
				delete targetModel._$Events;
			}
		}

	};
	
	$E.addEventListener = addEventListener;
	$E.removeEventListener = removeEventListener;
	// alias
	$E.on = $E.addEventListener;
	$E.off = $E.removeEventListener;
	
	$E.onDOMReady = onDOMReady;
	
	// Model 事件方法
	$E.addModelEvent = addModelEvent;
	$E.trigger = trigger;
	$E.removeModelEvent = removeModelEvent;
});










/**
 * [Browser part]: Http 包
 */
Jet().$package(function(J){
	var $=J.Dom.id,
		$D=J.Dom,
		$E=J.Event,
		ajax,
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
	 * Http 名字空间
	 * 
	 * @namespace
	 * @name Http
	 */
	J.Http = J.Http || {};

	/**
	 * 这是Ajax对象名字空间的一个方法
	 * 
	 * @memberOf Http
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
		uri = uri || "",
		timeout = options.timeout;
		
		
		httpRequest = new window.XMLHttpRequest();
		httpRequest.open(options.method, uri, options.isAsync);
		//设置编码集
		//httpRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		httpRequest.setRequestHeader("Content-Type",options.contentType);

		/**
		 * @ignore
		 */
		httpSuccess=function(r){
			try{
				return (!r.status && location.protocol == "file:")
					|| (r.status>=200 && r.status<300)
					|| (r.status==304)
					|| (navigator.userAgent.indexOf("Safari")>-1 && typeof r.status=="undefined");
			}catch(e){}
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
			}
		}, timeout);	
		
		return httpRequest;
	};

	
	
	
	
	/**
	 * 这是Ajax对象名字空间的一个方法
	 * 
	 * @memberOf Http
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
			head = document.getElementsByTagName("head")[0],
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
		                "id":      "jet_load_" + id,
		                "type":    "text/css",
		                "charset": c,
		                "rel":     "stylesheet",
		                "href":    uri
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
		                "id":      "jet_load_" + id,
		                "type":    "text/javascript",
		                "charset": c,
		                "src":     uri
		            }, win);
	    };
	    
        
	    
	    if(type === "script"){
            node = scriptNode(uri, win, charset);
        }else if(type === "css"){
            node = linkNode(uri, win, charset);
        }
        
        
        
        if(J.Browser.Engine.trident){
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
        }else if(J.Browser.Engine.webkit){

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
            	//J.out("else:"+J.Browser.Engine.name);
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
            	//J.out("else:"+J.Browser.Engine.name);
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
        
        head.appendChild(node);
        
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
        
		
		return true;
	};
	load.Id=0;
	
	/**
	 * 加载CSS
	 * 
	 * @memberOf Http
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
	 * @memberOf Http
	 * @method loadScript
	 * 
	 * @param {String} uri 一个uri
	 * @param {Object} options 一个配置对象
	 * @return {Object} ajax 返回一个ajax对象
	 */
	loadScript = function(uri, options){
		return load("script", uri, options);
	};
	
	J.Http.ajax = ajax;
	J.Http.load = load;
	J.Http.loadCss = loadCss;
	J.Http.loadScript = loadScript;
});




/**
 * [Browser part]: Console 控制台
 */
Jet().$package(function(J){
	var $ = J.Dom.id,
		$D = J.Dom,
		$E = J.Event,
		$H = J.Http;
		
	
	
	var _open=window.open;
	var open=function(sURL, sName, sFeatures, bReplace){
		if(sName == undefined){
			sName="_blank";
		};
		if(sFeatures == undefined){
			sFeatures="";
		};
		if(bReplace == undefined){
			bReplace=false;
		};
		
		var win=_open(sURL, sName, sFeatures, bReplace);
		if(!win){
			J.out('天啦！你的机器上竟然有软件拦截弹出窗口耶~~~');
			return false;
		}
		
		return true;
	};
	window.open = open;
	
	
	
	
	
	
	
	J.config={
		debugLevel: 1
	};
	
	
	
	
	
	/**
	 * Jet 控制台，用于显示调试信息以及进行一些简单的脚本调试等操作。可以配合 J.debug J.runtime 来进行数据显示和调试.
	 * 
	 * @type Console
	 * @namespace
	 * @name Console
	 */
	J.Console = {
		/**
		 * 在Console里显示信息
		 * 
		 * @param {String} msg 信息
		 * @param {Number} type 信息类型, 可以参考 J.Console.TYPE <br/> TYPE:{<br/>
		 *            &nbsp;&nbsp;&nbsp; DEBUG:0,<br/> &nbsp;&nbsp;&nbsp; ERROR:1,<br/>
		 *            &nbsp;&nbsp;&nbsp; WARNING:2,<br/> &nbsp;&nbsp;&nbsp; INFO:3,<br/>
		 *            &nbsp;&nbsp;&nbsp; PROFILE:4<br/> }<br/>
		 * 
		 * @example
		 * J.Console.print("这里是提示信息",J.Console.TYPE.ERROR)
		 */
		print : function(msg, type){
			if(J.Console.log){
				J.Console.log((type === 4 ? (new Date() + ":") : "") + msg);
			}
		}
	};

	/**
	 * 数据监控和上报系统
	 * 
	 * @ignore
	 * @type J.Report
	 */
	J.Report = {
		/**
		 * 数据分析上报接口
		 * 
		 * @param {string} source 数据来源
		 * @param {number} type 数据返回结果,<br/> <br/>1 加载完成 <br/>2 加载失败 <br/>3 数据异常
		 *            无法解释/截断 <br/>4 速度超时 <br/>5 访问无权限 <br/> 对应的转义符是 %status%
		 * 
		 * @param {string} url 请求的数据路径
		 * @param {number} time 响应时间
		 * @ignore
		 */
		receive : new J.Interface(),
	
		/**
		 * 添加监控规则,
		 * 
		 * @param {String} url 需要监控的url
		 * @param {String} reportUrl 出现异常后上报的地址 上报地址有几个变量替换 <br/>%status% 数据状态
		 *            <br/>%percent% 统计百分比 <br/>%url% 监听的url地址,自动encode
		 *            <br/>%fullUrl% 监听的完整的url地址，包括这个地址请求时所带 <br/>%source% js处理来源
		 *            <br/>%time% 请求花掉的时间 <br/>%scale% 比例,通常是指 1:n 其中的 n 就是 %scale%
		 * 
		 * <br/>
		 * @example
		 * J.Report.addRule("http://imgcache.qq.com/data2.js","http://imgcache.qq.com/ok?flag1=3234&flag2=%status%&1=%percent%&flag4=123456");
		 * @ignore
		 */
		addRule : new J.Interface()
	};
	
	
	

	
	J.extend(J.Console,
	/**
	 * @lends Console
	 */
	{
		/**
		 * 是否进行了初始化
		 * 
		 * @type Boolean
		 */
		_inited : false,
	
		/**
		 * Console表现模板
		 * 
		 * @type String
		 */
		_html :    '<div id="log_head" class="console_log_head">\
						<button id="log_close" class="close_button">x</button>\
						<h5 class="title">Console</h5>\
					</div>\
					<ul id="log_list" class="log_list"></ul>\
					<div class="console_input_box">\
						&gt;<input id="console_input"/>\
					</div>',
	
		/**
		 * 提示框是否打开了
		 * 
		 * @type Boolean
		 */
		_opened : false,
		
		//日志记录对象
		_log_record: [],
	
		/**
		 * 信息类型常量，一共五种类型<br/> <br/> DEBUG : 0 <br/> ERROR : 1 <br/> WARNING : 2
		 * <br/> INFO : 3 <br/> PROFILE : 4 <br/>
		 * 
		 * @type Object
		 */
		TYPE : {
			DEBUG : 0,
			ERROR : 1,
			WARNING : 2,
			INFO : 3,
			PROFILE : 4
		},
	
		/**
		 * 样式类
		 * 
		 * @type
		 */
		_typeInfo : [["log_debug_type", "√"], ["log_error_type", "x"], ["log_warning_type", "!"], ["log_info_type", "i"], ["log_profile_type", "└"]],
	
		/**
		 * 显示Console
		 */
		show : function() {
			if (!this._inited) {
				this._init();
			}
			this._main.style.display = "block";
			//输入焦点过来
			var _self = this;
			window.setTimeout(this.focusCommandLine.bind(this),0);
			
			this._opened = true;
		},
	
		/**
		 * 隐藏Console
		 */
		hide : function() {
			J.Console._main.style.display = "none";
			J.Console._opened = false;
		},
	
		/**
		 * 初始化控制台
		 * 
		 * @ignore
		 */
		_init : function() {
			//$H.loadCss("./js/jet.css");
			$H.loadCss("../../../source/jet.css");
			this._main = document.createElement("div");
			window.document.body.appendChild(this._main);
			this._main.className = "console_log";
			this._main.innerHTML = this._html;
	
			this._input = $("console_input");
			this._button = $("log_close");
			this._list = $("log_list");

			// 如果存在拖拽类
			if (J.dragdrop) {
				J.dragdrop.registerDragdropHandler($("log_head"), this._main);
			}
	
			// 绑定方法
			$E.on(this._input, "keypress", this._execScript);
			$E.on(this._button, "click", this.hide);
			// 输入焦点过来
			// $E.on(this._main, "dblclick", this.focusCommandLine.bind(this));
			// 快捷键显示
			$E.on(document, "keydown", this.handleDocumentKeydown.bind(this));

			
			this.print = this.out;
			
			this._inited = true;
			this.setToDebug();
			this.out("Welcome to JET(Javascript Extension Tools)...", this.TYPE.INFO)
		},
		
		handleDocumentKeydown: function(e){
			
			switch(e.keyCode){
				case 74:	// J 键:74
				case 192:	// `~键:192
					if(e.ctrlKey){
						this.toggleShow();
						e.preventDefault();
					}
					break;
				default: break;
			}
		},
		
		focusCommandLine: function(){
			this._input.focus();
		},
		
		toggleShow:function(){
			if(this._opened){
				this.hide();
			}else{
				this.show();
			}
			
		},
		
		/**
		 * 控制台记录信息
		 * 
		 * @param {String} msg 要输出的信息
		 * @param {Number} type 要输出的信息的类型，可选项
		 * @return {String} 返回要输出的信息
		 */
		outShow:function(msg, type){
			this.outConsole(msg, type);
			
			if ((!this._opened)) {
				this.show();
			}
		},
		
		/**
		 * 向控制台输出信息并显示
		 * 
		 * @param {String} msg 要输出的信息
		 * @param {Number} type 要输出的信息的类型，可选项
		 * @return {String} 返回要输出的信息
		 */
		outConsole: function(msg, type) {
			this.log(msg, type);
			
			var _item = document.createElement("li");
			this._list.appendChild(_item);
			
			var _ti = J.Console._typeInfo[type] || J.Console._typeInfo[0];
			_item.className = _ti[0];
			_item.innerHTML = '<span class="log_icon">' + _ti[1] + '</span>' + msg;
	
			this._list.scrollTop = this._list.scrollHeight;
		},
		
		/**
		 * 向控制台输出信息的方法
		 * 
		 * @param {String} msg 要输出的信息
		 * @param {Number} type 要输出的信息的类型，可选项
		 * @return {String} 返回要输出的信息
		 */
		out:function(){	
		},
		
		
		setToDebug:function(){
			this.out = this.outShow;
		},
		
		setToNoDebug:function(){
			this.out = this.outConsole;
		},

		log: function(msg, type){
			this._log_record.push([msg,type]);
		},

		/**
		 * 清空log
		 */
		clear : function() {
			J.Console._list.innerHTML = "";
		},
	
		/**
		 * 执行脚本
		 */
		_execScript : function(e) {
			if (e.keyCode !== 13) {
				return;
			}
	
			// 控制台命令
			switch (J.Console._input.value) {
				case "help" :
					var _rv = "Console Help<br/>help  : console help<br/>clear : clear console list.<br/>hide : hide console"
					J.Console.out(_rv, 3);
					break;
				case "clear" :
					J.Console.clear();
					break;
				case "hide" :
					J.Console.hide();
					break;
				default :
					var _rv = '<span style="color:#CCFF00">' + J.Console._input.value + '</span><br/>';
					try {
						_rv += (eval(J.Console._input.value) || "").toString().replace(/</g, "&lt;").replace(/>/g, "&gt;")
						J.Console.out(_rv, 0);
					} catch (ex) {
						_rv += ex.description;
						J.Console.out(_rv, 1);
					}
			}
	
			J.Console._input.value = "";
		}
	});
	
	J.Console._init();

	
	
	
	/**
	 * 错误调试类
	 * 
	 * @namespace
	 * @name Debug
	 */

	J.Debug = J.Debug || {};
	J.extend(J.Debug, 
		
	/**
	 * @lends Debug
	 */
	{
		/**
		 * 错误对象
		 */
		errorLogs : [],
	
		/**
		 * 启用Jet调试模式，错误会记录到对象中
		 */
		startDebug : function() {
			/**
			 * 为窗口加入错误处理
			 * 
			 * @ignore
			 * @param {Object} e
			 */
			window.onerror = function(msg,url,line) {
				var urls = (url || "").replace(/\\/g,"/").split("/");
				J.Console.out(msg + "<br/>" + urls[urls.length - 1] + " (line:" + line + ")",1);
				J.Debug.errorLogs.push(msg);
				return false;
			}
		},
	
		/**
		 * 停止Jet调试模式
		 */
		stopDebug : function() {
			/**
			 * 为窗口加入错误处理
			 * 
			 * @ignore
			 */
			window.onerror = null;
		},
	
		/**
		 * 清除所有错误信息
		 */
		clearErrorLog : function() {
			this.errorLogs = [];
		},
	
		showLog : function() {
			//需改进
			var o = ENV.get("debug_out");
			if (!!o) {
				o.innerHTML = nl2br(escHTML(this.errorLogs.join("\n")));
			}
		},
	
		getLogString : function() {
			return (this.errorLogs.join("\n"));
		},
		
		/**
		 * breakpoint currently works only in DOM/browser environment.
		 * 
		 * @function
		 * @memberOf Debug
		 * @name breakpoint
		 * 
		 * @param {Number} num 一个数字
		 * @return {boolean} true 一个布尔值
		 */
		breakPoint: function(evalFunc, msg, initialExprStr){
			if (msg == null){
				msg = "";
			}
			var result = initialExprStr || "1+2";
			while(true){
				var expr = window.prompt("[BREAKPOINT]: " + msg + "\nEnter an expression to evaluate, or Cancel to continue.", result); 
				if(expr == null || expr == ""){
					return;
				}
				try{
					result = evalFunc(expr);
				}catch(e){
					result = e;
				}
			}
		}
	});
	/*
	//DOM错误提示
	var handleError=function(errorMessage, url, line){
		var text;
		text="以下页面中的脚本发生错误：\n\n";
		text+="　- [错误]:　" + errorMessage + "\n";
		text+="　- [页面]:　" + url + "\n";
		text+="　- [行号]:　" + line + "\n\n";
		J.out(text);
		return true;
	};
	//J.Debug.handleError = handleError;
	//window.onerror=handleError;
	
	
	*/
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Runtime处理工具静态类
	 * 
	 * @namespace runtime处理工具静态类
	 * @name Runtime
	 */
	J.Runtime = (function() {
		/**
		 * 是否debug环境
		 * 
		 * @return {Boolean} 是否呢
		 */
		function isDebugMode() {
			return (J.config.debugLevel > 0);
		}
	
		/**
		 * log记录器
		 * 
		 * @ignore
		 * @param {String} msg 信息记录器
		 */
		function log(msg, type) {
			var info;
			if (isDebugMode()) {
				info = msg + '\n=STACK=\n' + stack();
			} else {
				if (type == 'error') {
					info = msg;
				} else if (type == 'warn') {
					// TBD
				}
			}
			J.Debug.errorLogs.push(info);
		}
	
		/**
		 * 警告信息记录
		 * 
		 * @param {String} sf 信息模式
		 * @param {All} args 填充参数
		 */
		function warn(sf, args) {
			log(write.apply(null, arguments), 'warn');
		}
	
		/**
		 * 错误信息记录
		 * 
		 * @param {String} sf 信息模式
		 * @param {All} args 填充参数
		 */
		function error(sf, args) {
			log(write.apply(null, arguments), 'error');
		}
	
		/**
		 * 获取当前的运行堆栈信息
		 * 
		 * @param {Error} e 可选，当时的异常对象
		 * @param {Arguments} a 可选，当时的参数表
		 * @return {String} 堆栈信息
		 */
		function stack(e, a) {
			function genTrace(ee, aa) {
				if (ee.stack) {
					return ee.stack;
				} else if (ee.message.indexOf("\nBacktrace:\n") >= 0) {
					var cnt = 0;
					return ee.message.split("\nBacktrace:\n")[1].replace(/\s*\n\s*/g, function() {
						cnt++;
						return (cnt % 2 == 0) ? "\n" : " @ ";
					});
				} else {
					var entry = (aa.callee == stack) ? aa.callee.caller : aa.callee;
					var eas = entry.arguments;
					var r = [];
					for (var i = 0, len = eas.length; i < len; i++) {
						r.push((typeof eas[i] == 'undefined') ? ("<u>") : ((eas[i] === null) ? ("<n>") : (eas[i])));
					}
					var fnp = /function\s+([^\s\(]+)\(/;
					var fname = fnp.test(entry.toString()) ? (fnp.exec(entry.toString())[1]) : ("<ANON>");
					return (fname + "(" + r.join() + ");").replace(/\n/g, "");
				}
			}
	
			var res;
	
			if ((e instanceof Error) && (typeof arguments == 'object') && (!!arguments.callee)) {
				res = genTrace(e, a);
			} else {
				try {
					({}).sds();
				} catch (err) {
					res = genTrace(err, arguments);
				}
			}
	
			return res.replace(/\n/g, " <= ");
		}
	
		return {
			/**
			 * 获取当前的运行堆栈信息
			 * 
			 * @param {Error} e 可选，当时的异常对象
			 * @param {Arguments} a 可选，当时的参数表
			 * @return {String} 堆栈信息
			 */
			stack : stack,
			/**
			 * 警告信息记录
			 * 
			 * @param {String} sf 信息模式
			 * @param {All} args 填充参数
			 */
			warn : warn,
			/**
			 * 错误信息记录
			 * 
			 * @param {String} sf 信息模式
			 * @param {All} args 填充参数
			 */
			error : error,
			
			/**
			 * 是否调试模式
			 */
			isDebugMode : isDebugMode
		};
	
	})();

});


/**
 * cookie类
 * 
 * @namespace J.Cookie
 */
Jet().$package(function(J){
	var domainPrefix = window.location.host;
	
	/**
	 * @namespace Cookie 名字空间
	 * @name Cookie
	 */
	J.Cookie = 
	/**
	 * @lends Cookie
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



/**
 * [Jet initialize]: Jet 最终初始化
 */
Jet().$package(function(J){
	var $B = J.Browser,
		$E = J.Event;
		
	$E.onDOMReady(function(){
		var div = document.createElement("div");
		div.style.width = "1px";
		div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		$B.Support.boxModel = (div.offsetWidth === 2);
		document.body.removeChild( div );
	});
	

});

