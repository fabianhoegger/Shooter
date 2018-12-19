var Winstate={

  preload:function(){

    game.load.bitmapFont('spacefont', '/assets/font/font.png', '/assets/font/font.fnt');

  },
  create : function(){
    var myText;
    myText = game.add.bitmapText(250, 300, 'spacefont', player.health + '%', 50);
    myText.text = "YOU WON";
    game.time.events.add(2000, function() {
      game.add.tween(myText).to({
        y: 0
      }, 1500, Phaser.Easing.Linear.None, true);
      game.add.tween(myText).to({
        alpha: 0
      }, 1500, Phaser.Easing.Linear.None, true);
    }, this);

  }








}
