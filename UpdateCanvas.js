function posMove(code) { //cope with all the position changes
	cursorBlink = 0; //before each move, the cursor is made black, and stops blinking
	var blackCur = _canvasContext.createImageData(2, 16);
	var bCurX;
	var bCurXX;
	for (bCurX = 0; bCurX <= 32; bCurX++) {
		bCurXX = bCurX * 4;
		blackCur.data[bCurXX] = 0;
		blackCur.data[bCurXX + 1] = 0;
		blackCur.data[bCurXX + 2] = 0;
		blackCur.data[bCurXX + 3] = 255;
	}
	_canvasContext.putImageData(blackCur, pos.x, pos.y, 0, 0, 2, 16);
	if (code == 37) {
		if (pos.x >= 18) pos.x -= 18;
		else if (pos.y >= 16) {
			pos.x = _canvas.width - 2;
			pos.y -= 16;
		}
	} else if (code == 38) {
		if (pos.y >= 16) pos.y -= 16;
	} else if (code == 39) {
		if (pos.x <= _canvas.width - 20) pos.x += 18; //watch out when input
		else if (pos.y < _canvas.height - 48) {
			pos.y += 16;
			pos.x = 0;
		}
	} else if (code == 40) {
		if (pos.y < _canvas.height - 48) pos.y += 16;
	}
	cursorBlink = 1; //the cursor recovers blinking
}

function setBuffer() {
	if (firstTimeInput) { // everytime when we press the first letter
		localStorage.setItem("buffer", JSON.stringify(_canvasContext.getImageData(pos.x, pos.y + 16, INPUT_WIDTH, INPUT_HEIGHT).data));
		firstTimeInput = false;
	}
}

function loadBuffer() {
	if (typeof localStorage["buffer"] !== "undefined" && localStorage["buffer"] !== "undefined") {
		var _tmpObject = JSON.parse(localStorage["buffer"]);
		var _tmpImageData = _canvasContext.getImageData(0, 0, INPUT_WIDTH, INPUT_HEIGHT);
		for (var key in _tmpObject)
			_tmpImageData.data[key] = _tmpObject[key];
		_canvasContext.putImageData(_tmpImageData, pos.x, pos.y + 16, 0, 0, INPUT_WIDTH, INPUT_HEIGHT);
	}
	firstTimeInput = true;
}

window.addEventListener("keydown", function(e) { //cope with all the key press down
	console.log(e.keyCode);
	e.preventDefault();
	if (e.keyCode >= 37 && e.keyCode <= 40) { //up down left and right
		if (_input.getmode() === 0) {
			posMove(e.keyCode);
		} else {
			if (e.keyCode === 37 || e.keyCode === 38) _input.guessScroll(-1);
			else _input.guessScroll(1);
		}
	} else if (e.keyCode === 16) { //shift, change the language mode
		if (!lang) {
			loadBuffer();
			var shiftletter = _canvasContext.createImageData(16, 16);
			for (var shifta = 0; shifta < _input.input_cache.length; shifta++) {
				if (pos.x === _canvas.width - 2) posMove(39);
				if (pos.x === _canvas.width - 2 && pos.y === _canvas.height - 48) break;
				_input.drawChar(_input.letter[_input.input_cache[shifta] - 65], shiftletter);
				_canvasContext.putImageData(shiftletter, pos.x + 2, pos.y, 0, 0, 16, 16);
				posMove(39);
			}
			_input.inputClear();
		}
		lang = !lang;
	} else if ((e.keyCode >= 65 && e.keyCode <= 90)) { //letters
		if (!lang) {
			setBuffer();
			_input.input_detection(e.keyCode);

		} else { //Eng mode, directly put it on the notepad
			if (pos.x === _canvas.width - 2) posMove(39);
			if (pos.x === _canvas.width - 2 && pos.y === _canvas.height - 48);
			else {
				var directLetter = _canvasContext.createImageData(16, 16); //directly writing letters on the notepad
				_input.drawChar(_input.letter[e.keyCode - 65], directLetter);
				_canvasContext.putImageData(directLetter, pos.x + 2, pos.y, 0, 0, 16, 16);
				posMove(39);
			}
		}
	} else if (e.keyCode === 8) { //backspace
		if (_input.getmode()) {
			_input.input_detection(e.keyCode);
			if (!_input.input_cache.length) //  when the last letter has been deleted
				loadBuffer();
		} else if (pos.x != 0 || pos.y != 0) {
			posMove(37);
			_canvasContext.fillStyle = "black";
			_canvasContext.fillRect(pos.x + 2, pos.y, 16, 16);
		} //delete the input content in the notepad
	} else if (e.keyCode === 32) { //blank
		if (_input.getmode()) {
			loadBuffer();
			var confirmChar = _input.confirmChar(0);
			_input.inputClear();
			if (pos.x === _canvas.width - 2) posMove(39);
			if (pos.x === _canvas.width - 2 && pos.y === _canvas.height - 48);
			else {
				_canvasContext.putImageData(confirmChar, pos.x + 2, pos.y, 0, 0, 16, 16);
			}
			posMove(39);

		} else posMove(39);
	} else if (e.keyCode === 13) { //enter
		if (!_input.getmode()) {
			if (pos.y < _canvas.height - 48) {
				cursorBlink = 0;
				var eblackCur = _canvasContext.createImageData(2, 16);
				var ebCurX;
				var ebCurXX;
				for (ebCurX = 0; ebCurX <= 32; ebCurX++) {
					ebCurXX = ebCurX * 4;
					eblackCur.data[ebCurXX] = 0;
					eblackCur.data[ebCurXX + 1] = 0;
					eblackCur.data[ebCurXX + 2] = 0;
					eblackCur.data[ebCurXX + 3] = 255;
				}
				_canvasContext.putImageData(eblackCur, pos.x, pos.y, 0, 0, 2, 16);
				pos.y += 16;
				pos.x = 0;
				cursorBlink = 1;
			}
		} else { //put the letters in the input bar in the notepad
			loadBuffer();
			var enterletter = _canvasContext.createImageData(16, 16);
			for (var a = 0; a < _input.input_cache.length; a++) {
				if (pos.x === _canvas.width - 2) posMove(39);
				if (pos.x === _canvas.width - 2 && pos.y === _canvas.height - 48) break;
				_input.drawChar(_input.letter[_input.input_cache[a] - 65], enterletter);
				_canvasContext.putImageData(enterletter, pos.x + 2, pos.y, 0, 0, 16, 16);
				posMove(39);
			}
			_input.inputClear();
		}
	} else if (e.keyCode >= 48 && e.keyCode <= 57) { //numbers
		if (!_input.getmode()) {
			var directNum = _canvasContext.createImageData(16, 16);
			_input.drawChar(_input.num[e.keyCode - 48], directNum);
			if (pos.x === _canvas.width - 2) posMove(39);
			if (pos.x === _canvas.width - 2 && pos.y === _canvas.height - 48);
			else {
				_canvasContext.putImageData(directNum, pos.x + 2, pos.y, 0, 0, 16, 16);
			}
			posMove(39);
		} else { //confirm the character
			loadBuffer();
			var guesConf = _input.confirmChar(e.keyCode - 48);
			_input.inputClear();
			if (guesConf) {
				if (pos.x === _canvas.width - 2) posMove(39);
				if (pos.x === _canvas.width - 2 && pos.y === _canvas.height - 48);
				else {
					_canvasContext.putImageData(guesConf, pos.x + 2, pos.y, 0, 0, 16, 16);
				}
				posMove(39);

			}
		}
	} else if (e.keyCode === 189) {
		_input.guessScroll(-1);
	} else if (e.keyCode === 187) {
		_input.guessScroll(1);
	}
});

function showBox() {
	if (_input.getmode()) {
		_inputCanvas = _input.getbox();
		_canvasContext.putImageData(_inputCanvas, pos.x, pos.y + 16, 0, 0, INPUT_WIDTH, INPUT_HEIGHT);
		//_canvasContext.putImageData(_inputCanvas, pos.x, pos.y + INPUT_HEIGHT, 0, 0, INPUT_WIDTH, INPUT_HEIGHT);
		_canvasContext.lineWidth = 1;
		_canvasContext.strokeStyle = "white";
		_canvasContext.strokeRect(pos.x + 1, pos.y + INPUT_HEIGHT + 1, INPUT_WIDTH - 2, INPUT_HEIGHT - 2);
	}
	if (!lang) {
		_input.drawChar(_input.letter[2], langmode);
	} else {
		_input.drawChar(_input.letter[4], langmode);
	}
	_canvasContext.putImageData(langmode, _canvas.width - 16, _canvas.height - 16, 0, 0, 16, 16);
	setTimeout(showBox, 100);
}

function showCursor() {
	var curX;
	var curXX;
	cursorBlink = !cursorBlink;
	for (curX = 0; curX < 32; curX++) {
		curXX = curX * 4;
		if (cursorBlink) {
			cursor.data[curXX] = 0;
			cursor.data[curXX + 1] = 255;
			cursor.data[curXX + 2] = 0;
			cursor.data[curXX + 3] = 255;
		} else {
			cursor.data[curXX] = 0;
			cursor.data[curXX + 1] = 0;
			cursor.data[curXX + 2] = 0;
			cursor.data[curXX + 3] = 255;
		}
	}
	_canvasContext.putImageData(cursor, pos.x, pos.y, 0, 0, 2, 16);
	setTimeout(showCursor, 300);
}
