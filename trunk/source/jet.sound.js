/**
 * [Javascript core part]: sound 扩展
 */
 
var player = {
	onInit : function(){
		//getFlashObject().SetVariable("method:setUrl", "voice_mp3/ch.mp3");
	}

};
Jet().$package(function(J){
	var $D = J.dom,
		$E = J.event;

	J.sound = J.sound || {};


	/*
		
	var host = "http://"+window.location.host + "/soyi/";
	var div = document.createElement("div");
	div.innerHTML = '<object id="myFlash" type="application/x-shockwave-flash" data="'+host+'js/player_mp3.swf" width="1" height="1">\
		<param name="movie" value="./js/player_mp3.swf" />\
		<param name="AllowScriptAccess" value="always" />\
		<param name="FlashVars" value="listener=player&amp;interval=500" />\
	</object>';
	*/
	
	var node = $D.node("div", {
		"id":"jetSound",
		"style":"position:absolute;left:-999px;top:-999px;width:1px;height:1px;overflow:hidden;"
	});
	document.body.appendChild(node);
	J.swfobject.embedSWF("player_mp3.swf", "jetSound", "300", "120", "9.0.0", "expressInstall.swf", "listener=player&amp;interval=500");
	
	

	
	var getFlashObject = function(){
		return $D.id("jetSound");
	};
	

	
	/**
	 * Initialize
	 */
	var onInit = function(){
		//getFlashObject().SetVariable("method:setUrl", "voice_mp3/ch.mp3");
	};
	
	
	
	
	/**
	 * public functions
	 */
    var play = function(filename){
		if(filename){
    		getFlashObject().SetVariable("method:setUrl", filename);
		}
        getFlashObject().SetVariable("method:play", "");
		
    };
    var pause = function(){
		getFlashObject().SetVariable("method:pause", "");
    };
    var stop = function(){
        getFlashObject().SetVariable("method:stop", "");
    };
	


	J.sound.play = play;
	J.sound.pause = pause;
	J.sound.stop = stop;

});
