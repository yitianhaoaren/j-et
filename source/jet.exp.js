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
		
	J.drag = function(el){
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













