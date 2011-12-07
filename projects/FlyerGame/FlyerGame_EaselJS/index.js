//**************************************************
//EXTEND CLASSES AS NEEDED
//**************************************************

//Give custom collision detection abilities to core classes. 
//EaselJS supports no collision detection built-in.
//
//NOTES: The collision detection setup is inacurrate and error prone.
//
BitmapAnimation.prototype.hitTestObject = Bitmap.prototype.hitTestObject = function (hitter) {
    return SPRITE_HIT_DETECTION_RADIUS > Math.sqrt(Math.pow(Math.abs(this.x - hitter.x), 2) + 
    Math.pow(Math.abs(this.y - hitter.y), 2));
}


//**************************************************
//**************************************************
//PROPERTIES - Available inside & outside of functions
//**************************************************
//**************************************************

//DISPLAY
var canvas;
var stage;
var STAGE_X = 0;
var STAGE_Y = 0;
var STAGE_WIDTH = 800;
var STAGE_HEIGHT = 600;
var FRAMES_PER_SECOND = 60;
var MILLISECONDS_DELAY_BETWEEN_GAME_LOOP = 100;
var MILLISECONDS_DELAY_BEFORE_STOP_GAME = MILLISECONDS_DELAY_BETWEEN_GAME_LOOP + 1;
var STAGE_VICTORY_Y_POSITION = 30;
//
var STAGE_OFFSCREEN_RADIUS = 100;
var SPRITE_HIT_DETECTION_RADIUS = 60;
//
var FLYER_MOVEMENT_RADIUS = 30; 	//increase to move more per keypress
var ENEMY_MAX_MOVEMENT_RADIUS = 20; //increase to raise difficulty

//KEYS
var KEYCODE_UP 		= 38;		 
var KEYCODE_DOWN 	= 40; 
var KEYCODE_LEFT 	= 37; 
var KEYCODE_RIGHT 	= 39; 

//IMAGES, Load Externally
var imagesCurrentlyLoaded_num;
var IMAGES_TO_LOAD_NUM;
var background_image 	= new Image();
var blimp_image 		= new Image();
var biplane_image 		= new Image();
var flyer_image 		= new Image();

//BITMAPS, These act as the 'sprites' (We update x/y etc...) of the game
var background_bitmap;
var blimp1_bitmap;
var blimp2_bitmap;
var biplane1_bitmap;
var biplane2_bitmap;
var flyer_bitmapanimation;

//TEXT
var score_text;

//SOUNDS
var winGameSound 	= "winGameSound";
var loseGameSound 	= "loseGameSound";
var moveFlyerSound 	= "moveFlyerSound";

//LOADING
var areGraphicsLoaded;
var areSoundsLoaded;
var isGameOver;


//************************************************************
//************************************************************
//FLOW
//
//Upon refresh of the html page, the order of execution is
//
//	onBodyLoad () ->
//	doLoadAllAssets() -> 
//	doLoadAllSounds() -> 
//	onBackgroundImageLoad() -> 
//	onAllAssetsLoaded() -> 
//	doSetupStage() ->
//	doSetupSprites() -> 
//	doApplyEffects() -> 
//	doSetupGameLoop() -> 
//	doStartGameplay().... Then the user presses keys...
//
//************************************************************
//************************************************************


//************************************************************
//************************************************************
//FUNCTIONS 
//************************************************************
//************************************************************

//JAVASCRIPT BUTTON - RESTART THE GAME
function restartGame () {
	doLoadAllAssets();
}

//JAVASCRIPT BUTTON - TOGGLE PAUSE
function togglePause () {
	if (Ticker.getPaused() == true){
		Ticker.setPaused(false);
	} else {
		Ticker.setPaused(true);
	}
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

//LOAD ALL ASSETS
function doLoadAllAssets () {
	
	//RESET DEBUG
	setDebugText("<strong>Debug:</strong>");
	
	//RESET LOADING FLAGS
	areGraphicsLoaded 	= false;
	areSoundsLoaded 	= false;
	
	//RESET GAME WIN/LOSS FLAG
	isGameOver			= false;

	//LOAD SOUNDS
	doLoadAllSounds();
	
	//WAIT FOR THE 'LAST' LOADED AND 'LARGEST' IMAGE 
	background_image.onload = onBackgroundImageLoad;
	
	//LOAD IMAGES
	blimp_image.src 		= "./assets/images/blimp.png";
	biplane_image.src 		= "./assets/images/biplane.png";
	flyer_image.src 		= "./assets/images/flyer.png";
	background_image.src	= "./assets/images/background.png";
	
	//TRACK # LOADED
	imagesCurrentlyLoaded_num 	= 0;
	IMAGES_TO_LOAD_NUM 			= 4;
	
}

//DISPLAY THE SCORE
function setScore (aScore_num) {
	score_text.text = "Score: " + aScore_num;
}

//SETUP THE MOST BASIC ELEMENTS FOR VISUALS
function doSetupStage () {
	
	//EVENTS
	document.onkeydown = onKeyboardKeyDown;
	document.onkeyup = onKeyboardKeyUp;

	//LOCATE CANVAS &
	//CREATE NEW STAGE (TO DRAW SPRITES ON) WITHIN THE CANVAS (HTML DEFINED AREA)
	canvas 	= document.getElementById("main_canvas");
	
	//CLEAR STAGE UPON GAME RESET
	if (!stage) {
		stage = new Stage(canvas);
	} else {
		stage.removeAllChildren();
	}
	
	
}

//SETUP THE GRAPHICS AND ANIMATION
function doSetupSprites () {
	
	//BACKGROUND
	background_bitmap = new Bitmap (background_image);
	background_bitmap.x = background_bitmap.y = 0;
	stage.addChild(background_bitmap);	
		
	//BIPLANES
	biplane1_bitmap = new Bitmap (biplane_image);
	biplane1_bitmap.x = biplane1_bitmap.y = 120;
	stage.addChild(biplane1_bitmap);	
	biplane2_bitmap = new Bitmap (biplane_image);
	biplane2_bitmap.x = biplane2_bitmap.y = 330;
	stage.addChild(biplane2_bitmap);	
		
	//BLIMPS
	blimp1_bitmap = new Bitmap (blimp_image);
	blimp1_bitmap.x = blimp1_bitmap.y = 200;
	stage.addChild(blimp1_bitmap);	
	blimp2_bitmap = new Bitmap (blimp_image);
	blimp2_bitmap.x = blimp2_bitmap.y = 440;
	stage.addChild(blimp2_bitmap);	
		 
	//FLYER, GIVE 'fly' MANY FRAMES TO SLOW ITS ANIMATION
	var flyer_data = {
						images:[flyer_image], 
						frames:{width:68, height:80,regX:0, regY:0},
						animations: {
							fly: {
								frames: [1,1,1,1,1,0,0,0,0,0,0],
								next: "fly"
							},
							idle: {
								frames: [0]
							}
						}
					};

	
	//DRAW THE ONSCREEN ELEMENTS
	var flyer_spriteSheet  = new SpriteSheet(flyer_data);
	flyer_bitmapanimation = new BitmapAnimation(flyer_spriteSheet);
 	flyer_bitmapanimation.x = 220;
 	flyer_bitmapanimation.y = 520;
 	flyer_bitmapanimation.gotoAndStop("idle");
 	stage.addChild(flyer_bitmapanimation);
 	
	//TEXT
 	score_text = new Text("0", "bold 30px Arial", "#000000");
	score_text.textAlign = "left";
	score_text.x = 10;
	score_text.y = 50;
	stage.addChild(score_text)
	
	//INITIALLY START SCORE AT 0
	setScore (0);
		
}

//APPLY ANY OPTIONAL, VISUAL EFFECTS
function doApplyEffects () {
	
	var shadow = new Shadow ("#000000", 3, 3, 10);
	biplane1_bitmap.shadow 			= shadow;
	biplane2_bitmap.shadow 			= shadow;
	blimp1_bitmap.shadow 			= shadow;
	blimp2_bitmap.shadow 			= shadow;
	flyer_bitmapanimation.shadow 	= shadow;
}

//SET REPEATING CODE EXECUTION
function doSetupGameLoop () {
	
	//CONTROL ANIMATION - EACH 'LISTENER' 
	//(AND ITS CHILDREN) RECIEVE A 'tick' METHOD-CALL MANY TIMES PER SECOND
	Ticker.setPaused(false);
	Ticker.setFPS(FRAMES_PER_SECOND);
	Ticker.addListener(stage);

	//SET UNIQUE PROPERTIES OF THE SPRITES
	//EACH IS A CHILD OF THE STAGE AND RECIEVES THE 'TICK' CALL OFTEN
	biplane1_bitmap.speed = ENEMY_MAX_MOVEMENT_RADIUS/2.5;
	biplane1_bitmap.tick = onTickToMoveRight;
	
	biplane2_bitmap.speed = ENEMY_MAX_MOVEMENT_RADIUS/2; 
	biplane2_bitmap.tick = onTickToMoveRight;
	
	blimp1_bitmap.speed = ENEMY_MAX_MOVEMENT_RADIUS/3;
	blimp1_bitmap.tick = onTickToMoveLeft;
	
	blimp2_bitmap.speed = ENEMY_MAX_MOVEMENT_RADIUS/5; 
	blimp2_bitmap.tick = onTickToMoveLeft;

}

//MARKS THE GAME IS READY TO BE PLAYED
function doStartGameplay () {
	addDebugText ("Gameplay has started.")

}


//LOAD SOUNDS
function doLoadAllSounds (){
	
	SoundJS.onLoadQueueComplete = onLoadQueueComplete;
	var fileName1 = "./assets/sounds/WinGameSound" + getSoundExtensionForBrowser();
	var fileName2 = "./assets/sounds/LoseGameSound" + getSoundExtensionForBrowser();
	var fileName3 = "./assets/sounds/MoveFlyerSound" + getSoundExtensionForBrowser();
	SoundJS.add(winGameSound, fileName1 , 5);
	SoundJS.add(loseGameSound, fileName2 , 5);
	SoundJS.add(moveFlyerSound, fileName3 , 5);

}

//RETURN THE FILE-TIME THE BROWSER NEEDS TO SEE FOR MUSIC
function getSoundExtensionForBrowser () {
	
	//SOME BROWSERS LOAD ONLY PARTICULAR FILE TYPES
	var agent = navigator.userAgent.toLowerCase();
	var filetype;
	if(agent.indexOf("chrome") > -1){
		fileType = ".mp3";
	} else if(agent.indexOf("opera") > -1) {
		fileType = ".ogg";
	} else if(agent.indexOf("firefox") > -1) {
		fileType = ".ogg";
	} else if(agent.indexOf("safari") > -1) {
		fileType = ".mp3";
	} else if(agent.indexOf("msie") > -1) {
		fileType = ".mp3";
	}
	return fileType
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
	setInterval (onStopGame, MILLISECONDS_DELAY_BEFORE_STOP_GAME); 
	

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
	setInterval (onStopGame, MILLISECONDS_DELAY_BEFORE_STOP_GAME);

}

//PLAY WHEN NEEDED
function playWinGameSound () {
	SoundJS.play (winGameSound);
}
//PLAY WHEN NEEDED
function playLoseGameSound () {
	SoundJS.play (loseGameSound);
}
//PLAY WHEN NEEDED
function playMoveFlyerSound () {
	SoundJS.play (moveFlyerSound);
}


//**************************************************
//**************************************************
//EVENTS - REACT TO KEYS, MOUSE, AND OTHER THINGS
//**************************************************
//**************************************************

//KEYBOARD KEY PRESSED
function onKeyboardKeyDown(event) {
	
	//FIX CROSS-BROWSER ISSUE, IF EXISTS
	if(!event){ var event = window.event; }
	
	var y = event.keyCode;
	
	//REACT TO 4 ARROW KEYS
	if (event.keyCode == KEYCODE_UP) {
		flyer_bitmapanimation.y = flyer_bitmapanimation.y - FLYER_MOVEMENT_RADIUS;
		onFlyerMoved();
	} else if (event.keyCode == KEYCODE_DOWN) {
		flyer_bitmapanimation.y = flyer_bitmapanimation.y + FLYER_MOVEMENT_RADIUS;
		onFlyerMoved();
	} else if (event.keyCode == KEYCODE_LEFT) {
		flyer_bitmapanimation.x = flyer_bitmapanimation.x - FLYER_MOVEMENT_RADIUS;
		onFlyerMoved();
	} else if (event.keyCode == KEYCODE_RIGHT) {
		flyer_bitmapanimation.x = flyer_bitmapanimation.x + FLYER_MOVEMENT_RADIUS;
		onFlyerMoved();
	}

}

//FLYER HAS MOVED SO PLAY A SOUND AND CHECK FOR VICTORY
function onFlyerMoved () {
	
	//PLAY SOUND
	playMoveFlyerSound();
	
	//WIN WHEN YOU REACH THE Tflyer_bitmapanimationEEN
	if (flyer_bitmapanimation.y < STAGE_VICTORY_Y_POSITION && !isGameOver) {
		isGameOver = true;
		doEndGameWithWin();
	}
	
	//ANIMATE A LITTLE
	if (flyer_bitmapanimation.currentAnimation != "fly") {
		flyer_bitmapanimation.gotoAndPlay("fly");
	}
}

//KEYBOARD KEY RELEASED
function onKeyboardKeyUp (event) {
	
	//ANIMATE A LITTLE
	flyer_bitmapanimation.gotoAndStop("idle");
}

//When HTML's body is loaded
function onBodyLoad () {
	//
	doLoadAllAssets();
}

//WHEN THE LARGEST IMAGE IS LOADED
function onBackgroundImageLoad() {
	
	//CHECK THAT ALL IMAGES ARE LOADED
	if (areGraphicsLoaded == false) {
		areGraphicsLoaded = true;
		addDebugText ("areGraphicsLoaded=" + areGraphicsLoaded)
		onAllAssetsLoaded();
	}
	
	
}

//WHEN ALL SOUNDS ARE LOADED
function onLoadQueueComplete(){
	//
	if (areSoundsLoaded == false) {
		areSoundsLoaded = true;
		addDebugText ("areSoundsLoaded=" + areSoundsLoaded)
		onAllAssetsLoaded();
	}
}

//WHEN ALL GRAPHICS / SOUNDS ARE LOADED
function onAllAssetsLoaded(){
	//
	if (areGraphicsLoaded == true && 
		areSoundsLoaded == true			) {
		doSetupStage();
		doSetupSprites();
		doApplyEffects();
		doSetupGameLoop();
		doStartGameplay();
	}
}

//HANDLE ENEMY THAT MOVE LEFT
function onTickToMoveLeft (tickTime) {	
	
	//REFERENCE TO ENEMY
	var enemy = this;
	
	//MOVE THE ENEMY FORWARD
	enemy.x = enemy.x - enemy.speed;
	
	//RESET POSITION IF OFFSCREEN
	if (enemy.x < STAGE_X - STAGE_OFFSCREEN_RADIUS) {
		enemy.x = STAGE_X + STAGE_WIDTH + STAGE_OFFSCREEN_RADIUS;
	}
	
	//COLLISION DETECTION 'DID ENEMY HIT FLYER?'
	if (enemy.hitTestObject(flyer_bitmapanimation) && !isGameOver) {
		isGameOver = true;
		doEndGameWithLoss();
    }
}

//HANDLE ENEMY THAT MOVE RIGHT
function onTickToMoveRight (tickTime) {
	
	//REFERENCE TO ENEMY
	var enemy = this
	
	//MOVE THE ENEMY FORWARD
	enemy.x = enemy.x + enemy.speed;
	
	//RESET POSITION IF OFFSCREEN
	if (enemy.x > STAGE_X + STAGE_WIDTH + STAGE_OFFSCREEN_RADIUS) {
		enemy.x = STAGE_X - STAGE_OFFSCREEN_RADIUS;
	}
	
	//COLLISION DETECTION 'DID ENEMY HIT FLYER?'
	if (enemy.hitTestObject(flyer_bitmapanimation) && !isGameOver) {
		isGameOver = true;
		doEndGameWithLoss();
    }
}

//STOP THE GAME
function onStopGame () {
	//done on delay, so stage can redraw one last time before ending
	document.onkeydown = null;
	document.onkeyup   = null;
	Ticker.setPaused(true);
}
