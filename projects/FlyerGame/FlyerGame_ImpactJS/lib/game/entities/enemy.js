ig.module(
	'game.entities.enemy'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityEnemy = ig.Entity.extend({
	
	size: {x:41, y:36},
	speed: 10,
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/biplane.png', 41, 36 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.maxVel.x = this.maxVel.y = 300;
		this.addAnim( 'idle', 1, [0] );
		this.vel.x = this.speed;
		
		//SET TICK CODE BASED ON DIRECTION OF TRAVEL
		if (this.vel.x > 0) {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionRight();}
		} else {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionLeft();}		
		}
	},
	
	updateBasedOnDirection : function () {
		
	},
	
	update : function () {
		
		//SET POSITION
		this.updateBasedOnDirection();
				
		//USE POSITION
		this.parent();
		
		//COLLISION DETECTION 'DID ENEMY HIT FLYER?'
		if (true){
			ig.game.doEndGameWithLoss();
		}
	},
	
	updateBasedOnDirectionRight : function () {
		
		//SET POSITION
		if (this.pos.x - this.size.x > ig.system.width) {
			this.pos.x = -this.size.x;
		} 

		
	},
	
	updateBasedOnDirectionLeft: function () {
		
		//SET POSITION
		if (this.pos.x + this.size.x < 0) {
			this.pos.x = ig.system.width;
		}
		
	}
	
	/*
 * 

	//COLLISION DETECTION 'DID ENEMY HIT FLYER?'
	if (enemy.hitTestObject(flyer_bitmapanimation) && !isGameOver) {
		isGameOver = true;
		doEndGameWithLoss();
    }
 */
});

});