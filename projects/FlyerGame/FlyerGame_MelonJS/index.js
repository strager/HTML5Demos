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
	FLYER_MOVEMENT_RADIUS : 30, 	//increase to move more per keypress
	STAGE_VICTORY_Y_POSITION : 30,
	ENEMY_MAX_MOVEMENT_RADIUS : 300, //increase to raise difficulty
	
	//TEXT
	scoreText : "",
	
	//SOUNDS
	//winGame_sound :		new ig.Sound( './media/sounds/WinGameSound.*', false ),
	//loseGame_sound :	new ig.Sound( './media/sounds/LoseGameSound.*', false ),
	//moveFlyer_sound :	new ig.Sound( './media/sounds/MoveFlyerSound.*', false ),
	
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
		
      	//me.debug.renderHitBox = true;
      
      	// init the video
		if (!me.video.init('main_canvas',  jsApp.STAGE_WIDTH,  jsApp.STAGE_HEIGHT))
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
		me.state.transition("fade", "#FFFFFF", 15);
      
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT,		"left");
		me.input.bindKey(me.input.KEY.RIGHT,	"right");
		me.input.bindKey(me.input.KEY.X,		"jump", true);
	  
      	// start the game 
		me.state.change(me.state.PLAY);
	}

}; // jsApp

//**************************************************
//DELARE SCREEN #2 OF 2 : PLAY
//**************************************************
var PlayScreen = me.ScreenObject.extend(
{
	
    // constructor
    init: function() {
        this.parent(true);
    },


   onResetEvent: function()
	{
		
		this.doSetup();
	},
	
	doSetup: function()
	{
		this.doSetupStage();
		this.doSetupSprites();
		this.doApplyEffects();
		this.doSetupGameLoop();
		this.doStartGameplay();
	},
	
	doSetupStage: function()
	{
		//
		
		
      // load a level
		//me.levelDirector.loadLevel("area01");
      
      // add a default HUD to the game mngr
		me.game.addHUD(jsApp.STAGE_X, jsApp.STAGE_Y, jsApp.STAGE_WIDTH,  jsApp.STAGE_HEIGHT);
		
		// add a new HUD item 
		me.game.HUD.addItem("score", new ScoreObject(200,10));
		me.game.HUD.updateItemValue("score", "Score : " + jsApp.STAGE_WIDTH);
		
      
	},
	
	doSetupSprites: function()
	{
		
		//USE IF TO PREVENT - RECREATING THINGS
		if (this.background_spriteobject == null){
			
			//BG
			this.background_spriteobject = new SpriteObject (jsApp.STAGE_X, jsApp.STAGE_Y, me.loader.getImage("background"));
			me.game.add (this.background_spriteobject,1);
			
			//	1. I TRY to put a SpriteObject subclass on the screen - SUCCESS. 
			var b = new BiplaneEntity(20, 20);
	        me.game.add(b,2);
			
			
			//	2. I TRY to put a ObjectEntity subclass on the screen - FAIL. I think I need this one for keys/movement/collision though, Right?
			//var b2 = new BiplaneEntity2(20, 20);
	        //me.game.add(b2,3);
	        
			
			// make sure everyhting is in the right order
			me.game.sort();
			
		}
	},
	
	doApplyEffects: function()
	{
		//
	},
	
	doSetupGameLoop: function()
	{
		//
	},
	
	doStartGameplay: function()
	{
		//RESET DEBUG
		setDebugText("<strong>Debug:</strong> FPS : " + me.sys.fps);
	},
	
	
	
	setScore: function (score_num) {
		this.scoreText = "Score: " + score_num;
	},
	
	
	//OUTPUT A VICTORY MESSAGE AND 'STOP' THE GAME
	doEndGameWithWin: function () {
		
		//MESSAGE
		addDebugText("You Won the Game!");
		
		//SET SCORE
		this.setScore (100);
		
		//PLAY SOUND
		this.playWinGameSound();
		
		//END GAME, STOP LISTENTING TO EVENTS
		this.onStopGame();
		
	
	},
	
	//OUTPUT A FAILURE MESSAGE AND 'STOP' THE GAME
	doEndGameWithLoss: function () {
		
		//MESSAGE
		addDebugText("You Lost the Game!");
		
		//SET SCORE
		this.setScore (-100);
		
		//PLAY SOUND
		this.playLoseGameSound();
		
		//END GAME
		this.onStopGame();
	
	},
	
	//STOP THE GAME
	onStopGame: function () {
		me.state.pause();
		
	},


	//PLAY WHEN NEEDED
	playWinGameSound : function () {
		me.audio.playTrack("WinGameSound");
	},
	
	//PLAY WHEN NEEDED
	playLoseGameSound : function () {
		me.audio.playTrack("LoseGameSound");
	},

	//PLAY WHEN NEEDED
	playMoveFlyerSound : function () {
		me.audio.playTrack("MoveFlyerSound");
	},
	
	
	// draw function
    draw: function(context) {
        //context.drawImage(this.title, 550, 0);

    },
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
	onDestroyEvent: function()
	{  
      // remove the HUD
      me.game.disableHUD();
      
      // stop the current audio track
      me.audio.stopTrack();
   }

});


//**************************************************
//DELARE SPRITE - ENEMY
//
//
//	3. I TRY to put a SpriteObject subclass on the screen - SUCCESS. 
//
//
//	4. I TRY to put a ObjectEntity subclass on the screen - FAIL. I think I need this for keys/movement/collision though, Right?
//
//**************************************************
var BiplaneEntity = me.SpriteObject.extend(
{	
	init: function (x, y)
	{
		this.parent(x,y,me.loader.getImage("blimp"));
	},
	
	
	// manage the enemy movement
	update : function ()
	{
		//KEYS FAIL
		if (me.input.isKeyPressed('up'))
		{
		    addDebugText("Up");
		}
	}
	
	
});

var BiplaneEntity2 = me.ObjectEntity.extend(
{	
	init: function (x, y)
	{
		// define this here instead of tiled
		settings = {};
		settings.image = "blimp";
		settings.spritewidth = 64;
		this.parent(x,y, settings);
	}
});


//************************************************************
//************************************************************
//FUNCTIONS 
//************************************************************
//************************************************************

//JAVASCRIPT BUTTON - RESTART THE GAME
function restartGame () {
	
	jsApp.onload();

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
	restartGame();
});


	
