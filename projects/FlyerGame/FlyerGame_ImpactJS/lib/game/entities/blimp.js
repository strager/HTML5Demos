ig.module(
	'game.entities.blimp'
)
.requires(
	'impact.entity',
	'game.entities.enemy'
)
.defines(function(){

EntityBlimp = EntityEnemy.extend({
	
	size: {x:86, y:31},
	
	animSheet: new ig.AnimationSheet( './media/images/blimp.png', 86, 31 ),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	}
});

});