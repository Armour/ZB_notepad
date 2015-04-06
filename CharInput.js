/**
 * Created by Bernard on 2015/4/3.
 */
/*
    ReadMe:
        how to use:
            1. use the constructor Input to construct one input object, the parameter is in JSON form {name:   ,height:  , width:  }  the name is the id
            2.then call input.init();
            3. the input.getbox() method could return the image data of the two bars, which could be used to paste on the text editor
        !!!NOTE: the texteditor should remember the area which would be covered by the floating window
*/

(function(global) {
    var input_cache=[];
    var output_cache=[];
    var element;
    var context;
    var option;
    var spell;
    var guess;
    var mode=0;

    function input_detection(key) {
        if(key>=65&&key<=90) {
            input_cache[input_cache.length++]= key;
            //output_cache[output_cache.length++]= key;
        }else if(key===8) {		// delete
			input_cache.length--;
			//output_cache.length--;
		}
        box_detection();
    }
    Input.prototype.input_cache=input_cache;
	Input.prototype.input_detection = input_detection;

    var num=[];
    num[0]="0000000000000000000001111100000000001000001000000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000100000001000000010000000010000010000000000111110000000000000000000000";
    num[1]="0000000000000000000000010000000000000011000000000000010100000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000100000000000000010000000000000111110000000000000000000000";
    num[2]="0000000000000000000001111000000000001000010000000001000000100000000100000010000000000000001000000000000000100000000000000100000000000000100000000000000100000000000000100000000000000100000000000000100000010000000100000001000000011111111100000000000000000000";
    num[3]="0000000000000000000001111110000000001000000100000000000000010000000000000010000000000000010000000000000111000000000000000010000000000000000100000000000000010000000000000001000000000000000100000000000000100000000000001100000000001111000000000000000000000000";
    num[4]="0000000000000000000000011000000000000001100000000000001010000000000000101000000000000100100000000000010010000000000010001000000000001000100000000001000010000000000100001000000000111111111100000000000010000000000000001000000000000011111000000000000000000000";
    num[5]="0000000000000000000111111110000000010000000000000001000000000000000100000000000000010000000000000001011110000000000110000100000000010000001000000000000000100000000000000010000000000000010000000000000001000000000000111000000000011100000000000000000000000000";
    num[6]="0000000000000000000000011000000000000010000000000000010000000000000010000000000000001000000000000001000000000000000101111000000000011000010000000001000000100000000100000010000000010000001000000001000000100000000010000100000000000111100000000000000000000000";
    num[7]="0000000000000000000111111111000000010000000100000001000000010000000000000010000000000000001000000000000001000000000000001000000000000000100000000000000100000000000000010000000000000001000000000000001000000000000000100000000000000010000000000000000000000000";
    num[8]="0000000000000000000001111100000000001000001000000001000000010000000100000001000000010000000100000000100000100000000001111100000000001000001000000001000000010000000100000001000000010000000100000001000000010000000010000010000000000111110000000000000000000000";
    num[9]="0000000000000000000001111000000000001000010000000001000000100000000100000010000000010000001000000001000000100000000010000110000000000111101000000000000000100000000000000100000000000000010000000000000010000000000000010000000000000110000000000000000000000000";
    Input.prototype.num=num;
    /*00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000*/
    var letter=[];
    letter[0] ="0000000000000000000000000000000000000000000000000000000000000000000000000000000000001111100000000001000001000000000000000100000000001111110000000001000001000000000100000101000000001111101000000000000000000000000000000000000000000000000000000000000000000000";
    letter[1] ="0000000000000000000010000000000000001000000000000000100000000000000010000000000000001011100000000000110001000000000010000010000000001000001000000000100000100000000011000100000000001011100000000000000000000000000000000000000000000000000000000000000000000000";
    letter[2] ="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000111110000000000100000100000000100000000000000010000000000000001000000000000000010000010000000000111110000000000000000000000000000000000000000000000000000000000000000000000";
    letter[3] ="0000000000000000000000000010000000000000001000000000000000100000000000000010000000000011101000000000010001100000000010000010000000001000001000000000100000100000000001000110000000000011101000000000000000000000000000000000000000000000000000000000000000000000";
    letter[4] ="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000011100000000000010001000000000010000010000000001111111000000000100000000000000001000010000000000011110000000000000000000000000000000000000000000000000000000000000000000000";
    letter[5] ="0000000000000000000000001100000000000001001000000000000100100000000000010000000000000001000000000000011111000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000000000000";
    letter[6] ="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000011101000000000010001100000000010000010000000001000001000000000010001100000000000111010000000000000001000000000000000100000000010000100000000000111100000000000000000000000";
    letter[7] ="0000000000000000000010000000000000001000000000000000100000000000000010000000000000001001110000000000101000100000000011000010000000001000001000000000100000100000000010000010000000001000001000000000000000000000000000000000000000000000000000000000000000000000";
    letter[8] ="0000000000000000000000010000000000000001000000000000000000000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000000000000000000000000000000000000000000000000000000000000";
    letter[9] ="0000000000000000000000010000000000000001000000000000000000000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000010100000000000001010000000000000010000000000000000000000000";
    letter[10]="0000000000000000000010000000000000001000000000000000100000000000000010000000000000001000100000000000100100000000000010100000000000001101000000000000100010000000000010000100000000001000001000000000000000000000000000000000000000000000000000000000000000000000";
    letter[11]="0000000000000000000000110000000000000001000000000000000100000000000000010000000000000001000000000000000100000000000000010000000000000001000000000000000100000000000000010100000000000001100000000000000000000000000000000000000000000000000000000000000000000000";
    letter[12]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000011010110000000000110100100000000010010010000000001001001000000000100100100000000010010010000000001001001100000000000000000000000000000000000000000000000000000000000000000000";
    letter[13]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000011011000000000000110010000000000010001000000000001000100000000000100010000000000010001000000000001000110000000000000000000000000000000000000000000000000000000000000000000000";
    letter[14]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000111000000000000100010000000000100000100000000010000010000000001000001000000000010001000000000000111000000000000000000000000000000000000000000000000000000000000000000000000";
    letter[15]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000011011100000000000110001000000000010000010000000001000001000000000100000100000000011000100000000001011100000000000100000000000000010000000000000001000000000000000000000000000";
    letter[16]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000011101000000000010001100000000010000010000000001000001000000000100000100000000001000110000000000011101000000000000000100000000000000010000000000000001100000000000000000000";
    letter[17]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000101100000000000001001000000000000100000000000000010000000000000001000000000000000100000000000000010000000000000000000000000000000000000000000000000000000000000000000000000";
    letter[18]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000111100000000000100001000000000010000000000000000111100000000000000001000000000010000100000000000111100000000000000000000000000000000000000000000000000000000000000000000000";
    letter[19]="0000000000000000000000010000000000000001000000000000000100000000000000010000000000000111110000000000000100000000000000010000000000000001000000000000000100000000000000010100000000000000100000000000000000000000000000000000000000000000000000000000000000000000";
    letter[20]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000001100010000000000010001000000000001000100000000000100010000000000010001000000000001001100000000000011011000000000000000000000000000000000000000000000000000000000000000000000";
    letter[21]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000001000001000000000100000100000000001000100000000000100010000000000001010000000000000101000000000000001000000000000000000000000000000000000000000000000000000000000000000000000";
    letter[22]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000010001000100000000100100100000000010010010000000001010101000000000101010100000000001000100000000000100010000000000000000000000000000000000000000000000000000000000000000000000";
    letter[23]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000001000001000000000010001000000000000101000000000000001000000000000001010000000000001000100000000001000001000000000000000000000000000000000000000000000000000000000000000000000";
    letter[24]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000001000001000000000010001000000000001000100000000000010100000000000000100000000000000010000000000000010000000000000001000000000000001000000000000001000000000000000000000000000";
    letter[25]="0000000000000000000000000000000000000000000000000000000000000000000000000000000000001111110000000000100001000000000000001000000000000001000000000000001000000000000001000100000000001111110000000000000000000000000000000000000000000000000000000000000000000000";
    Input.prototype.letter=letter;
    function Input(options) {
        element=document.getElementById(options.name);
        context=element.getContext("2d");
        option=options;
        spell=context.createImageData(16,16);   //for writing the input spelling
        guess=context.createImageData(16,16);   //for writing the output guesses
    }

    function init() {
        element.height=option["height"];
        element.width=option["width"];
        //context.fillStyle="black";
        //context.fillRect(0,0,element.width,element.height);
        //window.addEventListener("keydown",input_detection);
        //still need one interface with database
    }

    Input.prototype.init=init;

    function box_detection() {    //controls the display of the inputbox
        if(!input_cache.length) {
            output_cache.length=0;
            mode=0;
        }else {
            input_display();
            output_display();
            mode=1;
        }
    }

    function input_display() {
        var i;
        var ch = [];
        context.fillStyle="black";
        context.fillRect(0,0,element.width, element.height/2);
        for (i = 0; i < input_cache.length; i++) {
            ch = searchChar(input_cache[i]);
            //ch = num[0];
            drawChar(ch, spell);
            context.putImageData(spell, i * 16,0, 0,0,16,16);
        }
    }

    function searchChar(ch) {   //set up a local cache for numbers and letters
        return letter[ch-65];
    }

    function output_display() {
		var i;
		var ch=[];
        context.fillStyle="black";
        context.fillRect(0,16,element.width,element.height/2);
		for(i=0; i<output_cache.length; i++) {
            ch=num[i];
            drawChar(ch, guess);
            context.putImageData(guess,i*32,16,0,0,16,16);
			ch=num[i];   //suppose in output_cache it is a 256 length 0's and 1's
            drawChar(ch,guess);
			context.putImageData(guess,i*32+16,16,0,0,16,16);
		}
    }

    function requestOutput() {   //this is an interface for connecting the database

    }

    function drawChar(ch,tgrt) {
        var x;
        var xx;
        for(x=0;x<256;x++) {
            xx=x*4;
            if(ch[x]==0) {
                tgrt.data[xx]=0;
                tgrt.data[xx+1]=0;
                tgrt.data[xx+2]=0;
                tgrt.data[xx+3]=255;
            }else if(ch[x]==1) {
                tgrt.data[xx]=0;
                tgrt.data[xx+1]=255;
                tgrt.data[xx+2]=0;
                tgrt.data[xx+3]=255;
            }
        }
    }
    Input.prototype.drawChar=drawChar;

    function getbox() {
        return context.getImageData(0,0,option.width, option.height);
    }
    Input.prototype.getbox=getbox;

    function getmode() {
        return mode;
    }
    Input.prototype.getmode=getmode;

    function inputClear() {
        input_cache.length=0;
		mode = 0;
    }
    Input.prototype.inputClear=inputClear;

	function confirmChar(a) {
        return context.getImageData(32*a-16,16,16,16);
    }
    Input.prototype.confirmChar=confirmChar;

    global.Input=Input;
})(this);
