
//**************************************************
//DELARE SCREEN #2 OF 2 : PLAY
//**************************************************
var PlayScreen = me.ScreenObject.extend(
{
	
	scoreObject: null,
	
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
		
      	// reset the game manager
		me.game.reset();
      
		// add a default HUD to the game mngr
		me.game.addHUD(jsApp.STAGE_X, jsApp.STAGE_Y, jsApp.STAGE_WIDTH,  jsApp.STAGE_HEIGHT);
		
		// add a new HUD item
		this.scoreObject = new ScoreObject(795, 2); 
		me.game.HUD.addItem("score", this.scoreObject);
		this.setScore (0);
      
	},
	
	doSetupSprites: function()
	{
		
		// BACKGROUND
		this.background_spriteobject = new SpriteObject (jsApp.STAGE_X, jsApp.STAGE_Y, me.loader.getImage("background"));
		me.game.add (this.background_spriteobject, 1);
		
		//	BIPLANE 
		var biplane1_enemyentity = new EnemyEntity(120, 120, "biplane", jsApp.ENEMY_MAX_MOVEMENT_RADIUS/2, -1);
        me.game.add(biplane1_enemyentity, 2);
		var biplane2_enemyentity = new EnemyEntity(330, 330, "biplane", jsApp.ENEMY_MAX_MOVEMENT_RADIUS/3, 1);
        me.game.add(biplane2_enemyentity, 3);
		
		//	BLIMPS 
		var blimp1_enemyentity = new EnemyEntity(200, 200, "blimp", jsApp.ENEMY_MAX_MOVEMENT_RADIUS/2, 1);
        me.game.add(blimp1_enemyentity, 4);
		var blimp2_enemyentity = new EnemyEntity(440, 440, "blimp", jsApp.ENEMY_MAX_MOVEMENT_RADIUS/3, -1);
        me.game.add(blimp2_enemyentity, 5);
		
		//	BLIMPS 
		var flyer_enemyentity = new FlyerEntity(220, 520);
        me.game.add(flyer_enemyentity, 6);
        
		// make sure everyhting is in the right order
		me.game.sort();
			
	},
	
	doApplyEffects: function()
	{
		//NOTHING NEEDED
	},
	
	doSetupGameLoop: function()
	{
		//NOTHING NEEDED
	},
	
	doStartGameplay: function()
	{
		//RESET DEBUG
		setDebugText("<strong>Debug:</strong> FPS : " + me.sys.fps);
	},
	
	
	//UPDATE THE SCORE IN THE HUD
	setScore: function (score_num) {
		me.game.HUD.updateItemValue("score", score_num);
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
		me.audio.playTrack(jsApp.WIN_GAME_SOUND)
	},
	
	//PLAY WHEN NEEDED
	playLoseGameSound : function () {
		me.audio.playTrack(jsApp.LOSE_GAME_SOUND);
	},

	//PLAY WHEN NEEDED
	playMoveFlyerSound : function () {
		me.audio.playTrack(jsApp.MOVE_FLYER_SOUND);
	},
	
	//CLEAN-UP
	onDestroyEvent: function()
	{  
      // remove the HUD
      me.game.disableHUD();
      
      // stop the current audio track
      me.audio.stopTrack();
   }

});

