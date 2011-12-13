
//CREATE REUSABLE VISUAL ASSET
Crafty.sprite(68, "./media/images/flyer.png", { FlyerSprite: [0, 0]});

//CREATE COMPONENT AND INCLUDE SUB-COMPONENTS FOR ALL NEEDS
Crafty.c("Flyer", {
    
	//CUSTOM NAME FOR ANIMATION
    PLAY_ONE_FRAME : "PLAY_ONE_FRAME",
    
    //INITIALIZE
    init: function() {
    	
    	//ADD ALL NEEDED COMPONENTS
        this.addComponent("2D, Canvas, Controls, Collision, FlyerSprite, SpriteAnimation");

		//SETUP ANIMATION - name, startX, startY, endX
		this.animate(this.PLAY_ONE_FRAME, 0, 0, 1);     

		//HIT DETECTION
		this.onHit("Enemy", function(e) {
			doEndGameWithLoss();
		});
	
		//HANDLE INPUT
		this.bind("KeyDown", function(e) {
			
			//FIND HOW TO CHECK IF WE ARE UNPAUSED
			if (true) {
				
				//TAKE KEYS
				if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
					this.x += FLYER_MOVEMENT_RADIUS;
					this.onFlyerMoved();
				} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
					this.x -= FLYER_MOVEMENT_RADIUS;
					this.onFlyerMoved();
				} else if(e.keyCode === Crafty.keys.UP_ARROW) {
					this.y -= FLYER_MOVEMENT_RADIUS;
					this.onFlyerMoved();
				} else if(e.keyCode === Crafty.keys.DOWN_ARROW) {
					this.y += FLYER_MOVEMENT_RADIUS;
					this.onFlyerMoved();
				}
			}
		});
				
   	},
    
    //EVERY MOVE CHECK FOR VICTORY
	onFlyerMoved: function() {
		
		//PLAY SOUND
		playMoveFlyerSound();
		
		//WIN WHEN YOU REACH THE TOP
		if (this.y < STAGE_VICTORY_Y_POSITION) {
			doEndGameWithWin();
		}
		
		//PLAY ANIMATION FOR DURATION OF '10'
		this.animate(this.PLAY_ONE_FRAME, 10);  
	}

});

