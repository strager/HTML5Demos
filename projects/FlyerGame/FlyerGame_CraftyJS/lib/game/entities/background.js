
/**

 */
Crafty.c("Background", {
    /**
     * Initialisation. Adds components, sets positions, binds mouse click handler
     */
    init: function() {
        this.addComponent("2D, Canvas, Image");

		this.image("./media/images/background.png");
		this.x = 0;
		this.y = 0;
        this.w = STAGE_WIDTH;
        this.h = STAGE_HEIGHT;
        
      	this.scoreLabel = Crafty.e("2D, Canvas, SpriteText")
            .attr({x: 20, y: 20, w: 50, h: 50})
            .registerFont ("SyntaxError", 32, "./img/OSDM_Fnt32x32_SyntaxTerror-Copy2.png");
            
        this.setScore (0);
    },
    
    setScore: function(score_num) {
        this.scoreLabel.text("Score: " + score_num);
    }

});
