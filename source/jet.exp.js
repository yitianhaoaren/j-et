/**	
 * JET (Javascript Extension Tools) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jet/license.txt
 *
 * @fileOverview All Jet in one!
 * @version	1.0
 * @author	Kinvix(<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>)
 * @description This is Javascript's original form.
 * 
 */

var test="in exp.js";



/**
 * [Jet demo]: Jet 演示
 */
Jet().$package(function(J){


	var string="sdf ${title},dfsdfsd ${name},dkfkksdf!";
	var p = J.String.template(string, {
		title: "我是标题",
		tel: "18923896900",
		name: "Kinvix"
	});

	//J.out(p);
});




Jet().$package(function(J){
	var $D = J.Dom,
		$E = J.Event;
		
	J.Drag=function(el){
		var curDragElementX, curDragElementY, dragStartX, dragStartY;
	
		var dragStart = function(e){
			e.preventDefault();
			curDragElementX=parseInt($D.getStyle(el,"left"))||0;
			curDragElementY=parseInt($D.getStyle(el,"top"))||0;
			dragStartX=e.pageX;
			dragStartY=e.pageY;
			$E.on(document,"mousemove",dragMove);
			$E.on(document,"mouseup",dragStop);
		};

		var dragMove = function(e){
			if(!el){
				return;
			}
			el.style.left=curDragElementX+(e.pageX-dragStartX)+"px";
			el.style.top=curDragElementY+(e.pageY-dragStartY)+"px";
		};

		var dragStop = function(e){  
			$E.off(document,"mousemove",dragMove);
			$E.off(document,"mouseup",dragStop);
		};
		$E.on(el,"mousedown",dragStart);
	};
});


Jet().$package(function(J){
	var $ = J.Dom.id,
		$D = J.Dom,
		$E = J.Event;
		
	J.Tab = function(triggers,sheets,config){
		this.tabs = [];             //tab的集合
		this.currentTab = null;     //当前tab
		this.config = {
			defaultIndex : 0,       //默认的tab索引
			triggerEvent : 'click', //默认的触发事件
			slideEnabled : false,   //是否自动切换
			slideInterval : 3*60*1000,   //切换时间间隔
			slideDelay : 300,       //鼠标离开tab继续切换的延时
			autoInit : true,        //是否自动初始化
			onShow:function(){ }    //默认的onShow事件处理函数
		};
	
		this.setConfig(config);
	
		//this.onShow = new $CE('onShow', this);//切换完成的自定义事件
		//this.onShow.subscribe(this.config['onShow']);
		//$E.addModelEvent(this, "show", this.config['onShow']);
	
		if(triggers && sheets) {
			this.addRange(triggers,sheets);
			if(this.config.autoInit) this.init();
		}
	};
	
	J.Tab.prototype = {
		/**
		 * 设置config
		 * @param {object} config 配置项如{'slideEnabled':true,'defaultIndex':0,'autoInit':false}
		 */
		setConfig:function(config){
			if(!config) return;
			for(var i in config){
				this.config[i] = config[i];
			}
		},
		/**
		 * 增加tab
		 * @param tab={trigger:aaaa, sheet:bbbb} 
		 * @param {string|HTMLElement} trigger
		 * @param {string|HTMLElement} sheet
		 * */
		add:function(tab){
			if(!tab) return;
			
			if(tab.trigger){
				this.tabs.push(tab);
				tab.trigger.style.display = 'block';
			}
		},
		/**
		 * 增加tab数组
		 * @param {array} triggers HTMLElement数组
		 * @param {array} sheets HTMLElement数组
		 * */
		addRange:function(triggers, sheets){
			if(!triggers||!sheets) return;
			if(triggers.length && sheets.length && triggers.length == sheets.length){
				for(var i = 0, len = triggers.length; i < len; i++){
					this.add({trigger:triggers[i],sheet:sheets[i]});
				}
			}
		},
		/**
		 * 设置tab为当前tab并显示
		 * @param {object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
		 * */
		select:function(tab){
			if(!tab || (!!this.currentTab && tab.trigger == this.currentTab.trigger)) return;
			if(this.currentTab){
				$D.removeClass(this.currentTab.trigger, 'current');
				if(this.currentTab.sheet){
					this.currentTab.sheet.style.display = 'none';
				}
				
			}
			this.currentTab = tab;
			this.show();
		},
		
		/**
		 * 设置tab为隐藏的
		 * @param {object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
		 * */
		remove:function(tab){
			if(!tab) return;
			
			
			if(tab.trigger){
				$D.removeClass(tab.trigger, 'current');
				tab.trigger.style.display = 'none';
			}
			if(tab.sheet){
				tab.sheet.style.display = 'none';
			}
			
			var index=this.indexOf(tab);
			this.tabs.splice(index,index);
	
			if(tab.trigger == this.currentTab.trigger){
				if(index==0){
					//this.currentTab=this.tabs[(index+1)];
					this.select(this.tabs[(index+1)]);
				}else{
					//this.currentTab=this.tabs[(index-1)];
					this.select(this.tabs[(index-1)]);
				}
			}
		},
		/**
		 * 显示当前被选中的tab
		 * */
		show:function(){
			
			if(this.currentTab.trigger){
				this.currentTab.trigger.style.display = 'block';
			}
			$D.addClass(this.currentTab.trigger, 'current');
			if(this.currentTab.sheet){
				this.currentTab.sheet.style.display = 'block';
			}
			$E.trigger(this, "show", this.currentTab);
			//this.onShow.fire(this.currentTab);
		},
		/**
		 * 自动切换
		 * */
		slide:function(){
			var	config = this.config,
				_this = this,
				intervalId,
				delayId;
			J.each(this.tabs, function(){
				var tab = this;
				$E.on(tab.trigger, 'mouseover' , clear);
				$E.on(tab.sheet, 'mouseover' , clear);
				
				$E.on(tab.trigger, 'mouseout' , delay);
				$E.on(tab.sheet, 'mouseout' , delay);
			});
			start();
			function start() {
				var i = _this.indexOf(_this.currentTab);
				if( i == -1 ) return;
				intervalId = window.setInterval(function(){
					var tab = _this.tabs[ ++i % _this.tabs.length ];
					if(tab){
						_this.select(tab);
					}
				},config['slideInterval']);
			}
			function clear() {
				window.clearTimeout(delayId);
				window.clearInterval(intervalId);	
			}
			function delay() {
				delayId = window.setTimeout(start,config['slideDelay']);
			}
		},
		/**
		 * 获取tab在tabs数组中的索引
		 * @param {object} tab  tab对象 {trigger:HTMLElement,sheet:HTMLElement}
		 * */
		indexOf:function(tab){
			for(var i = 0, len = this.tabs.length; i < len; i++){
				if(tab.trigger == this.tabs[i].trigger)
					return i;
			}
			return -1;
		},
		/**
		 * 初始化函数
		 * */
		init:function(){
			var config = this.config,
				_this = this;

			J.each(this.tabs, function(){
				var tab = this;

				$E.on(tab.trigger,config['triggerEvent'], function(){
					_this.select.call(_this,tab);
				});
				if(tab.sheet){
					tab.sheet.style.display = 'none';
				}
			});
			
			this.select(this.tabs[config['defaultIndex']]);
			if(config['slideEnabled']){
				this.slide();
			}
		}
	};

});















