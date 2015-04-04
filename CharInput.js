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
    function input_detection(e) {
        if(e.keyCode>=65&&e.keyCode<=90) {
            input_cache[input_cache.length++]= e.keyCode;
            //output_cache[output_cache.length++]= e.keyCode;
        }else if(e.keyCode===8) {
            input_cache.length--;
        }
    }

    var map=[]; //this array is one Chinese character, for testing only
    map[0]=[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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
        box_detection();
        window.addEventListener("keydown",input_detection);
        //still need one interface with database
    }

    Input.prototype.init=init;

    function box_detection() {    //controls the display of the inputbox
        if(!input_cache.length) {
            element.height=0;
            element.width=0;
            output_cache.length=0;
            mode=0;
        }else {
            element.height=option["height"];
            element.width=option["width"];
            input_display();
            output_display();
            mode=1;
        }
        setTimeout(box_detection, 100);
    }

    function input_display() {
        var i;
        var ch = [];
        for (i = 0; i < input_cache.length; i++) {
            ch = searchChar(input_cache[i]);
            ch = map[0];
            drawChar(ch, spell);
            context.putImageData(spell, i * 16,0, 0,0,16,16);
        }
    }

    function searchChar(ch) {   //set up a local cache for numbers and letters

    }

    function output_display() {
		var i;
		var ch=[];
		for(i=0; i<output_cache.length; i++) {
			ch=output_cache[i];   //suppose in output_cache it is a 256 length 0's and 1's
			drawChar(ch,guess);
			context.putImageData(guess,i*16,16,0,0,16,16);
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
                tgrt.data[xx]=255;
                tgrt.data[xx+1]=255;
                tgrt.data[xx+2]=255;
                tgrt.data[xx+3]=255;
            }else if(ch[x]==1) {
                tgrt.data[xx]=0;
                tgrt.data[xx+1]=0;
                tgrt.data[xx+2]=0;
                tgrt.data[xx+3]=255;
            }
        }
    }

    function getbox() {
        return context.getImageData(0,0,option.width, option.height);
    }
    Input.prototype.getbox=getbox;

    function getmode() {
        return mode;
    }
    Input.prototype.getmode=getmode;

    global.Input=Input;
})(this);
