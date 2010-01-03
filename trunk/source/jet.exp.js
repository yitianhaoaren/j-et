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

	J.Drag = new J.Class({
		init:function(apperceiveEl, effectEl){
			var curDragElementX, curDragElementY, dragStartX, dragStartY;
			this.apperceiveEl = apperceiveEl;
			this.effectEl = effectEl || apperceiveEl;
			
			var context = this;
			
			this.dragStart = function(e){
				e.preventDefault();
				curDragElementX = parseInt($D.getStyle(context.effectEl,"left")) || 0;
				curDragElementY = parseInt($D.getStyle(context.effectEl,"top")) || 0;
				dragStartX = e.pageX;
				dragStartY = e.pageY;
				$E.on(document, "mousemove", context.dragMove);
				$E.on(document, "mouseup", context.dragStop);
			};
	
			this.dragMove = function(e){
				if(!context.effectEl){
					return;
				}
				var x = curDragElementX+(e.pageX-dragStartX);
				var y = curDragElementY+(e.pageY-dragStartY);
				context.effectEl.style.left = x+"px";
				context.effectEl.style.top = y+"px";
				$E.notifyObservers(context, "move", {x:x, y:y});
			};
	
			this.dragStop = function(e){
				$E.off(document, "mousemove", context.dragMove);
				$E.off(document, "mouseup", context.dragStop);
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













