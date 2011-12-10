ig.module(
	'game.entities.background'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBackground = ig.Entity.extend({
	
	size: {x:800, y:600},

	animSheet: new ig.AnimationSheet( 'media/background.png', 800, 600 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
	}
});

});