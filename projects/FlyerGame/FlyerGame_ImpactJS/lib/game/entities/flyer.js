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
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/flyer.png', 68, 80 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		//this.addAnim( 'fly', 1, [0,0,0,0,1,1,1] );
		this.addAnim( 'idle', 1, [0] );
	}
});

});