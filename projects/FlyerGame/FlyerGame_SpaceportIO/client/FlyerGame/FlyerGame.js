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

function main(stage){
    
    require( ['client/managers/AssetManager', 'client/managers/SoundManager', 'client/FlyerGame/FlyerGameSoundLoader',  ], 
    function(AssetManager, SoundManager, FlyerGameSoundLoader){
    	
	//**************************************************
	//**************************************************
	//PROPERTIES - Available inside & outside of functions
	//**************************************************
	//**************************************************
	
	//DISPLAY
	var STAGE_X = 0;
	var STAGE_Y = 0;
	var STAGE_WIDTH = 800;
	var STAGE_HEIGHT = 600;
	var FRAMES_PER_SECOND = 60;
	var FLYER_MOVEMENT_RADIUS = 50; 	//increase to move more per keypress
	var STAGE_VICTORY_Y_POSITION = 30;
	var ENEMY_MAX_MOVEMENT_RADIUS = 25; //increase to raise difficulty
	
	//SPRITES
	var backgroundMC;
	var biplane1MC; 
	var biplane2MC; 
	var blimp1MC;
	var blimp2MC;
    var flyerMC;
        
	//TEXT
	var score_textfield = null;
	
	//LOADING
	var applicationDomain = null;

	//SOUNDS
	var winGame_sound = null;
	var losegame_sound = null;
	var moveFlyer_sound = null;
	var WIN_GAME_SOUND = "WIN_GAME_SOUND";
	var LOSE_GAME_SOUND = "LOSE_GAME_SOUND";
	var MOVE_FLYER_SOUND = "MOVE_FLYER_SOUND";
	
    //**************************************************
	//**************************************************
	//LOAD ASSETS AND (RE)START THE GAME
	//**************************************************
	//**************************************************
    AssetManager.getAsset( "content/FlyerGame/swf/FlyerGameJS_Assets_v1.swf", function(loaderInfo){
    	applicationDomain = loaderInfo.applicationDomain;
    	
    	//THE HTML BUTTON TO THE RIGHT OF THE GAME MUST *ALSO* ACCESS gameSpecificRestartGame, 
    	//	SO WE SAVE A REFERENCE HERE
    	gameSpecificRestartGame = restartGameInner;
    	gameSpecificRestartGame();
    });
	
    
    //**************************************************
	//**************************************************
	//METHODS
	//**************************************************
	//**************************************************
	
    function doSetupStage () {
    	
    	//SET FRAMERATE - APPEARS TO AFFECT NOTHING
    	stage.frameRate = 60;
    	
   		//SETUP SOUNDS, I externalized the sound loading in FlyerGameSoundLoader 
   		//				only so I could learn more about classes in Spaceport.io. 
   		//				Using an external class is not really required.
		SoundManager.loadPreferences();
		var flyerGameSoundLoader = new FlyerGameSoundLoader();
		flyerGameSoundLoader.load(function(event){
			//WE DON'T WAIT, OR DO ANYTHING, BUT WE COULD...
			//alert ("ALL SOUNDS ARE LOADED");
		});
		
   		//SETUP KEYS
   		//	REMOVE LISTENERS (IF WE ARE RESTARTING)
   		if (stage.hasEventListener (sp.KeyboardEvent.KEY_DOWN) ) {
   			stage.removeEventListener (sp.KeyboardEvent.KEY_DOWN, onKeyboardKeyDown);
   		}
   		if (stage.hasEventListener (sp.KeyboardEvent.KEY_UP) )  {
   			stage.removeEventListener (sp.KeyboardEvent.KEY_UP, onKeyboardKeyUp);
   		}
   		//	ADD LISTENERS 
   		stage.addEventListener( sp.KeyboardEvent.KEY_DOWN, onKeyboardKeyDown );
        stage.addEventListener( sp.KeyboardEvent.KEY_UP, onKeyboardKeyUp );
    }
    
    function doSetupSprites () {
    	
		//BACKGROUND
        BackgroundMC 		= applicationDomain.getDefinition("BackgroundMC");
        backgroundMC 		= new BackgroundMC();
		backgroundMC.x 		= STAGE_X;
		backgroundMC.y 		= STAGE_Y;
        stage.addChild( backgroundMC  );
        
        //FLYER - Put all enemies after (above) Flyer. This helps the look when they collide.
		FlyerMC = applicationDomain.getDefinition("FlyerMC");
        flyerMC = new FlyerMC();
		flyerMC.x = 220;
		flyerMC.y = 520;
        stage.addChild( flyerMC  );
        
			
		//BIPLANES
		BiplaneMC = applicationDomain.getDefinition("BiplaneMC");
        biplane1MC = new BiplaneMC();
		biplane1MC.x = biplane1MC.y = 120;
        stage.addChild( biplane1MC  );
        biplane2MC = new BiplaneMC();
		biplane2MC.x = biplane2MC.y = 330;
        stage.addChild( biplane2MC  );
			
		//BLIMPS
		BlimpMC = applicationDomain.getDefinition("BlimpMC");
        blimp1MC = new BlimpMC();
		blimp1MC.x = blimp1MC.y = 200;
        stage.addChild( blimp1MC  );
        blimp2MC = new BlimpMC();
		blimp2MC.x = blimp2MC.y = 440;
        stage.addChild( blimp2MC  );
			

        //SCORE score_textfield
		var textFormat = new sp.TextFormat ();
		textFormat.size = 30;
		score_textfield = new sp.TextField ();
		score_textfield.defaultTextFormat = (textFormat);
		score_textfield.x = 20;
		score_textfield.y = 20;
		score_textfield.width = 500;
		stage.addChild ( score_textfield );
		setScore (0);
    	
    }

    function doApplyEffects () {
    	
    	//EFFECTS NOT YET SUPPORTED (SPRING 2012?)
    	//backgroundMC;
		//biplane1MC; 
		//biplane2MC; 
		//blimp1MC;
		//blimp2MC;
    	//flyerMC;
    }
    
	     
	//SET REPEATING CODE EXECUTION
	function doSetupGameLoop () {
		
		//SET UNIQUE PROPERTIES OF THE SPRITES
		//EACH IS A CHILD OF THE STAGE AND RECIEVES THE 'TICK' CALL OFTEN
		biplane1MC.speed = ENEMY_MAX_MOVEMENT_RADIUS/2.5;
		biplane1MC.scaleX = -1;
		biplane1MC.onEnterFrame = onTickToMoveLeft;
		
		biplane2MC.speed = ENEMY_MAX_MOVEMENT_RADIUS/2; 
		biplane2MC.onEnterFrame = onTickToMoveRight;
		
		blimp1MC.speed = ENEMY_MAX_MOVEMENT_RADIUS/3;
		biplane1MC.scaleX = -1;
		blimp1MC.onEnterFrame = onTickToMoveLeft;
		
		blimp2MC.speed = ENEMY_MAX_MOVEMENT_RADIUS/5; 
		blimp2MC.onEnterFrame = onTickToMoveLeft;
		
		//MANY TIMES PER SECOND, CALL SOME CODE ON EACH KEY OBJECT
		//	ADD JUST ONCE (IN CASE OF RESTARTING)
   		if (!stage.hasEventListener (sp.Event.ENTER_FRAME) ) {
			stage.addEventListener( sp.Event.ENTER_FRAME, function(event){
				
				if (!isGameOver && !isPaused) {
					
		        	biplane1MC.onEnterFrame();
		        	biplane2MC.onEnterFrame();
		        	blimp1MC.onEnterFrame();
		        	blimp2MC.onEnterFrame();
		        	
				}
	        	
			});
		}
	
	}

	
	//HANDLE ENEMY THAT MOVE LEFT
	function doStartGameplay () {	
		
		//TURN 'ON'
		isGameOver 	= false;
		isPaused	= false;
		
		//DEBUG
		setDebugText("<b>Debug:</b><BR>Game Started - FPS: " + stage.frameRate)

	}
	
		
	//OUTPUT A VICTORY MESSAGE AND 'STOP' THE GAME
	function doEndGameWithWin() {
		
		//MESSAGE
		addDebugText("You Won the Game!");
		
		//SET SCORE
		setScore (100);
		
		//PLAY SOUND
		playWinGameSound();
		
		//END GAME, STOP LISTENTING TO EVENTS
		doStopGame();
	
	}
	
	//OUTPUT A FAILURE MESSAGE AND 'STOP' THE GAME
	function doEndGameWithLoss() {
		
		//MESSAGE
		addDebugText("You Lost the Game!");
		
		//SET SCORE
		setScore (-100);
		
		//PLAY SOUND
		playLoseGameSound();
		
		//END GAME
		doStopGame();
	
	}

	//STOP THE GAME
	function doStopGame () {
		
		//END GAME
		isGameOver = true;
	}
	
	//DISPLAY THE SCORE
	function setScore (aScore_num) {
		
		score_textfield.htmlText = "Score: " + aScore_num;
	}

		
	//PLAY WHEN NEEDED
	function playWinGameSound () {
		SoundManager.playSoundEffect(FlyerGameSoundLoader.WIN_GAME_SOUND);
	}
	//PLAY WHEN NEEDED
	function playLoseGameSound () {
		SoundManager.playSoundEffect(FlyerGameSoundLoader.LOSE_GAME_SOUND);
	}
	//PLAY WHEN NEEDED
	function playMoveFlyerSound () {
		SoundManager.playSoundEffect(FlyerGameSoundLoader.MOVE_FLYER_SOUND);
	}


	//**************************************************
	//**************************************************
	//EVENTS
	//**************************************************
	//**************************************************
	//HANDLE ENEMY THAT MOVE LEFT
	function onTickToMoveLeft () {	
		
		//REFERENCE TO ENEMY
		var enemy = this;
		
		//MOVE THE ENEMY FORWARD
		enemy.x = enemy.x - enemy.speed;
		
		//RESET POSITION IF OFFSCREEN
		if (enemy.x < STAGE_X - enemy.width) {
			enemy.x = STAGE_X + STAGE_WIDTH + enemy.width;
		}
		
		//COLLISION DETECTION 'DID ENEMY HIT FLYER?'
		if (enemy.hitTestObject(flyerMC) && !isGameOver) {
			doEndGameWithLoss();
	    }
	}
	
	//HANDLE ENEMY THAT MOVE RIGHT
	function onTickToMoveRight () {
		
		//REFERENCE TO ENEMY
		var enemy = this;
		
		//MOVE THE ENEMY FORWARD
		enemy.x = enemy.x + enemy.speed;
		
		//RESET POSITION IF OFFSCREEN
		if (enemy.x > STAGE_X + STAGE_WIDTH + enemy.width) {
			enemy.x = STAGE_X - enemy.width;
		}
		
		//COLLISION DETECTION 'DID ENEMY HIT FLYER?'
		if (enemy.hitTestObject(flyerMC) && !isGameOver) {
			doEndGameWithLoss();
	    }
	}
	
	
	//KEYBOARD KEY PRflyerMCnction 
	function onKeyboardKeyDown (event) {
		
		if (!isGameOver && !isPaused) {
			switch( event.keyCode )	{
	          case sp.Keyboard.UP:
				flyerMC.y = flyerMC.y - FLYER_MOVEMENT_RADIUS;
				onFlyerMoved();
	            break;
	          case sp.Keyboard.DOWN:
				flyerMC.y = flyerMC.y + FLYER_MOVEMENT_RADIUS;
				onFlyerMoved();
	            break;
	          case sp.Keyboard.LEFT:
				flyerMC.x = flyerMC.x - FLYER_MOVEMENT_RADIUS;
				onFlyerMoved();
	            break;
	          case sp.Keyboard.RIGHT:
				flyerMC.x = flyerMC.x + FLYER_MOVEMENT_RADIUS;
				onFlyerMoved();
	            break;
	        }
       }
		
	
	}
		
	//FLYER HAS MOVED SO PLAY A SOUND AND CHECK FOR VICTORY
	function onFlyerMoved () {
		
		//PLAY SOUND
		playMoveFlyerSound();
		
		//WIN WHEN YOU REACH THE TOP
		if (flyerMC.y < STAGE_VICTORY_Y_POSITION && !isGameOver) {
			doEndGameWithWin();
		}
		
		//ANIMATE A LITTLE
		flyerMC.gotoAndStop(2);
	}

     function onKeyboardKeyUp (event){

		//ANIMATE A LITTLE
		flyerMC.gotoAndStop(1);
     }
      
	
	//************************************************************
	//************************************************************
	//CORE OUTTER FUNCTIONS 
	//************************************************************
	//************************************************************
	
	//JAVASCRIPT BUTTON - RESTART THE GAME
	function restartGameInner () {
		
		//TURN 'OFF' THE GAME (SOON TO BE TURNED BACK ON)
		isGameOver 	= true;
		isPaused	= true;
		
		//SETUP
    	doSetupStage();
		doSetupSprites();
		doApplyEffects();
		doSetupGameLoop();
		doStartGameplay();
		
	}
	
	        
}); //end require   
} //end main



//************************************************************
//************************************************************
//CORE OUTTER FUNCTIONS 
//************************************************************
//************************************************************
	
//THESE PROPERTIES/METHODS ARE DECLARED HERE, 'OUTSIDE' OF THE SpacePort.io framworks main() method above
//BECAUSE I WANT THE HTML BUTTONS (TO RIGHT OF GAME) TO BE ABLE TO EASILY ACCESS THESE METHODS
//PERHAPS THERE IS ANOTHER WAY TO DO THIS, BUT THIS WORKS, AND THAT IS FINE WITH ME.
var isPaused = false;
var isGameOver = false;
var gameSpecificRestartGame = null; //set by the game to allow js->Game communication

//JAVASCRIPT BUTTON - RESTART THE GAME
function restartGame () {
	
	gameSpecificRestartGame();
}

//JAVASCRIPT BUTTON - TOGGLE PAUSE
function togglePause () {
	
	//CHECK
	if (isPaused == true){
		isPaused = false;
	} else {
		isPaused = true;
	}
	
	//DEBUG
	addDebugText ("Paused : " +  isPaused); 
}
	
//JAVASCRIPT BUTTON - REPLACE DEBUG TEXT
function setDebugText (message_str) {
	/*
	 *	I AM NOT SURE HOW TO POSITION A CRAFTYJS GAME WITHIN A DIV
	 *	SO I LOAD AN IFRAME WITH THE GAME. IT WORKS FINE.
	 * 
	 *  THIS CODE SPEAKS 'BACK' TO THE OUTER HTML PAGE
	*/
	var debugTextElement = parent.document.getElementById("debugText_div");
	debugTextElement.innerHTML = message_str;
}

//JAVASCRIPT BUTTON - ADD TO DEBUG TEXT
function addDebugText (message_str) {
	/*
	 *	I AM NOT SURE HOW TO POSITION A CRAFTYJS GAME WITHIN A DIV
	 *	SO I LOAD AN IFRAME WITH THE GAME. IT WORKS FINE.
	 * 
	 *  THIS CODE SPEAKS 'BACK' TO THE OUTER HTML PAGE
	*/
	var debugTextElement = parent.document.getElementById("debugText_div");
	debugTextElement.innerHTML += "<BR>" + message_str;
}

    