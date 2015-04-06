/*
 * Created by Armour on 2015/4/4.
 */

(function(global) {
	window.addEventListener("load", eventWindowLoaded, false);

	var Debugger = function() {};
	Debugger.log = function(message) {
		try {
			console.log(message);
		} catch (exception) {
			return;
		}
	}

	function eventWindowLoaded() {
		canvasApp();
	}

	function canvasSupport() {
		return Modernizr.canvas;
	}

	function canvasApp() {
		if (!canvasSupport()) {
			return;
		}
		var theCanvas = document.getElementById("canvasOne");
		var context = theCanvas.getContext("2d");
		Debugger.log("Drawing Canvas");

		function drawScreen() {
			//background
			context.globalAlpha = 1;
			context.fillStyle = "#000000";
			context.fillRect(0, 0, 1082, 608);
		}

		drawScreen();
	}
})(this);

