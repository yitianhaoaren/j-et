/**	
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview Jet!
 * @version	1.0
 * @author	Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description 
 * 
 */

/**	
 * @description
 * Package: jet.string
 * 
 * Need package:
 * jet.core.js
 * 
 */


/**
 * 3.[Javascript core]: String 字符串处理
 */
Jet().$package(function(J){
	
	/**
	 * string 名字空间
	 * 
	 * @namespace
	 * @name string
	 */
	J.string = J.string || {};
	var $S = J.string,
		toString,
		template,
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
	 * 将任意变量转换为字符串的方法
	 * 
	 * @method toString
	 * @memberOf string
	 * 
	 * @param {Mixed} o 任意变量
	 * @return {String} 返回转换后的字符串
	 */
	toString = function(o){
		return (o + "");
	};
	
	var cache = {};
	  
	/**
	 * 多行或单行字符串模板处理
	 * 
	 * @method template
	 * @memberOf string
	 * 
	 * @param {String} str 模板字符串
	 * @param {Object} obj 要套入的数据对象
	 * @return {String} 返回与数据对象合成后的字符串
	 * 
	 * @example
	 * <script type="text/html" id="user_tmpl">
	 *   <% for ( var i = 0; i < users.length; i++ ) { %>
	 *     <li><a href="<%=users[i].url%>"><%=users[i].name%></a></li>
	 *   <% } %>
	 * </script>
	 * 
	 * Jet().$package(function(J){
	 * 	// 用 obj 对象的数据合并到字符串模板中
	 * 	J.template("Hello, {name}!", {
	 * 		name:"Kinvix"
	 * 	});
	 * };
	 */
	template = function(str, data){
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

	
	/*
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
	*/

	
	

	/**
	 * 判断是否是一个可接受的 url 串
	 * 
	 * @method isURL
	 * @memberOf string
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
	 * @memberOf string
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
				//J.out("错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
			}
		}
		return params;
	};
	
	/**
	 * 
	 * test的方法
	 * 
	 * @memberOf string
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
	 * @memberOf string
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
	 * @memberOf string
	 * 
	 * @return {String} 返回清除后的字符串
	 */
	trim = function(string){
		return String(string).replace(/^\s+|\s+$/g, '');
	};

	/**
	 * 清除字符串开头和结尾的空格，并把字符串之间的多个空格转换为一个空格
	 * 
	 * @memberOf string
	 * 
	 * @return {String} 返回清除后的字符串
	 */
	clean = function(string){
		return trim(string.replace(/\s+/g, ' '));
	};

	/**
	 * 将“-”连接的字符串转换成驼峰式写法
	 * 
	 * @memberOf string
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
	 * @memberOf string
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
	 * @memberOf string
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
	 * @memberOf string
	 * 
	 * @return {String} 返回转换后的字符串
	 */
	escapeRegExp = function(string){
		return string.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	};

	/**
	 * 将字符串转换成整数
	 * 
	 * @memberOf string
	 * 
	 * @return {Number} 返回转换后的整数
	 */
	toInt = function(string, base){
		return parseInt(string, base || 10);
	};

	/**
	 * 将字符串转换成浮点数
	 * 
	 * @memberOf string
	 * @param {Sring} string 要转换的字符串
	 * @return {Number} 返回转换后的浮点数
	 */
	toFloat = function(string){
		return parseFloat(string);
	};
	
	/**
	 * 将带换行符的字符串转换成无换行符的字符串
	 * 
	 * @memberOf string
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
	 * @memberOf string
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
	 * @memberOf string
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
	 * @memberOf string
	 * @return {String} 返回转换后的字符串
	 */
	hexToRgb = function(string, array){
		var hex = string.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
		return (hex) ? hex.slice(1).hexToRgb(array) : null;
	};

	/**
	 * 将颜色 RGB 写法转换成 Hex 写法
	 * 
	 * @memberOf string
	 * @return {String} 返回转换后的字符串
	 */
	rgbToHex = function(string, array){
		var rgb = string.match(/\d{1,3}/g);
		return (rgb) ? rgb.rgbToHex(array) : null;
	};

	/**
	 * 脱去script标签
	 * 
	 * @memberOf string
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
	
	/**
	 * 。。。。
	 * 
	 * @memberOf string
	 * @param {Object} obj 要转换成查询字符串的对象
	 * @return {String} 返回转换后的查询字符串
	 */
	toQueryPair = function(key, value) {
		return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
	};
	
	/**
	 * 。。。。
	 * 
	 * @memberOf string
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
	 * @memberOf string
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
	 * @memberOf string
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
	 * @memberOf string
	 * @return {String} 返回自己长度
	 */
	byteLength = function(string){
		var u = string.match(/[^\x00-\xff]/g);
		return string.length+(u ? u.length : 0);
	};
	
	
	
	
    
		
		
	$S.toString = toString;
	$S.template = template;
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








