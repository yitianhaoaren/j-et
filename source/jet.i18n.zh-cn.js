/**	
 * JOS (Javascript Operating System) 
 * Copyright (c) 2009, KDV.cn, All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.kdv.cn/jos/license.txt
 *
 * @fileOverview All Jos in one!
 * @version	1.0
 * @author	<a href="mailto:Kinvix@gmail.com">Kinvix@gmail.com</a>
 * @title  Jos Global
 * @description This is Javascript's original form.
 * 
 */



/**
 * [Javascript core part]: Javascript自身扩展
 */
Jos().$package(function(J){

	J.I18n.add({
		"zh-cn":{
			// 数字
			number:"ddd,ddd.dd",
			// 货币
			currency:"￥ddd,ddd.dd元",
			// 日期
			date: "yyyy-MM-dd",
			// 长日期
			longDate:"yyyy年MM月dd日",
			// 时间
			time: "hh小时mm分ss秒",
			// 文本
			text: {
				helloWorld:"你好,世界!",
				test: "测试",
				onlyDefaultHas: "只有默认语言才有的...",
				about: "Jos 框架, 开发者: 于涛!"
			}
			
		}
	});
});


















