
//CREATE REUSABLE VISUAL ASSET
Crafty.sprite(36, "./media/images/biplane.png", { BiplaneSprite: 	[0, 0, 1.13, 1]});
Crafty.sprite(25, "./media/images/blimp.png", 	{ BlimpSprite: 		[0, 0, 3.4, 1.2]});

//CREATE COMPONENT AND INCLUDE SUB-COMPONENTS FOR ALL NEEDS
Crafty.c("Enemy", {

	//SET DEFAULT SPEED (WILL BE OVERWRITTEN)
    speed : 0,
    
    //INITIALIZE
    init: function() {
    	
    	//ADD ALL NEEDED COMPONENTS
        this.addComponent("2D, Canvas, Collision, Image");
        
		//ENTERFRAME
		this.bind("EnterFrame", function() {
			this.x += this.speed;
			this.updateBasedOnDirection();
		});	

	},
	
	//THIS IS SET FROM OUTSIDE THE CLASS
	//AS AN OPTIMIZATION, USE AN 'IF' NOW, DO NOT USE NO 'IFS' ON EVERY FRAME.
	setSpeed : function (speed) {
		
		this.speed = speed;
		
		//SET TICK CODE BASED ON DIRECTION OF TRAVEL
		if (this.speed > 0) {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionRight();}
		} else {
			this.updateBasedOnDirection = function () {this.updateBasedOnDirectionLeft();}		
		}
		
	},
    
	//OVERWRITTEN VIA setSpeed()
   	updateBasedOnDirection : function () {
		//KEEP THIS, AND KEEP IT EMPTY
	},
	
	//RIGHT - CHECK SCREEN BOUNDS
	updateBasedOnDirectionRight : function () {
		
		//SET POSITION
		if (this.x - this.w > STAGE_WIDTH) {
			this.x = -this.w;
		} 
	},
	
	//LEFT - CHECK SCREEN BOUNDS
	updateBasedOnDirectionLeft: function () {
		
		//SET POSITION
		if (this.x + this.w < 0) {
			this.x = STAGE_WIDTH;
		} 
	}

});
