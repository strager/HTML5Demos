

//**************************************************
//ENEMY CLASS 
//**************************************************
var EnemyEntity = me.ObjectEntity.extend(
{	
	
	xSpeed : 0,
	xDirection : 0,
	
	//INIT
	init: function (x, y, imageName, newXSpeed, newXDirection)
	{
		// define this here instead of tiled
		settings = {};
		settings.image = imageName;
		
		//following is only useful when using a spritesheet
		settings.spritewidth = 0;
		settings.spriteheight = 0;
		
		//SUPER
		this.parent(x,y, settings);
		
		//
		this.xSpeed = newXSpeed;
		this.xDirection = newXDirection;

        // make it collidable
		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;

		//SET TICK CODE BASED ON DIRECTION OF TRAVEL
		if (this.xDirection > 0) {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionRight();}
		} else {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionLeft();}		
		}
			
	
	},
	
	// HANDLE COLLISION
	onCollision : function (res, obj)
	{
		addDebugText ("collision2");
	},

		
	// HANDLE EACH 'FRAME' OF GAMEPLAY
	update : function ()
	{
		
		//SET POSITION
		this.updateBasedOnDirection();
		
		//UPDATE
		this.parent();
		return;
		
	},
	
	updateBasedOnDirection : function () {
		//OVERWRITTEN BY INIT();
	},
	
	updateBasedOnDirectionRight : function () {
		
		//SET POSITION
		this.pos.x += this.xSpeed*this.xDirection;
		
		//CHECK BOUNDS
		if (this.pos.x > jsApp.STAGE_WIDTH) {
			this.pos.x = jsApp.STAGE_X;
		} 
		
	},
	
	updateBasedOnDirectionLeft : function () {
		
		//SET POSITION
		this.pos.x += this.xSpeed*this.xDirection;
		
		//CHECK BOUNDS
		if (this.pos.x < jsApp.STAGE_X) {
			this.pos.x = jsApp.STAGE_WIDTH;
		} 
		
	},

});


//**************************************************
//FLYER CLASS 
//**************************************************
var FlyerEntity = me.ObjectEntity.extend(
{	
	//INIT
	init: function (x, y)
	{
		// define this here instead of tiled
		settings = {};
		settings.image = "flyer";
		
		//following is only useful when using a spritesheet
		settings.spritewidth = 68;
		settings.spriteheight = 68;
		
		//SUPER
		this.parent(x,y, settings);
		
		// walking animatin
		this.addAnimation ("idle", [0]);
		this.addAnimation ("walk", [0,1]);
		this.setCurrentAnimation("idle");
		
        // make it collidable
		this.collidable = true;
		this.type = me.game.ACTION_OBJECT;
	
	},
	
	//UPON ANIMATION COMPLETE, GO BACK TO IDLE (NOT MOVING)
	onAnimationComplete : function ()
	{
		this.setCurrentAnimation("idle",  this.onAnimationComplete);
	},
	
	
	//HANDLE COLLISION
	onCollision : function (res, obj)
	{
		addDebugText ("collision");

	},

		
	// HANDLE EACH 'FRAME' OF GAMEPLAY
	update : function ()
	{
		//TAKE KEYS
		if (me.input.isKeyPressed('left')) {
     		this.moveOnce(-jsApp.FLYER_MOVEMENT_RADIUS, 0);
  		} else if (me.input.isKeyPressed('right')) {
     		this.moveOnce(jsApp.FLYER_MOVEMENT_RADIUS, 0);
  		}
  		
		if (me.input.isKeyPressed('up')) {
     		this.moveOnce(0,-jsApp.FLYER_MOVEMENT_RADIUS);
  		} else if (me.input.isKeyPressed('down')) {
     		this.moveOnce(0, jsApp.FLYER_MOVEMENT_RADIUS);
  		}
        
        // UPDATE
		this.parent();
        
        return true;
	},
	
	//MOVE ONE TIME THEN RESET
	moveOnce : function (x, y)
	{
	  
        // MOVE
        this.pos.x += x;
        this.pos.y += y;
        
        // FACE 'FORWARD'
        if (x > 0) {
        	this.flipX(false);
        } else {
        	this.flipX(true);
        }
        if (y > 0) {
        	this.flipY(true);
        } else {
        	this.flipY(false);
        }
        
        //UPDATE
        this.onFlyerMoved();
        
	}, 
   
	//FLYER HAS MOVED SO PLAY A SOUND AND CHECK FOR VICTORY
	onFlyerMoved : function () {
		
		//WIN WHEN YOU REACH THE TOP
		if (this.pos.y < jsApp.STAGE_VICTORY_Y_POSITION) {
			//
			me.state.current().doEndGameWithWin();
			
		//OTHERWISE JUST 'MOVE'
		} else {
			
			//PLAY SOUND
	        me.state.current().playMoveFlyerSound();
	        
	        //PLAY ANIMATION ONCE
	        this.setCurrentAnimation("walk",  this.onAnimationComplete);
			
		}
	
	}

});




//**************************************************
//ENEMY CLASS 
//**************************************************
var ScoreObject = me.HUD_Item.extend({	

	init: function(x, y) {
		
         // SUPER
		this.parent(x, y);
		
		//	SET FONT
		this.font = new me.BitmapFont("32x32_font", 32);
	},

	//UPDATE
	draw : function (context, x, y)
	{
		//REDRAW
		this.font.draw (context, this.value, this.pos.x +x, this.pos.y+y);
	}

});


