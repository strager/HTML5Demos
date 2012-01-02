/**
 * Copyright (C) 2005-2012 by Rivello Multimedia Consulting (RMC).                    
 * code [at] RivelloMultimediaConsulting [dot] com                                                  
 *                                                                      
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the      
 * "Software"), to deal in the Software without restriction, including  
 * without limitation the rights to use, copy, modify, merge, publish,  
 * distribute, sublicense, and#or sell copies of the Software, and to   
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:                                            
 *                                                                      
 * The above copyright notice and this permission notice shall be       
 * included in all copies or substantial portions of the Software.      
 *                                                                      
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,      
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF   
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR    
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.                                      
 */
// Marks the right margin of code *******************************************************************




//NOTE: Externalizing the sound loading is not required. I just wanted to do it to
//		learn about classes in Spaceport.io.



define( [	'client/managers/SoundManager', 
			'client/managers/AssetManager'], 
			function(SoundManager, AssetManager){
	
	//**************************************************
	//	CLASS
	//**************************************************
	var FlyerGameSoundLoader = sp.Class.create( "FlyerGameSoundLoader", sp.EventDispatcher, {
  	
  	//**************************************************
	//	PROPERTIES
	//**************************************************
    statics: {
      WIN_GAME_SOUND : "WIN_GAME_SOUND",
      LOSE_GAME_SOUND  : "LOSE_GAME_SOUND",
      MOVE_FLYER_SOUND : "MOVE_FLYER_SOUND",
      TOTAL_TO_LOAD : 3 //CHANGE THIS FOR MORE ASSETS
    },
    properties: {
      total_loaded: 0,
      onLoadCompleteCallBack : null
    },
    
    	//**************************************************
	//	CLASS
	//**************************************************
    constructor: function FlyerGameSoundLoader(){
    	
    	//NOTE: YOU CAN PASS IN ARGUMENTS TO CONSTRUCTOR
      	//this.layer = aLayer;
    },
    //**************************************************
	//	CLASS
	//**************************************************
    methods: {
      load: function load(aOnLoadCompleteCallBack){
      	
      	//RESET VARS
      	this.total_loaded = 0;
      	this.onLoadCompleteCallBack = aOnLoadCompleteCallBack;
      	
		//STORE A REFERENCE SINCE the anonymous methods need it.
		var flyerGameSoundLoader = this;
		
		//
      	var winGame_sound = new sp.Sound( new sp.URLRequest("content/FlyerGame/sounds/WinGameSound.mp3") );
      	winGame_sound.addEventListener( sp.Event.COMPLETE, function(event){
	       	SoundManager.addResource( FlyerGameSoundLoader.WIN_GAME_SOUND, winGame_sound );
	      	event.target.removeEventListener( event.type, arguments.callee );
	      	flyerGameSoundLoader.checkIfLoaded();
	    });
	    
	    //
      	var loseGame_sound = new sp.Sound( new sp.URLRequest("content/FlyerGame/sounds/LoseGameSound.mp3") );
      	loseGame_sound.addEventListener( sp.Event.COMPLETE, function(event){
	    	SoundManager.addResource( FlyerGameSoundLoader.LOSE_GAME_SOUND, loseGame_sound );
	      	event.target.removeEventListener( event.type, arguments.callee );
	      	flyerGameSoundLoader.checkIfLoaded();
	    });
	   
	    //
      	var moveFlyer_sound = new sp.Sound( new sp.URLRequest("content/FlyerGame/sounds/MoveFlyerSound.mp3") );
      	moveFlyer_sound.addEventListener( sp.Event.COMPLETE, function(event){
	    	SoundManager.addResource( FlyerGameSoundLoader.MOVE_FLYER_SOUND, moveFlyer_sound );
	      	event.target.removeEventListener( event.type, arguments.callee );
	      	flyerGameSoundLoader.checkIfLoaded();
	    });
	    

      },
      checkIfLoaded: function checkIfLoaded( ){
	    if (++ this.total_loaded >= FlyerGameSoundLoader.TOTAL_TO_LOAD) {
	    	this.onLoadCompleteCallBack();
	    }
      }
    }
  });
  return FlyerGameSoundLoader;
});
