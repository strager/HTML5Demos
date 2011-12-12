
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
var ENEMY_MAX_MOVEMENT_RADIUS = 30; //increase to raise difficulty

//BACKGROUND - save reference to call its '.setScore(200)' method
var background = {};

//TEXT
var scoreText = "";


/*

 */
Crafty.scene("Game", function() {
	
	//adding audio from an object
	Crafty.audio.add({
	    "loseGameSound": ["./media/sounds/LoseGameSound.mp3", "./media/sounds/LoseGameSound.ogg"]
	});
	Crafty.audio.add({
	    "winGameSound": ["./media/sounds/WinGameSound.mp3", "./media/sounds/WinGameSound.ogg"]
	});
	Crafty.audio.add({
	    "moveFlyerSound": ["./media/sounds/MoveFlyerSound.mp3", "./media/sounds/MoveFlyerSound.ogg"]
	});
	
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
	
});

// Load assets, then start Game
Crafty.scene("Loading", function() {
	
	//SEEMS THAT *.ogg files cannot be loaded
    Crafty.load([	"./img/crate.png", 
    				"./img/OSDM_Fnt32x32_SyntaxTerror-Copy2.png",
	   				"./media/sounds/LoseGameSound.mp3",
					"./media/sounds/MoveFlyerSound.mp3",
					"./media/sounds/WinGameSound.mp3", 
    				"./media/images/flyer.png",
    				"./media/images/background.png",
    				"./media/images/blimp.png",
    				"./media/images/biplane.png"
    				], function() {
        Crafty.scene("Game");
    });
});





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
    Crafty.scene("Loading");
    
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
	var debugTextElement = document.getElementById("debugText_div");
	debugTextElement.innerHTML = message_str;
}
//JAVASCRIPT BUTTON - ADD TO DEBUG TEXT
function addDebugText (message_str) {
	var debugTextElement = document.getElementById("debugText_div");
	debugTextElement.innerHTML += "<BR>" + message_str;
}
