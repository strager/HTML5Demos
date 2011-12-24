/**
 * Copyright (C) 2005-2012 by Rivello Multimedia Consulting (RMC).                    
 * code [at] RivelloMultimediaConsulting [dot] com                                                  
 *                                                                      
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the      
 * "Software"), to deal in the Software without restriction, including  
 * without limitation the rights to use, copy, modify, merge, publish,  
 * distribute, sublicense, and#or sell copies of the Software, and to   
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:                                            
 *                                                                      
 * The above copyright notice and this permission notice shall be       
 * included in all copies or substantial portions of the Software.      
 *                                                                      
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,      
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF   
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR    
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.                                      
 */
// Marks the right margin of code *******************************************************************



//**************************************************
//SETUP RESOURCES
//**************************************************
var g_resources= [  

	//fonts
     {name: "32x32_font",   	type:"image",	src: "assets/fonts/32x32_font.png"},
     // audio resources
     {name: "LoseGameSound",   	type:"audio",	src: "assets/sounds/", channel : 1},
     {name: "MoveFlyerSound",   type:"audio",	src: "assets/sounds/", channel : 2},
     {name: "WinGameSound",   	type:"audio",	src: "assets/sounds/", channel : 3},
      // images
     {name: "background",   	type:"image",	src: "assets/images/background.png"},
     {name: "biplane",      	type:"image",	src: "assets/images/biplane.png"},
     {name: "blimp",        	type:"image",	src: "assets/images/blimp.png"},
     {name: "flyer",        	type:"image",	src: "assets/images/flyer.png"}
  ]; 


//**************************************************
//DELARE CORE GAME CLASS
//**************************************************
var jsApp	= 
{	

	//**************************************************
	//**************************************************
	//PROPERTIES - Available inside & outside of functions
	//**************************************************
	//**************************************************
	
	//DISPLAY
	STAGE_X : 0,
	STAGE_Y : 0,
	STAGE_WIDTH : 800,
	STAGE_HEIGHT : 600,
	FRAMES_PER_SECOND : 60,
	FLYER_MOVEMENT_RADIUS : 50, 	//increase to move more per keypress
	STAGE_VICTORY_Y_POSITION : 30,
	ENEMY_MAX_MOVEMENT_RADIUS : 25, //increase to raise difficulty
	
	//TEXT
	scoreText : "",
	
	//SOUNDS
	WIN_GAME_SOUND :	"WinGameSound",
	LOSE_GAME_SOUND :	"LoseGameSound",
	MOVE_FLYER_SOUND :	"MoveFlyerSound",
	
	//FONTS
	//font : new ig.Font( './media/fonts/arial30.png' ),
	
	//************************************************************
	//************************************************************
	//FLOW
	//
	//Upon refresh of the html page, the order of execution is
	//
	//  jsApp.onLoad() -> this.loaded() ->
	//	this.doSetup() ->
	//	this.doSetupStage() ->
	//	this.doSetupSprites() ->
	//	this.doApplyEffects() ->
	//	this.doSetupGameLoop() ->
	//	this.doStartGameplay() ->
	//
	//
	//************************************************************
	//************************************************************
	
	
	//************************************************************
	//************************************************************
	//FUNCTIONS 
	//************************************************************
	//************************************************************
	
	//INITIALIZE THE GAME
	onload: function()
	{
		
		//VERY HELPFUL TO SHOW A RED BOX AROUND EVERY 'SPRITE', SET TO TRUE DURING DEBUGGING
      	//me.debug.renderHitBox = true;
      
      	// init the video
      	var useDoubleBuffering = true;
      	var stageScale = 1;
		if (!me.video.init('main_canvas',  jsApp.STAGE_WIDTH,  jsApp.STAGE_HEIGHT, useDoubleBuffering, stageScale))
		{
			alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
         	return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
		
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
      
      	// set a global fading transition for the screen
		me.state.transition("fade", "#FFFFFF", 250);
      
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,		"left", 	true); //true = can't hold down key
		me.input.bindKey(me.input.KEY.RIGHT,	"right",	true);
		me.input.bindKey(me.input.KEY.UP,		"up", 		true);
		me.input.bindKey(me.input.KEY.DOWN,		"down", 	true);
	  
      	// start the game 
		me.state.change(me.state.PLAY);
	}

}; // jsApp

//************************************************************
//************************************************************
//FUNCTIONS 
//************************************************************
//************************************************************

//JAVASCRIPT BUTTON - RESTART THE GAME
function restartGame () {
	
	me.state.resume();
	// (re)start the game 
	me.state.change(me.state.PLAY);

}

//JAVASCRIPT BUTTON - TOGGLE PAUSE
function togglePause () {
	
	//CHECK
	if (me.state.isRunning() == true){
		me.state.pause();
	} else {
		me.state.resume();
	}
	
	//DEBUG
	addDebugText ("Paused : " + me.state.isRunning() );
}

//JAVASCRIPT BUTTON - REPLACE DEBUG TEXT
function setDebugText (message_str) {
  var debugTextElement = document.getElementById("debugText_div");
  debugTextElement.innerHTML = message_str;
}
//JAVASCRIPT BUTTON - ADD TO DEBUG TEXT
function addDebugText (message_str) {
  var debugTextElement = document.getElementById("debugText_div");
  debugTextElement.innerHTML += "<BR>" + message_str;
}

//**************************************************
//BOOTSTRAP
//**************************************************
window.onReady(function() 
{
	jsApp.onload();
});


	
