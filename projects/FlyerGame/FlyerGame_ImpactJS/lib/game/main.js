//**************************************************
//DECLARE THIS PAGE AS A MODULE
//**************************************************
ig.module( 
	'game.main' 
)

//**************************************************
//IMPORT CLASSES FROM EXTERNAL 
//	FILES (LOADED BY index.html)
//**************************************************
.requires(
	'impact.game',
	'impact.font',
	'game.entities.background',
	'game.entities.blimp',
	'game.entities.biplane',
	'game.entities.flyer'
	
)

//**************************************************
//DEFINE CONTENT OF THIS PAGE
//**************************************************
.defines(function (){

//**************************************************
//DELARE CORE GAME CLASS
//**************************************************
MyGame = ig.Game.extend({
	
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
	FLYER_MOVEMENT_RADIUS : 30, 		//increase to move more per keypress
	STAGE_VICTORY_Y_POSITION : 30,
	ENEMY_MAX_MOVEMENT_RADIUS : 300, //increase to raise difficulty
	
	//TEXT
	scoreText : "",
	
	//SOUNDS
	winGame_sound :		new ig.Sound( './media/sounds/WinGameSound.*', false ),
	loseGame_sound :	new ig.Sound( './media/sounds/LoseGameSound.*', false ),
	moveFlyer_sound :	new ig.Sound( './media/sounds/MoveFlyerSound.*', false ),
	
	//FONTS
	font : new ig.Font( './media/fonts/arial30.png' ),
	
	//************************************************************
	//************************************************************
	//FLOW
	//
	//Upon refresh of the html page, the order of execution is
	//
	//	ig.main() ->
	//  MyGame.init() ->
	//	this.doSetup() ->
	//	this.doSetupStage();
	//	this.doSetupSprites();
	//	this.doApplyEffects();
	//	this.doSetupGameLoop();
	//	this.doStartGameplay();
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
	init : function () {
		
		// SETUP KEYS
		ig.input.bind(ig.KEY.LEFT_ARROW, 	"left");
		ig.input.bind(ig.KEY.RIGHT_ARROW, 	"right");
		ig.input.bind(ig.KEY.UP_ARROW, 		"up");
		ig.input.bind(ig.KEY.DOWN_ARROW, 	"down");
		
 		//SETUP
        this.doSetup();
	},
	
	//SETUP
	doSetup : function () {
		this.doSetupStage();
		this.doSetupSprites();
		this.doApplyEffects();
		this.doSetupGameLoop();
		this.doStartGameplay();
	},

	//SETUP STAGE
	doSetupStage : function () {
				
		//SCORE
		this.setScore (100);
	},
	
	//SETUP SPRITES
	doSetupSprites : function () {
		
		//REMOVE ANY EXISTING ENTITIES (IF RE-STARTING)
		ig.system.stopRunLoop();
		var i = 0;
		var entities = ig.game.entities
	    while (i < entities.length) {
	        ig.game.entities[i].kill();
	        ++i;
	    }
		
		//BACKGROUND - Properties in the settings object overwrite base entity properties
		var entityBackgroundSettings 	= {};
		this.spawnEntity (EntityBackground, 0, 0);
		
		//BIPLANES
		var entityBiplaneSettings1 	= {speed: this.ENEMY_MAX_MOVEMENT_RADIUS};
		var entityBiplane1 			= this.spawnEntity (EntityBiplane, 120, 120, entityBiplaneSettings1);
		var entityBiplaneSettings2 	= {speed: this.ENEMY_MAX_MOVEMENT_RADIUS/2};
		var entityBiplane2 			= this.spawnEntity (EntityBiplane, 330, 330, entityBiplaneSettings2);
			
		//BLIMPS
		var entityBlimpSettings1 	= {speed: -this.ENEMY_MAX_MOVEMENT_RADIUS};
		var entityBlimp1 			= this.spawnEntity (EntityBlimp, 200, 200, entityBlimpSettings1);
		var entityBlimpSettings2 	= {speed: -this.ENEMY_MAX_MOVEMENT_RADIUS/3};
		var entityBlimp2			= this.spawnEntity (EntityBlimp, 440, 440, entityBlimpSettings2);
		
		//DRAW THE ONSCREEN ELEMENTS
		var entityFlyerSettings 	= {};
		this.spawnEntity (EntityFlyer, 220, 520, entityFlyerSettings);


	},
	
	//SETUP EFFECTS
	doApplyEffects : function () {
		
		//NOTHING NEEDED
	},
	
	//SETUP GAME LOOP
	doSetupGameLoop : function () {
		
		//NOTHING NEEDED
		ig.system.startRunLoop();
	},
	
	//SETUP STAGE
	doStartGameplay : function () {
		
		//RESET DEBUG
		setDebugText("<strong>Debug:</strong> v" + ig.version);
	},
	
	update : function () {
		// Update all entities and backgroundMaps
		this.parent();

	},
	
	draw : function () {
		
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Add your own drawing code here
		this.font.draw( this.scoreText, 20, 30, ig.Font.ALIGN.LEFT );
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
		//done on delay, so stage can redraw one last time before ending
		//document.onkeydown = null;
		//document.onkeyup   = null;
		ig.system.stopRunLoop();
		
	},


	//PLAY WHEN NEEDED
	playWinGameSound : function () {
		this.winGame_sound.play();
	},
	
	//PLAY WHEN NEEDED
	playLoseGameSound : function () {
		this.loseGame_sound.play();

	},

	//PLAY WHEN NEEDED
	playMoveFlyerSound : function () {
		this.moveFlyer_sound.play();

	}


});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
restartGame();

});


//************************************************************
//************************************************************
//FUNCTIONS 
//************************************************************
//************************************************************

//JAVASCRIPT BUTTON - RESTART THE GAME
function restartGame () {
	
	//IF RE-STARTING, THEN PAUSE BEFORE REBUILDING. 
	//	THIS CLEANLY REBUILDS THE WORLD
	if (ig.system) {
		ig.system.stopRunLoop();	
	}
	ig.main( '#main_canvas', MyGame, 60, 800, 600, 1 );
}

//JAVASCRIPT BUTTON - TOGGLE PAUSE
function togglePause () {
	//CHECK
	if (ig.system.running == true){
		ig.system.stopRunLoop();
	} else {
		ig.system.startRunLoop();
	}
	//DEBUG
	addDebugText ("Paused:" + ig.system.running);
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

