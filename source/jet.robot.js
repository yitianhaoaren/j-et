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
 * robot 包
 */
Jet().$package(function(J){
	J.robot = J.robot || {};
	
});
/**
 * Robot 类
 */
Jet().$package(function(J){
	var $D = J.dom,
		$E = J.event;

	var Robot = new J.Class({
		init : function(){
			J.out("I'm a robot!");
		},
		
		a : 1
	
	});
		
	J.robot.Robot = Robot;

});













