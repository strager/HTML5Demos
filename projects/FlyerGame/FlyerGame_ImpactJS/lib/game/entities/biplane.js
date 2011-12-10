ig.module(
	'game.entities.biplane'
)
.requires(
	'impact.entity',
	'game.entities.enemy'
)
.defines(function(){

EntityBiplane = EntityEnemy.extend({
	
	size: {x:41, y:36},
	
	animSheet: new ig.AnimationSheet( 'media/biplane.png', 41, 36 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	}
});

});