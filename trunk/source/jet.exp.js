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
 * 拖拽模块
 */
Jet().$package(function(J){
	var $D = J.dom,
		$E = J.event;
	J.ui = J.ui || {};

	J.ui.Drag = new J.Class({
		init:function(apperceiveEl, effectEl){
			var context = this;
			var curDragElementX, curDragElementY, dragStartX, dragStartY;
			this.apperceiveEl = apperceiveEl;
			if(effectEl === false){
				this.effectEl = false;
			}else{
				this.effectEl = effectEl || apperceiveEl;
			}
			
			
			var ieSelectFix = function(e) {
				e.preventDefault();
	            //return false;
	        };
	        
			this.dragStart = function(e){
				e.preventDefault();
				e.stopPropagation();
				curDragElementX = parseInt($D.getStyle(context.effectEl,"left")) || 0;
				curDragElementY = parseInt($D.getStyle(context.effectEl,"top")) || 0;
				dragStartX = e.pageX;
				dragStartY = e.pageY;
				$E.on(document, "mousemove", context.dragMove);
				$E.on(document, "mouseup", context.dragStop);
				if(J.browser.ie){
					$E.on(document.body, "selectstart", ieSelectFix);
				}
				
				
				$E.notifyObservers(context, "start", {x:curDragElementX, y:curDragElementY});
			};
	
			this.dragMove = function(e){

				var x = curDragElementX+(e.pageX-dragStartX);
				var y = curDragElementY+(e.pageY-dragStartY);
				var isMoved = false;
				
				if(context._oldX !== x){
					context._oldX = x;
					if(context.effectEl){
						context.effectEl.style.left = x+"px";
					}
					isMoved = true;
				}
				if(context._oldY !== y){
					context._oldY = y;
					if(context.effectEl){
						context.effectEl.style.top = y+"px";
					}
					isMoved = true;
				}
				if(isMoved){
					$E.notifyObservers(context, "move", {x:x, y:y});
				}
				
			};
	
			this.dragStop = function(e){
				$E.off(document, "mousemove", context.dragMove);
				$E.off(document, "mouseup", context.dragStop);
				if(J.browser.ie){
					$E.off(document.body, "selectstart", ieSelectFix);
				}
				$E.notifyObservers(context, "finish", {x:context._oldX, y:context._oldY});
			};
			
			$E.on(this.apperceiveEl, "mousedown", this.dragStart);
		},
		lock : function() {
			$E.off(this.apperceiveEl, "mousedown", this.dragStart);
		},
		unlock : function(){
			$E.on(this.apperceiveEl, "mousedown", this.dragStart);
		}
	});
	
	
	
});






/**
 * Resize 模块
 */
Jet().$package(function(J){
	J.ui = J.ui || {};
	var $D = J.dom,
		$E = J.event;

	var id = 0;
	var handleNames = {
			t:"t",
			r:"r",
			b:"b",
			l:"l",
			rt:"rt",
			rb:"rb",
			lb:"lb",
			lt:"lt"
		};
		
	J.ui.Resize = new J.Class({
		init: function(apperceiveEl, effectEl, option){
			var context = this;
			option = option || {};
			
			this.apperceiveEl = apperceiveEl;
			if(effectEl === false){
				this.effectEl = false;
			}else{
				this.effectEl = effectEl || apperceiveEl;
			}
			
			this.size = option.size || 5;
			this.minWidth = option.minWidth || 0;
			this.minHeight = option.minHeight || 0;
			
			
			this._left = this.getLeft();
			this._top = this.getTop();
			this._width = this.getWidth();
			this._height = this.getHeight();
			
			
			this.id = this.getId();

			
			
			var styles = {
				t:"cursor:n-resize; z-index:1; left:0; top:-5px; width:100%; height:5px;",
				r:"cursor:e-resize; z-index:1; right:-5px; top:0; width:5px; height:100%;",
				b:"cursor:s-resize; z-index:1; left:0; bottom:-5px; width:100%; height:5px;",
				l:"cursor:w-resize; z-index:1; left:-5px; top:0; width:5px; height:100%;",
				rt:"cursor:ne-resize; z-index:2; right:-5px; top:-5px; width:5px; height:5px;",
				rb:"cursor:se-resize; z-index:2; right:-5px; bottom:-5px; width:5px; height:5px;",
				lt:"cursor:nw-resize; z-index:2; left:-5px; top:-5px; width:5px; height:5px;",
				lb:"cursor:sw-resize; z-index:2; left:-5px; bottom:-5px; width:5px; height:5px;"
			};
			
			//this._resizeContainerEl = $D.node("div");
			//$D.setCssText(this._resizeContainerEl, "width:0; height:0;");
			
			
			for(var p in handleNames){
				var tempEl = $D.node("div", {
					"id": "window_" + this.id + "_resize_" + handleNames[p]
				});

				//this._resizeContainerEl.appendChild(tempEl);
				this.apperceiveEl.appendChild(tempEl);
				$D.setCssText(tempEl, "position:absolute; overflow:hidden; background:url("+J.path+"assets/images/transparent.gif);" + styles[p]);
				this["_dragController_" + handleNames[p]] = new J.ui.Drag(tempEl, false);

			}
			//this.apperceiveEl.appendChild(this._resizeContainerEl);
			// 左侧
			this._onDragLeftStart = function(xy){
				context._startLeft = context._left = context.getLeft();
				context._startWidth = context._width = context.getWidth();
			};			
			this._onDragLeft = function(xy){
				var w = context._startWidth - xy.x;
				var x = context._startLeft + xy.x;
				if(w >= context.minWidth){
					context.setLeft(x);
					context.setWidth(w);
					$E.notifyObservers(context, "resize", {width:context._width, height:context._height});
				}
			};
			
			// 上侧
			this._onDragTopStart = function(xy){
				context._startTop = context._top = context.getTop();
				context._startHeight = context._height = context.getHeight();
			};			
			this._onDragTop = function(xy){
				var h = context._startHeight - xy.y;
				var y = context._startTop + xy.y;
				if(h >= context.minHeight){
					context.setTop(y);
					context.setHeight(h);
					$E.notifyObservers(context, "resize", {width:context._width, height:context._height});
				}
			};
			
			
			
			// 右侧
			this._onDragRightStart = function(xy){
				context._startWidth = context._width = context.getWidth();
			};			
			this._onDragRight = function(xy){
				var w = context._startWidth + xy.x;
				if(w >= context.minWidth){
					context.setWidth(w);
					$E.notifyObservers(context, "resize", {width:context._width, height:context._height});
				}
			};
			
			
			// 下侧
			this._onDragBottomStart = function(xy){
				context._startHeight = context._height = context.getHeight();
			};			
			this._onDragBottom = function(xy){
				var h = context._startHeight + xy.y;
				if(h >= context.minHeight){
					context.setHeight(h);
					$E.notifyObservers(context, "resize", {width:context._width, height:context._height});
				}
			};
			
			// 左上
			this._onDragLeftTopStart = function(xy){
				context._onDragLeftStart(xy);
				context._onDragTopStart(xy);
			};
			this._onDragLeftTop = function(xy){
				context._onDragLeft(xy);
				context._onDragTop(xy);
			};
			
			// 左下
			this._onDragLeftBottomStart = function(xy){
				context._onDragLeftStart(xy);
				context._onDragBottomStart(xy);
			};
			this._onDragLeftBottom = function(xy){
				context._onDragLeft(xy);
				context._onDragBottom(xy);
			};
			
			
			// 右下
			this._onDragRightBottomStart = function(xy){
				context._onDragRightStart(xy);
				context._onDragBottomStart(xy);
			};
			this._onDragRightBottom = function(xy){
				context._onDragRight(xy);
				context._onDragBottom(xy);
			};
			
			// 右上
			this._onDragRightTopStart = function(xy){
				context._onDragRightStart(xy);
				context._onDragTopStart(xy);
			};
			this._onDragRightTop = function(xy){
				context._onDragRight(xy);
				context._onDragTop(xy);
			};

			

			$E.addObserver(this["_dragController_" + handleNames.t], "start", this._onDragTopStart);
			$E.addObserver(this["_dragController_" + handleNames.t], "move", this._onDragTop);

			$E.addObserver(this["_dragController_" + handleNames.r], "start", this._onDragRightStart);
			$E.addObserver(this["_dragController_" + handleNames.r], "move", this._onDragRight);
			
			$E.addObserver(this["_dragController_" + handleNames.b], "start", this._onDragBottomStart);
			$E.addObserver(this["_dragController_" + handleNames.b], "move", this._onDragBottom);
			
			$E.addObserver(this["_dragController_" + handleNames.l], "start", this._onDragLeftStart);
			$E.addObserver(this["_dragController_" + handleNames.l], "move", this._onDragLeft);
			
			
			
			$E.addObserver(this["_dragController_" + handleNames.rb], "start", this._onDragRightBottomStart);
			$E.addObserver(this["_dragController_" + handleNames.rb], "move", this._onDragRightBottom);
			
			$E.addObserver(this["_dragController_" + handleNames.rt], "start", this._onDragRightTopStart);
			$E.addObserver(this["_dragController_" + handleNames.rt], "move", this._onDragRightTop);
			
			$E.addObserver(this["_dragController_" + handleNames.lt], "start", this._onDragLeftTopStart);
			$E.addObserver(this["_dragController_" + handleNames.lt], "move", this._onDragLeftTop);
			
			$E.addObserver(this["_dragController_" + handleNames.lb], "start", this._onDragLeftBottomStart);
			$E.addObserver(this["_dragController_" + handleNames.lb], "move", this._onDragLeftBottom);
		},
		
		setWidth : function(w){
			$D.setStyle(this.effectEl, "width", w + "px");
			this._width = w;
		},
		setHeight : function(h){
			$D.setStyle(this.effectEl, "height", h + "px");
			this._height = h;
		},
		
		setLeft : function(x){
			$D.setStyle(this.effectEl, "left", x + "px");
			this._left = x;
		},
		setTop : function(y){
			$D.setStyle(this.effectEl, "top", y + "px");
			this._top = y;
		},
		
		
		getWidth : function(){
			return parseInt($D.getStyle(this.effectEl, "width"));
		},
		getHeight : function(){
			return parseInt($D.getStyle(this.effectEl, "height"));
		},
		
		getLeft : function(){
			return parseInt($D.getStyle(this.effectEl, "left"));
		},
		getTop : function(){
			return parseInt($D.getStyle(this.effectEl, "top"));
		},

		getId : function(){
			return id++;
		},
		
		lock : function() {
			//$D.hide(this._resizeContainerEl);

			for(var p in handleNames){
				this["_dragController_" + handleNames[p]].lock();
			}
		},
		unlock : function(){
			//$D.show(this._resizeContainerEl);
			for(var p in handleNames){
				this["_dragController_" + handleNames[p]].unlock();
			}
		}
	});
	
	
	
});













