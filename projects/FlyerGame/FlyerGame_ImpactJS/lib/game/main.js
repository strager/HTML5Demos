ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.background',
	'game.entities.blimp',
	'game.entities.biplane',
	'game.entities.flyer'
	
)
.defines(function(){

MyGame = ig.Game.extend({
	
	//CONST
	ENEMY_MAX_MOVEMENT_RADIUS : 3000,
	
	// Load a font
	scoreText : "",
	font: new ig.Font( 'media/arial30.png' ),
	bgtune: new ig.Sound( 'media/gameover.*', false ),
	
	init: function() {
		
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY.LEFT_ARROW, 	"left");
		ig.input.bind(ig.KEY.RIGHT_ARROW, 	"right");
		ig.input.bind(ig.KEY.UP_ARROW, 		"up");
		ig.input.bind(ig.KEY.DOWN_ARROW, 	"down");
		
		 // Now add the file to the playlist
        ig.music.add( this.bgtune );
        
        // You could also just specify the path again:
        // ig.music.add( 'media/background-tune.*' );
        
        // Ready to Rock!
        //ig.music.play()
 
        this.doSetup();
	},
	
	doSetup : function () {
		
		//BACKGROUND
		this.spawnEntity (EntityBackground, 0, 0);
		
		//BIPLANES
		var entityBiplaneSettings1 	= {speed: this.ENEMY_MAX_MOVEMENT_RADIUS};
		var entityBiplane1 			= this.spawnEntity (EntityBiplane, 120, 120, entityBiplaneSettings1);
		var entityBiplaneSettings2 	= {speed: this.ENEMY_MAX_MOVEMENT_RADIUS/2};
		var entityBiplane2 			= this.spawnEntity (EntityBiplane, 330, 330, entityBiplaneSettings2);
			
		//BLIMPS
		var entityBlimpSettings1 	= {speed: -this.ENEMY_MAX_MOVEMENT_RADIUS};
		var entityBlimp1 = this.spawnEntity (EntityBlimp, 200, 200, entityBlimpSettings1);
		var entityBlimpSettings2 	= {speed: -this.ENEMY_MAX_MOVEMENT_RADIUS/3};
		var entityBlimp2 = this.spawnEntity (EntityBlimp, 440, 440, entityBlimpSettings2);
		
		//DRAW THE ONSCREEN ELEMENTS
		var entityFlyerSettings 	= {};
		this.spawnEntity (EntityFlyer, 220, 520, entityFlyerSettings);
		
		//SCORE
		this.setScore (100);

	},
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
 		      
      	 
		if (ig.input.state("right")) {
		    alert ("right");  
		};
		 
	},
	
	draw: function() {
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
		//addDebugText("You Won the Game!");
		
		//SET SCORE
		this.setScore (100);
		
		//PLAY SOUND
		//playWinGameSound();
		
		//END GAME, STOP LISTENTING TO EVENTS
		//setInterval (onStopGame, MILLISECONDS_DELAY_BEFORE_STOP_GAME); 
		
	
	},
	
	//OUTPUT A FAILURE MESSAGE AND 'STOP' THE GAME
	doEndGameWithLoss: function () {
		
		//MESSAGE
		//addDebugText("You Lost the Game!");
		
		//SET SCORE
		this.setScore (-100);
		
		//PLAY SOUND
		//playLoseGameSound();
		
		//END GAME
		//setInterval (onStopGame, MILLISECONDS_DELAY_BEFORE_STOP_GAME);
	
	},
	
		//STOP THE GAME
	onStopGame: function () {
		//done on delay, so stage can redraw one last time before ending
		//document.onkeydown = null;
		//document.onkeyup   = null;
		//Ticker.setPaused(true);
	}



});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 800	, 600, 1 );

});
