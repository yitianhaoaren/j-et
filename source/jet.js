/**	
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, WebQQ Group, All rights reserved.
 *
 * @version	1.0
 * @author	Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * 
 */

/**
 * [JET core]: JET 微内核
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
			console: true,
			debug: DEBUG.SHOW_ALL
		},
		
		/**
		 * @ignore
		 */
		out = function(msg, type){
			msg = String(msg);
			type = type || 3;
			if(type < option.debug){
				if(this.Console){
					this.Console.out(msg, type);
				}else{
					alert(msg+"["+type+"]");
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
						ver = String(ver);
						try{
							if(Jet.VERSIONS[ver]){
								J = Jet.VERSIONS[ver];
							}else{
								J = Jet.VERSIONS[Jet.DEFAULT_VERSION];
								throw new Error("No JET version " + ver + ", so return Jet version " + Jet.DEFAULT_VERSION + "!");
							}
						}catch(e){
							//J.out(e.fileName+";"+e.lineNumber+","+typeof e.stack+";"+e.name+","+e.message, 2);
							J.out(e.fileName+", 行号:"+e.lineNumber+"; "+e.name+": "+e.message+", stack:"+typeof e.stack, 2);
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
						this.out(e.fileName+", 行号:"+e.lineNumber+"; "+e.name+": "+e.message+", stack:"+typeof e.stack, 1);
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
		out("JET 微内核初始化失败，错误：" + e, 1);
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
		extend,
		timedChunk,
		forEach,
		getLength,
		Interface,
		toArray,
		clone,
		indexOf,
		$return,
		$try,
		
		removeArr,
		replaceArr,
		rebuild,
		pass,
		bind,
		bindNoEvent,
		
		
		formatDate;

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
	 * 正向查找数组元素在数组中的索引下标
	 * 
	 * @link http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
	 * @memberOf Array.prototype
	 * @name indexOf
	 * 
	 * @param {Array} arr 要查找的数组
	 * @param {Object} obj 要查找的数组的元素
	 * @param {Number} fromIndex 开始的索引编号
	 * 
	 * @return {Number}返回正向查找的索引编号
	 */
	indexOf = function (arr, obj, fromIndex) {
        if (fromIndex == null) {
            fromIndex = 0;
        } else if (fromIndex < 0) {
            fromIndex = Math.max(0, arr.length + fromIndex);
        }
        for (var i = fromIndex; i < arr.length; i++) {
            if (arr[i] === obj){
                return i;
            }
        }
        return -1;
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
    
    // 通用分时处理函数
    timedChunk = function(items, process, context, isShift, callback) {
        var todo = items.concat(), delay = 25;
        if(isShift){
        	todo = items;
        }
 
        setTimeout(function() {
            var start = +new Date();
 
            do {
                process.call(context, todo.shift());
            } while(todo.length > 0 && (+new Date() - start < 50));
 
            if(todo.length > 0) {
                setTimeout(arguments.callee, delay);
            } else if(callback) {
                callback(items);
            }
 
        }, delay);
    }
    
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
	 * @memberOf Jet.prototype
	 */
    Interface = function(){
    	return function(){};
    };
    

    
    /**
	 * 从数组中移除一个或多个数组成员
	 * 
	 * @memberOf Jet.prototype
	 * @param {Array} arr 要移除的数组成员，可以是单个成员也可以是成员的数组
	 */
	removeArr = function(arr, members){
		var members = J.toArray(members),
			i,
			j;
		for(i=0; i<members.length; i++){
			for(j=0; j<arr.length; j++){
				if(arr[j] === members[i]){
					arr.splice(j,1);
				}
			}
		}
		return true;
	};
	
	/**
	 * 替换一个数组成员
	 * 
	 * @memberOf Jet.prototype
	 * @param {Object} oldValue 当前数组成员
	 * @param {Object} newValue 要替换成的值
	 * @return {Boolean} 如果找到旧值并成功替换则返回 true，否则返回 false
	 */
	replaceArr = function(arr, oldValue, newValue){
		var i;
		for(i=0; i<arr.length; ij++){
			if(arr[i] === oldValue){
				arr[i] = newValue;
				return true;
			}
		}
		return false;
	};
		
		
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
	/*
	pass = function(func){
		var args = Array.prototype.slice.call(arguments, 1);
		return rebuild(func, {contextObj: null, arguments: args});
	};
	*/
	pass = function(func, var_args) {
		var slice = Array.prototype.slice;
		var a = slice.call(arguments, 1);
		return function(){
			var context = this;
			return func.apply(context, a.concat(slice.call(arguments)));
		};
	};
	
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
	 * Binds a function to an object. The returned function will always use the
	 * passed in {@code obj} as {@code this}.
	 *
	 * Example:
	 *
	 *   g = bind(f, obj, a, b)
	 *   g(c, d) // will do f.call(obj, a, b, c, d)
	 *
	 * @param {Function} f The function to bind the object to
	 * @param {Object} obj The object that should act as this when the function
	 *     is called
	 * @param {*} var_args Rest arguments that will be used as the initial
	 *     arguments when the function is called
	 * @return {Function} A new function that has bound this
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
	
	
	J.isUndefined = isUndefined;
	J.isNull = isNull;
	J.isNumber = isNumber;
	J.isString = isString;
	J.isBoolean = isBoolean;
	J.isObject = isObject;
	J.isArray = isArray;
	J.isFunction = isFunction;
	J.$typeof = $typeof;

	J.clone = clone;
	J.forEach = forEach;
	J.getLength = getLength;
	J.random = random;
	J.extend = extend;
	J.timedChunk = timedChunk;
	J.indexOf = indexOf;
	
	
	J.Interface = Interface;
	J.$return = $return;
	J.$try = $try;
	
	J.toArray = toArray;
	J.removeArr = removeArr;
	J.replaceArr = replaceArr;
	
	J.rebuild = rebuild;
	J.pass = pass;
	J.bind = bind;
	J.bindNoEvent = bindNoEvent;
	
	J.formatDate = formatDate;

});






/**
 * [Javascript core]: String 字符串处理
 */
Jet().$package(function(J){
	
	/**
	 * String 名字空间
	 * 
	 * @namespace
	 * @name String
	 */
	J.String = J.String || {};
	var $S = J.String,
		template,
		template2,
		isURL,
		mapQuery,
		test,
		contains,
		trim,
		clean,
		camelCase,
		hyphenate,
		capitalize,
		escapeRegExp,
		toInt,
		toFloat,
		toSingleLine,
		toHtml,
		toTitle,
		toQueryPair,
		toQueryString,
		
		hexToRgb,
		rgbToHex,
		stripScripts,
		substitute,
		replaceAll,
		byteLength;
	

	/**
	 * 多行或单行字符串模板处理
	 * 
	 * @method template
	 * @memberOf String
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
	};
	

	var cache = {};
	  
	template2 = function(str, data){
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
		  cache[str] = cache[str] ||
			tmpl(document.getElementById(str).innerHTML) :
		  
		  // Generate a reusable function that will serve as a template
		  // generator (and which will be cached).
		  new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
			
			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +
			
			// Convert the template into pure JavaScript
			str
			  .replace(/[\r\t\n]/g, " ")
			  .split("<%").join("\t")
			  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			  .replace(/\t=(.*?)%>/g, "',$1,'")
			  .split("\t").join("');")
			  .split("%>").join("p.push('")
			  .split("\r").join("\\'")
		  + "');}return p.join('');");
		
		// Provide some basic currying to the user
		return data ? fn( data ) : fn;
	};

	
	
	
	

	/**
	 * 判断是否是一个可接受的 url 串
	 * 
	 * @method isURL
	 * @memberOf String
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
	 * @memberOf String
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
	 * 
	 * test的方法
	 * 
	 * @memberOf String
	 * 
	 * @param {String, RegExp} regex 正则表达式，或者正则表达式的字符串
	 * @param {String} params 正则的参数
	 * @return {Boolean} 返回结果
	 */
	test = function(string, regex, params){
		return ((typeof regex == 'string') ? new RegExp(regex, params) : regex).test(string);
	};

	/**
	 * 判断是否含有指定的字符串
	 * 
	 * @memberOf String
	 * 
	 * @param {String} string 是否含有的字符串
	 * @param {String} separator 分隔符，可选
	 * @return {Boolean} 如果含有，返回 true，否则返回 false
	 */
	contains = function(string1, string2, separator){
		return (separator) ? (separator + string1 + separator).indexOf(separator + string2 + separator) > -1 : string1.indexOf(string2) > -1;
	};

	/**
	 * 清除字符串开头和结尾的空格
	 * 
	 * @memberOf String
	 * 
	 * @return {String} 返回清除后的字符串
	 */
	trim = function(string){
		return String(string).replace(/^\s+|\s+$/g, '');
	};

	/**
	 * 清除字符串开头和结尾的空格，并把字符串之间的多个空格转换为一个空格
	 * 
	 * @memberOf String
	 * 
	 * @return {String} 返回清除后的字符串
	 */
	clean = function(string){
		return trim(string.replace(/\s+/g, ' '));
	};

	/**
	 * 将“-”连接的字符串转换成驼峰式写法
	 * 
	 * @memberOf String
	 * 
	 * @return {String} 返回转换后的字符串
	 */
	camelCase = function(string){
		return string.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	};
	
	/**
	 * 将驼峰式写法字符串转换成“-”连接的
	 * 
	 * @memberOf String
	 * 
	 * @return {String} 返回转换后的字符串
	 */
	hyphenate = function(string){
		return string.replace(/[A-Z]/g, function(match){
			return ('-' + match.charAt(0).toLowerCase());
		});
	};

	/**
	 * 将字符串转换成全大写字母
	 * 
	 * @memberOf String
	 * 
	 * @return {String} 返回转换后的字符串
	 */
	capitalize = function(string){
		return string.replace(/\b[a-z]/g, function(match){
			return match.toUpperCase();
		});
	};

	/**
	 * 转换 RegExp 正则表达式
	 * 
	 * @memberOf String
	 * 
	 * @return {String} 返回转换后的字符串
	 */
	escapeRegExp = function(string){
		return string.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	};

	/**
	 * 将字符串转换成整数
	 * 
	 * @memberOf String
	 * 
	 * @return {Number} 返回转换后的整数
	 */
	toInt = function(string, base){
		return parseInt(string, base || 10);
	};

	/**
	 * 将字符串转换成浮点数
	 * 
	 * @memberOf String
	 * @param {Sring} string 要转换的字符串
	 * @return {Number} 返回转换后的浮点数
	 */
	toFloat = function(string){
		return parseFloat(string);
	};
	
	/**
	 * 将带换行符的字符串转换成无换行符的字符串
	 * 
	 * @memberOf String
	 * @param {Sring} str 要转换的字符串
	 * @return {Sring} 返回转换后的字符串
	 */
	toSingleLine = function(str){
		return String(str).replace(/\r/gi,"")
							.replace(/\n/gi,"");
	};
	
	/**
	 * 将字符串转换成html源码
	 * 
	 * @memberOf String
	 * @param {Sring} str 要转换的字符串
	 * @return {Sring} 返回转换后的html代码字符串
	 */
	toHtml = function(str){
		return String(str).replace(/&/gi,"&amp;")
							.replace(/\\/gi,"&#92;")
							.replace(/\'/gi,"&#39;")
							.replace(/\"/gi,"&quot;")
							.replace (/</gi,"&lt;")
							.replace(/>/gi,"&gt;")
							.replace(/ /gi,"&nbsp;")
							.replace(/\r\n/g,"<br />")
							.replace(/\n\r/g,"<br />")
							.replace(/\n/g,"<br />")
							.replace(/\r/g,"<br />");
	};
	
	/**
	 * 将字符串转换成用于title的字符串
	 * 
	 * @memberOf String
	 * @param {Sring} str 要转换的字符串
	 * @return {Number} 返回转换后的in title字符串
	 */
	toTitle = function(str){
		return String(str).replace(/\\/gi,"\\")
							.replace(/\'/gi,"\'")
							.replace(/\"/gi,"\'");
	};

	
	
	
	

	/**
	 * 将颜色 Hex 写法转换成 RGB 写法
	 * 
	 * @memberOf String
	 * @return {String} 返回转换后的字符串
	 */
	hexToRgb = function(string, array){
		var hex = string.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	};

	/**
	 * 将颜色 RGB 写法转换成 Hex 写法
	 * 
	 * @memberOf String
	 * @return {String} 返回转换后的字符串
	 */
	rgbToHex = function(string, array){
		var rgb = string.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	};

	/**
	 * 脱去script标签
	 * 
	 * @memberOf String
	 * @return {String} 返回转换后的字符串
	 */
	stripScripts = function(string, option){
		var scripts = '';
		var text = string.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(){
			scripts += arguments[1] + '\n';
			return '';
		});
		if (option === true){
			$exec(scripts);
		}else if($type(option) == 'function'){
			option(scripts, text);
		}
		return text;
	};
	
	
	toQueryPair = function(key, value) {
		return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
	};
	
	/**
	 * 。。。。
	 * 
	 * @memberOf String
	 * @param {Object} obj 要转换成查询字符串的对象
	 * @return {String} 返回转换后的查询字符串
	 */
	toQueryString = function(obj){
		var result=[];
		for(var key in obj){
			result.push(toQueryPair(key, obj[key]));
		}
		return result.join("&");
	};



	/**
	 * 。。。。
	 * 
	 * @memberOf String
	 * @return {String} 返回转换后的字符串
	 */
	substitute = function(string, object, regexp){
		return string.replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
			if (match.charAt(0) == '\\') return match.slice(1);
			return (object[name] != undefined) ? object[name] : '';
		});
	};
	
	/**
	 * 全局替换指定的字符串
	 * 
	 * @memberOf String
	 * @return {String} 返回替换后的字符串
	 */
	replaceAll = function(string, reallyDo, replaceWith, ignoreCase) {
	    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
	        return string.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
	    } else {
	        return string.replace(reallyDo, replaceWith);
	    }
	};
	
	/**
	 * 计算字符串的字节长度
	 * 
	 * @memberOf String
	 * @return {String} 返回自己长度
	 */
	byteLength = function(string){
		var u = string.match(/[^\x00-\xff]/g);
		return string.length+(u ? u.length : 0);
	};
	
	
	
	
    
		
		

	$S.template = template;
	$S.template2 = template2;
	$S.isURL = isURL;
	$S.mapQuery = mapQuery;
	$S.test = test;
	$S.contains = contains;
	$S.trim = trim;
	$S.clean = clean;
	$S.camelCase = camelCase;
	$S.hyphenate = hyphenate;
	$S.capitalize = capitalize;
	$S.escapeRegExp = escapeRegExp;
	$S.toInt = toInt;
	$S.toFloat = toFloat;
	$S.toSingleLine = toSingleLine;
	
	$S.toHtml = toHtml;
	$S.toTitle = toTitle;
	$S.toQueryPair = toQueryPair;
	$S.toQueryString = toQueryString;
	
	$S.hexToRgb = hexToRgb;
	$S.rgbToHex = rgbToHex;
	$S.stripScripts = stripScripts;
	$S.substitute = substitute;
	$S.replaceAll = replaceAll;
	$S.byteLength = byteLength;
	



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
			return J.formatDate(date, J.I18n.currentLang.date);
		},
		
		/**
    	 * 按当前语言输出长日期
    	 * 
		 * @param {Mixed} 长日期
		 * @returns {String} 返回按当前语言输出的长日期字符串
		 */
		longDate: function(date){
			return J.formatDate(date, J.I18n.currentLang.longDate);
		},
		
		/**
    	 * 按当前语言输出时间
    	 * 
		 * @param {Mixed} 时间
		 * @returns {String} 返回按当前语言输出的时间字符串
		 */
		time: function(time){
			return J.formatDate(date, J.I18n.currentLang.time);
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
		 * @private
		 * @memberOf Browser
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
		 * @private
		 * @memberOf Browser.Engine
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
		if (Engine.trident && Engine.version < 5) {
			try {
				document.execCommand('BackgroundImageCache', false, true);
			}catch(e){}
		}
	}
    adjustBehaviors();
    
    
    
	// From: Jhon Resig
	// Support
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
	J.query = J.String.mapQuery(window.location.search);
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
		recover,
		hide,
		
		getScrollLeft,
		getScrollTop,
		getScrollHeight,
		getScrollWidth,
		getClientHeight,
		getClientWidth,
		getClientXY,
		setClientXY,
		getXY,
		setXY,
		getRelativeXY,
		
		getSelection,
		getTextFieldSelection,
		
	
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
		element = element || window.document;
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
		var el = doc;
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
	tagName = function(tagName, el) {
		var el = el || getDoc();
		return el.getElementsByTagName(tagName);
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
     * @memberOf Dom
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
     * @memberOf Dom
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
		return J.String.contains(el.className, className, ' ');
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
			el.className = J.String.clean(el.className + " " + className);
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
		return hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
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
	 * 显示元素
	 * 
	 * @method show
	 * @memberOf Dom
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
	 * 还原元素原来的display属性
	 * 
	 * @method recover
	 * @memberOf Dom
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
	 * @memberOf Dom
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
				
				var _fix = J.Browser.ie ? 2 : 0; //修正ie和firefox之间的2像素差异
				
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
	
	getRelativeXY = function(el, relativeEl) {
		var xyEl = getXY(el);
		var xyRelativeEl = getXY(relativeEl);
		var xy=[];
		
		xy[0] = xyEl[0] - xyRelativeEl[0];
		xy[1] = xyEl[1] - xyRelativeEl[1];
		return xy;
	}
	

	getSelection = function(win) {
		win = win || window;
		doc = win.document;
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

	// FireFox 下获取 input 或者 textarea 中选中的文字
	getTextFieldSelection = function(e) {
		if (e.selectionStart != undefined && e.selectionEnd != undefined) {
			var start = e.selectionStart;
			var end = e.selectionEnd;
			return e.value.substring(start, end);
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
	
	$D.show = show;
	$D.recover = recover;
	$D.hide = hide;
	
	
	$D.getScrollLeft = getScrollLeft;
	$D.getScrollTop = getScrollTop;
	$D.getScrollHeight = getScrollHeight;
	$D.getScrollWidth = getScrollWidth;
	
	$D.getClientHeight = getClientHeight;
	$D.getClientWidth = getClientWidth;
	
	$D.getClientXY = getClientXY;
	$D.setClientXY = setClientXY;
	
	$D.getXY = getXY;
	$D.setXY = setXY;
	$D.getRelativeXY = getRelativeXY;
	$D.getSelection = getSelection;
	
	$D.getTextFieldSelection = getTextFieldSelection;
	
	
	
	
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
		addObserver,
		notifyObservers,
		removeObserver;
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
		 * @memberOf Event
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
	        var handlersIndex = $E._find(element, eventType, handler);
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
	    $E._find = function(element, eventType, handler) {
	        var handlers = element._handlers;
	        if (!handlers){
	        	return -1;  // if no handlers registered, nothing found
	        }
	
	        // Get the window of this element
	        var d = element.document || element;
	        var w = d.parentWindow;
	
	        var handlersIndex = [];
	        
	        
	        if(eventType){
				if(handler){
					// Loop through the handlers associated with this element, looking
			        // for one with the right type and function.
			        // We loop backward because the most recently registered handler
			        // is most likely to be the first removed one.
			        for(var i = handlers.length-1; i >= 0; i--) {
			            var handlerId = handlers[i];        // get handler id
			            var h = w._allHandlers[handlerId];  // get handler info
			            // If handler info matches type and handler function, we found it.
			            if (h.eventType == eventType && h.handler == handler){
			                return i;
			            }
			        }
				}else{
					
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
					
				}
			}else{

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
	 * @method addObserver
	 * @memberOf Event
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
		
		// 判断对象是否含有$Events对象
		if(!!!targetModel._$Events){
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
	 * @method notifyObservers
	 * @memberOf Event
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
		
		if(targetModel._$Events && targetModel._$Events[eventType]){
			handlers = targetModel._$Events[eventType];
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
	 * @memberOf Event
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
			events = targetModel._$Events;
		
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
	$E.addObserver = addObserver;
	$E.notifyObservers = notifyObservers;
	$E.removeObserver = removeObserver;
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
				options.onComplete(o);
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
		_isCreated : false,
	
		/**
		 * Console表现模板
		 * 
		 * @type String
		 */
		_html :    '<div id="ConsoleBoxHead" class="consoleBoxHead">\
						<button id="ConsoleCloseButton" class="consoleCloseButton">x</button>\
						<h5 class="title">Console</h5>\
					</div>\
					<ul id="ConsoleOutput" class="consoleOutput"></ul>\
					<div class="consoleInputBox">\
						&gt;<input id="ConsoleInput" class="consoleInput" />\
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
			if (!this._isCreated) {
				this._create();
			}
			this._opened = true;
			
			this._main.style.display = "block";
				
			//输入焦点过来
			window.setTimeout(J.bind(this.focusCommandLine, this), 0);
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
			this.print = this.out;
			// 快捷键开启
			$E.on(document, "keydown", J.bind(this.handleDocumentKeydown, this));
			if (J.option.console) {
				this.show();
			}
		},
		_create:function(){
			
			
			$H.loadCss(J.path+"assets/jet.css");
			this._main = document.createElement("div");
			
			this._main.id="JetConsole";
			this._main.style.display="none";
			this._main.className = "consoleBox";
			this._main.innerHTML = this._html;
			window.document.body.appendChild(this._main);
			
			
			this._headEl = $("ConsoleBoxHead");
			this._inputEl = $("ConsoleInput");
			this._closeButtonEl = $("ConsoleCloseButton");
			this._outputEl = $("ConsoleOutput");

			// 如果存在拖拽类
			if (J.dragdrop) {
				J.dragdrop.registerDragdropHandler(this._headEl, this._main);
			}
			
	
			// 绑定方法
			$E.on(this._inputEl, "keypress", this._execScript);
			$E.on(this._closeButtonEl, "click", this.hide);
			// 输入焦点过来
			// $E.on(this._main, "dblclick", this.focusCommandLine.bind(this));
			

			
			if(J.option.debug > J.DEBUG.NO_DEBUG){
				this.setToDebug();
			}else{
				this.setToNoDebug();
			}
			this._isCreated = true;
			this.out("Welcome to JET(Javascript Extension Tools)...", this.TYPE.INFO);
			
			
		},
		
		handleDocumentKeydown: function(e){
			switch(e.keyCode){
				//case 74:	// J 键:74
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
			this._inputEl.focus();
		},
		
		toggleShow:function(){
			if(this._opened){
				this.hide();
				//J.option.debug = J.DEBUG.NO_DEBUG;
			}else{
				this.show();
				//J.option.debug = J.DEBUG.SHOW_ALL;
				
			}
			
		},
		
		/**
		 * 控制台记录信息
		 * 
		 * @param {String} msg 要输出的信息
		 * @param {Number} type 要输出的信息的类型，可选项
		 * @return {String} 返回要输出的信息
		 */
		outConsoleShow:function(msg, type){
			this.outConsole(msg, type);
			
			if ((!this._opened) && J.option.console) {
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
			type = type || 3;
			this.log(msg, type);
			
			if(type < J.option.debug){
				var _item = document.createElement("li");
				this._outputEl.appendChild(_item);
				
				var _ti = J.Console._typeInfo[type] || J.Console._typeInfo[0];
				_item.className = _ti[0];
				_item.innerHTML = '<span class="log_icon">' + _ti[1] + '</span>' + msg;
		
				this._outputEl.scrollTop = this._outputEl.scrollHeight;
			}
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
			this.out = this.outConsoleShow;
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
			J.Console._outputEl.innerHTML = "";
		},
	
		/**
		 * 执行脚本
		 */
		_execScript : function(e) {
			if (e.keyCode !== 13) {
				return;
			}
	
			// 控制台命令
			switch (J.Console._inputEl.value) {
				case "help" :
					var _rv = "&lt;&lt; Console Help &gt;&gt;<br/>\
								help  : 控制台帮助<br/>\
								clear : 清空控制台输出<br/>\
								hide  : 隐藏控制台，或者使用 Ctrl + `(~) 快捷键"
					J.Console.out(_rv, 3);
					break;
				case "clear" :
					J.Console.clear();
					break;
				case "hide" :
					J.Console.hide();
					break;
				default :
					var _rv = '<span style="color:#ccff00">' + J.Console._inputEl.value + '</span><br/>';
					try {
						_rv += (eval(J.Console._inputEl.value) || "").toString().replace(/</g, "&lt;").replace(/>/g, "&gt;")
						J.Console.out(_rv, 0);
					} catch (ex) {
						_rv += ex.description;
						J.Console.out(_rv, 1);
					}
			}
	
			J.Console._inputEl.value = "";
		}
	});
	
	J.Console._init();

	
	
	

	
	
	
	
	
	
	
	
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
 * [Javascript core part]: JSON 扩展
 */
 
 
Jet().$package(function(J){
	var JSON = {};



	
	
	
	
/*
    http://www.JSON.org/json2.js
    2009-08-17

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

"use strict";

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

/*
if (!this.JSON) {
    this.JSON = {};
}
*/

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


	J.JSON = JSON;


});







/**
 * [Jet initialize]: Jet 最终初始化
 */
Jet().$package(function(J){
	var $B = J.Browser,
		$D = J.Dom,
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

