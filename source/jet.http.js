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
 * Package: jet.http
 *
 * Need package:
 * jet.core.js
 * 
 */

/**
 * 1.[Browser part]: http 包,含有ajax,comet,loadScript,loadCss封装
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



