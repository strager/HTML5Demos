ig.module(
	'game.entities.flyer'
)
.requires(
	'impact.entity',
	'game.entities.enemy'
)
.defines(function(){

EntityFlyer = ig.Entity.extend({
	
	size: {x:68, y:80},
	
	//COLLISION DATA
	type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED, //ACTUALLY BOUNCE OFF EACH OTHER
	
	animSheet: new ig.AnimationSheet( './media/images/flyer.png', 68, 80 ),
	
	init: function( x, y, settings ) {
		
		//SUPER
		this.parent( x, y, settings );
		
		//CREATE ANIMATION
		this.addAnim( 'fly', 	.1, 	[1,0]);
		this.addAnim( 'idle', 	.1, 	[0] );
		
		//SET CURRENT ANIMATION
		this.currentAnim = this.anims.idle;
	},
	
	onFlyerMoved: function() {
		
		//PLAY SOUND
		ig.game.playMoveFlyerSound();
		
		//WIN WHEN YOU REACH THE T
		if (this.pos.y < ig.game.STAGE_VICTORY_Y_POSITION) {
			ig.game.doEndGameWithWin();
		}
		
		//ANIMATE A LITTLE
		if (this.currentAnim == this.anims.fly) {
			this.currentAnim = this.anims.idle;
		} else {
			this.currentAnim = this.anims.fly;
		}
		this.currentAnim.rewind();
		this.currentAnim.update();
	},
	
	check: function( other ) {

		if (other instanceof EntityEnemy) {
			ig.game.doEndGameWithLoss();
		}		
	},
		
	update: function() {
		
		//TAKE KEYS
		
		//REACT TO 4 ARROW KEYS
		//	You can bind keys to specific actions and then ask if one of these actions is 
		//	currently held down (.state("up")) or was just pressed down after the last frame (.pressed("up")).
		if (ig.input.pressed("up")) {
			this.pos.y = this.pos.y - ig.game.FLYER_MOVEMENT_RADIUS;
			this.onFlyerMoved();
		} else if (ig.input.pressed("down")) {
			this.pos.y = this.pos.y + ig.game.FLYER_MOVEMENT_RADIUS;
			this.onFlyerMoved();
		} else if (ig.input.pressed("left")) {
			this.pos.x = this.pos.x - ig.game.FLYER_MOVEMENT_RADIUS;
			this.onFlyerMoved();
		} else if (ig.input.pressed("right")) {
			this.pos.x = this.pos.x + ig.game.FLYER_MOVEMENT_RADIUS;
			this.onFlyerMoved();
		} 
	
		// Update all entities and backgroundMaps
		this.parent();

		 
	}
	
	
	 		      
      	 

});

});