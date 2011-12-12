

/**

 */
Crafty.sprite(35, "./media/images/biplane.png", { BiplaneSprite: [0, 0]});
Crafty.sprite(25, "./media/images/blimp.png", { BlimpSprite: [0, 0]});
//
Crafty.c("Enemy", {

    speed : 0,
    
    init: function() {
    	
        this.addComponent("2D, Canvas, Collision");
        
		//ENTERFRAME
		this.bind("EnterFrame", function() {
			this.x += this.speed;
			this.updateBasedOnDirection();
		});	

	},
	
	setSpeed : function (speed) {
		
		this.speed = speed;
		//SET TICK CODE BASED ON DIRECTION OF TRAVEL
		if (this.speed > 0) {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionRight();}
		} else {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionLeft();}		
		}

		//SET TICK CODE BASED ON DIRECTION OF TRAVEL
		if (this.speed > 0) {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionRight();}
		} else {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionLeft();}		
		}
		
	},
    
					
	//OVERWRITTEN VIA INIT()
   	updateBasedOnDirection : function () {
		//KEEP THIS, AND KEEP IT EMPTY
	},
	
	updateBasedOnDirectionRight : function () {
		
		//SET POSITION
		if (this.x - this.w > STAGE_WIDTH) {
			this.x = -this.w;
		} 
		
	},
	
	updateBasedOnDirectionLeft: function () {
		
		//SET POSITION
		if (this.x + this.w < 0) {
			this.x = STAGE_WIDTH;
		} 
		
	}

});
