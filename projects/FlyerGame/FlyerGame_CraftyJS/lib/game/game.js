
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
var FLYER_MOVEMENT_RADIUS = 30; 	//increase to move more per keypress
var STAGE_VICTORY_Y_POSITION = 30;
var ENEMY_MAX_MOVEMENT_RADIUS = 15; //increase to raise difficulty

//BACKGROUND - save reference so we can call its '.setScore(200)' method
var background = {};

//TEXT
var scoreText = "";

//CREATE LOADING SCENE
Crafty.scene("LoadingScene", function() {
	
	//SEEMS THAT *.ogg files cannot be loaded
    Crafty.load([	
    				"./media/fonts/OSDM_Fnt32x32_SyntaxTerror-Copy2.png",
	   				"./media/sounds/LoseGameSound.mp3",
					"./media/sounds/MoveFlyerSound.mp3",
					"./media/sounds/WinGameSound.mp3", 
    				"./media/images/flyer.png",
    				"./media/images/background.png",
    				"./media/images/blimp.png",
    				"./media/images/biplane.png"
    				], function() {
    					
    	//UPON LOAD COMPLETION, GO TO GAME SCENE
        Crafty.scene("GameScene");
    });
});

//CREATE GAME SCENE
Crafty.scene("GameScene", function() {
	setDebugText("0");
	//CALL SETUP
	doSetup();
});

//************************************************************
//************************************************************
//FLOW
//
//Upon refresh of the html page, the order of execution is
//
//  restartGame() ->
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


//SETUP
function doSetup () {
	this.doSetupStage();
	this.doSetupSprites();
	this.doApplyEffects();
	this.doSetupGameLoop();
	this.doStartGameplay();
}

//SETUP STAGE
function doSetupStage () {
	
	//SETUP AUDIO
	Crafty.audio.add({
	    "loseGameSound": ["./media/sounds/LoseGameSound.mp3", "./media/sounds/LoseGameSound.ogg"]
	});
	Crafty.audio.add({
	    "winGameSound": ["./media/sounds/WinGameSound.mp3", "./media/sounds/WinGameSound.ogg"]
	});
	Crafty.audio.add({
	    "moveFlyerSound": ["./media/sounds/MoveFlyerSound.mp3", "./media/sounds/MoveFlyerSound.ogg"]
	});
	
}

//SETUP SPRITES
function doSetupSprites () {
	
    //BACKGROUND
    background = Crafty.e("Background");
	
	//BIPLANES
    Crafty.e("Enemy").attr({x: 120, y: 120}).addComponent("BiplaneSprite").setSpeed(ENEMY_MAX_MOVEMENT_RADIUS/3);
    Crafty.e("Enemy").attr({x: 330, y: 330}).addComponent("BiplaneSprite").setSpeed(ENEMY_MAX_MOVEMENT_RADIUS/3);
		
	//BLIMPS
    Crafty.e("Enemy").attr({x: 220, y: 200}).addComponent("BlimpSprite").setSpeed(-ENEMY_MAX_MOVEMENT_RADIUS/3);
	Crafty.e("Enemy").attr({x: 440, y: 440}).addComponent("BlimpSprite").setSpeed(-ENEMY_MAX_MOVEMENT_RADIUS/2);
	
	//FLYER
    Crafty.e("Flyer").attr({x: 220, y: 520});
    
    
	//SCORE
	background.setScore (0);
}

//SETUP EFFECTS
function doApplyEffects () {
	//NOTHING NEEDED
	
}

//SETUP GAME LOOP
function doSetupGameLoop () {
	//NOTHING NEEDED

}

//SETUP STAGE
function doStartGameplay () {
	
	//RESET DEBUG
	setDebugText("<strong>Debug:</strong>");
}



//OUTPUT A VICTORY MESSAGE AND 'STOP' THE GAME
function doEndGameWithWin () {
	
	//MESSAGE
	addDebugText("You Won the Game!");
	
	//SET SCORE
	background.setScore (100);
	
	//PLAY SOUND
	playWinGameSound();
	
	//END GAME, STOP LISTENTING TO EVENTS
	onStopGame();
	
}

//OUTPUT A FAILURE MESSAGE AND 'STOP' THE GAME
function doEndGameWithLoss () {
	
	//MESSAGE
	addDebugText("You Lost the Game!");
	
	//SET SCORE
	background.setScore (-100);
	
	//PLAY SOUND
	playLoseGameSound();
	
	//END GAME
	onStopGame();

}

//STOP THE GAME
function onStopGame () {
	Crafty.pause();
}


//PLAY WHEN NEEDED
function playWinGameSound () {
	Crafty.audio.play ("winGameSound");
}

//PLAY WHEN NEEDED
function playLoseGameSound () {
	Crafty.audio.play ("loseGameSound");
}

//PLAY WHEN NEEDED
function playMoveFlyerSound () {
	Crafty.audio.play ("moveFlyerSound");
}


//************************************************************
//************************************************************
//FUNCTIONS 
//************************************************************
//************************************************************

//JAVASCRIPT BUTTON - RESTART THE GAME
function restartGame () {
	
	//IF RE-STARTING, THEN PAUSE BEFORE REBUILDING. 
	//	THIS CLEANLY REBUILDS THE WORLD
	Crafty.init(STAGE_WIDTH, STAGE_HEIGHT, FRAMES_PER_SECOND);
    Crafty.scene("LoadingScene");
    
}

//JAVASCRIPT BUTTON - TOGGLE PAUSE
function togglePause () {
	//CHECK
	if (Crafty._paused == true){
		Crafty.pause();
	} else {
		Crafty.pause();
	}
	//DEBUG
	addDebugText ("Paused:" + Crafty._paused);
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
