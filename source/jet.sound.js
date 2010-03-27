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
		$E = J.event,
		isInit = false;

	J.sound = J.sound || {};

	

	
	var getFlashObject = function(){
		var node = $D.id("jetSound");
		return node;
	};

	
	/**
	 * public functions
	 */
    var play = function(filename){
    	if(isInit){
    		
    	}else{
    		var node = $D.node("div", {
				"id":"jetSound",
				"style":"position:absolute;left:-999px;top:-999px;width:1px;height:1px;overflow:hidden;"
			});
			document.body.appendChild(node);
			J.swfobject.embedSWF("player_mp3.swf", "jetSound", "300", "120", "9.0.0", "expressInstall.swf", {listener:"player",interval:500});
    	}
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
