/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
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


var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
      //me.debug.renderHitBox = true;
      
      // init the video
		if (!me.video.init('main_canvas', 800, 600))
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

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{
	
    // constructor
    init: function() {
        this.parent(true);
    },


   onResetEvent: function()
	{
		
		if (this.title == null){
			this.title = me.loader.getImage("background");

			// add our player entity in the entity pool
			me.entityPool.add("blimpEntity", BlimpEntity);
		
			var background_spriteobject = new SpriteObject (0, 0, me.loader.getImage("background"));
			me.game.add (background_spriteobject);
		
			//new ObjectSettings();
			var b = new BlimpEntity (10, 10, null);
			//me.game.add (background2_spriteobject);
			//me.game.addEntity (BlimpEntity);
			
			//var y = me.entityPool.add("blimpEntity", BlimpEntity);
			//me.game.addEntity ( new BlimpEntity() );
			
		}
			
				
      // load a level
		//me.levelDirector.loadLevel("area01");
      
      // add a default HUD to the game mngr
		me.game.addHUD(0,430,640,60);
		
		// add a new HUD item 
		me.game.HUD.addItem("score", new ScoreObject(620,10));
		me.game.HUD.updateItemValue("score", 9707);
		
		// make sure everyhting is in the right order
		me.game.sort();
      
      	// play the audio track
      	me.audio.playTrack("LoseGameSound"); 
      	
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


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});



	/************************************************************************************/
	/*																												*/
	/*		an enemy Entity																					*/
	/*																												*/
	/************************************************************************************/
	var BlimpEntity = me.ObjectEntity.extend(
	{	
		init: function (x, y, settings)
		{
			// define this here instead of tiled
			//settings.image = "blimp";
			//settings.spritewidth = 64;
			
			// call the parent constructor
			//this.parent(x, y , settings);
			
			/*
			this.startX = x;
			this.endX   = x+settings.width - settings.spritewidth; // size of sprite
			
			
			// make him start from the right
			this.pos.x = x + settings.width - settings.spritewidth;
			this.walkLeft = true;

         // walking & jumping speed
			this.setVelocity(4, 6);
			
         // make it collidable
			this.collidable = true;
			this.type = me.game.ENEMY_OBJECT;
			
			// bounding box
			this.updateColRect(4,56,8,56);
			*/
		},
		
			
		onCollision : function (res, obj)
		{

		},

		
		// manage the enemy movement
		update : function ()
		{
			return true;
		}
	});
	
	
	/************************************************************************************/
	/*																												*/
	/*		an enemy Entity																					*/
	/*																												*/
	/************************************************************************************/
	var CoolerBlimpEntity = me.ObjectEntity.extend(
	{	
		init: function (x, y, settings)
		{
			// define this here instead of tiled
			settings.image = "blimp";
			settings.spritewidth = 64;
			
			// call the parent constructor
			this.parent(x, y , settings);
			
			this.startX = x;
			this.endX   = x+settings.width - settings.spritewidth; // size of sprite
			
			
			// make him start from the right
			this.pos.x = x + settings.width - settings.spritewidth;
			this.walkLeft = true;

         // walking & jumping speed
			this.setVelocity(4, 6);
			
         // make it collidable
			this.collidable = true;
			this.type = me.game.ENEMY_OBJECT;
			
			// bounding box
			this.updateColRect(4,56,8,56);
			
		},
		
			
		onCollision : function (res, obj)
		{
				
			// res.y >0 means touched by something on the bottom
			// which mean at top position for this one
			if (this.alive && (res.y > 0) && obj.falling)
			{
				// make it flicker
				this.flicker(45);
			}
		},

		
		// manage the enemy movement
		update : function ()
		{
			// do nothing if not visible
			if (!this.visible && !this.flickering)
				return false;
				
			if (this.alive)
			{
				if (this.walkLeft && this.pos.x <= this.startX)
				{
					this.walkLeft = false;
				}
				else if (!this.walkLeft && this.pos.x >= this.endX)
				{
					this.walkLeft = true;
				}
            this.doWalk(this.walkLeft);
			}
			else
			{
				this.vel.x = 0;
			}
			// check & update movement
			updated = this.updateMovement();
				
			if (updated)
			{
				// update the object animation
				this.parent();
			}
			return updated;
		}
	});
	
