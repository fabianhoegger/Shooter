var Mainmenu= {


  preload:function(){
    game.load.image('starfield', 'assets/starfield.png');
    game.load.image('btn1', 'assets/buttons/button1.png');
    game.load.image('btn2', 'assets/buttons/button2.png');
    game.load.bitmapFont('spacefont', '/assets/font/font.png', '/assets/font/font.fnt');

  },
  create : function(){
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    button1 = game.add.button(game.world.centerX -150, 100, 'btn1', lvl1 , this);
		button2 = game.add.button(game.world.centerX -150, 300, 'btn2', lvl2, this);
    button1.scale.setTo(0.5,0.5);
		button2.scale.setTo(0.5,0.5);

  }



}
