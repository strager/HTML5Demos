
/**

 */
Crafty.sprite(68, "./media/images/flyer.png", { FlyerSprite: [0, 0]});
//
Crafty.c("Flyer", {
    /**
     * Initialisation. Adds components, sets positions, binds mouse click handler
     */
    init: function() {
    	
        this.addComponent("2D, Canvas, Controls, Collision, FlyerSprite, Animate");

		this.onHit("Enemy", function(e) {
			doEndGameWithLoss();
		});
	
		this.bind("KeyDown", function(e) {
			//on keydown, set the move bo = ns
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
		});
				
   },
    
    onFlyerMoved: function() {
		
		//PLAY SOUND
		playMoveFlyerSound();
		
		//WIN WHEN YOU REACH THE T
		if (this.y < STAGE_VICTORY_Y_POSITION) {
			doEndGameWithWin();
		}
		
		//ANIMATE A LITTLE
		//this.animate ("idle", 10); how?
	}

});

