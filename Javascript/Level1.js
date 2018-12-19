var Level1 = {



  preload: function() {
    //  We need this because the assets are on github pages
    //  Remove the next 2 lines if running locally
    //	game.load.baseURL = 'https://fabianhoegger.github.io/Shooter/';
    game.load.crossOrigin = 'anonymous';
    game.load.image('starfield', 'assets/starfield.png');

    game.load.image('ship', 'assets/ship.png');

    //boss
    game.load.image('boss', 'assets/enemies/destroyer.png');
    game.load.image('deathray', 'assets/bullets/death_ray.png');

    game.load.image('bullet', 'assets/bullets/bullet.png');
    game.load.image('blueEnemyBullet', '/assets/bullets/blue-enemy-bullet.png');

    game.load.image('enemy-green', '/assets/enemies/enemy2.png');
    game.load.image('enemy-blue', '/assets/enemies/enemy4.png');

    game.load.spritesheet('coin', '/assets/pickups/coin50.png', 32, 32);
    game.load.spritesheet('healthpack', '/assets/pickups/healthpack.png', 17, 17);
    game.load.spritesheet('pickup', '/assets/pickups/coin48.png', 32, 32);

    game.load.spritesheet('explosion', '/assets/explode.png', 128, 128);
    game.load.spritesheet('plasmabullet', '/assets/plasma.png', 100, 100);

    game.load.bitmapFont('spacefont', '/assets/font/font.png', '/assets/font/font.fnt');

    game.load.audio('gunsound', 'assets/Audio/gun.mp3');
    game.load.audio('explosionsound', 'assets/Audio/explosion.mp3');
    game.load.audio('themesound', 'assets/Audio/themesound.mp3');


  },

  create: function() {


    //sound effects
    explosionsound = game.add.audio('explosionsound');
    gun = game.add.audio('gunsound');
    themesound = this.add.audio('themesound');
    themesound.play();

    game.scale.pageAlignHorizontally = true;
    //  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    //  Our bullet group
    //enemy bulletS
    //  Blue enemy's bullets
    blueEnemyBullets = game.add.group();
    blueEnemyBullets.enableBody = true;
    blueEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    blueEnemyBullets.createMultiple(30, 'blueEnemyBullet');
    blueEnemyBullets.callAll('crop', null, {
      x: 90,
      y: 0,
      width: 90,
      height: 70
    });
    blueEnemyBullets.setAll('alpha', 0.9);
    blueEnemyBullets.setAll('anchor.x', 0.5);
    blueEnemyBullets.setAll('anchor.y', 0.5);
    blueEnemyBullets.setAll('outOfBoundsKill', true);
    blueEnemyBullets.setAll('checkWorldBounds', true);
    blueEnemyBullets.forEach(function(enemy) {
      enemy.body.setSize(20, 20);
    });

    plasmabullets = game.add.group();
    plasmabullets.enableBody = true;
    plasmabullets.physicsBodyType = Phaser.Physics.ARCADE;
    plasmabullets.createMultiple(30, 'plasmabullet');
    plasmabullets.setAll('alpha', 0.9);
    plasmabullets.setAll('anchor.x', 0.5);
    plasmabullets.setAll('anchor.y', 0.5);
    plasmabullets.setAll('outOfBoundsKill', true);
    plasmabullets.setAll('checkWorldBounds', true);
    plasmabullets.callAll('animations.add', 'animations', 'fire', [0, 1, 2, 3, 4, 5, 6, 7], 30, true);
    plasmabullets.callAll('play', null, 'fire');
    plasmabullets.forEach(function(enemy) {
      enemy.body.setSize(50, 50);
    });


    coins = game.add.group();
    coins.enableBody = true;
    coins.physicsBodyType = Phaser.Physics.ARCADE;
    coins.setAll('outOfBoundsKill', true);
    coins.setAll('checkWorldBounds', true);


    healthpack = game.add.group();
    healthpack.enableBody = true;
    healthpack.physicsbodyType = Phaser.Physics.ARCADE;
    healthpack.setAll('outOfBoundsKill', true);
    healthpack.setAll('checkWorldBounds', true);

    pickups = game.add.group();
    pickups.enableBody = true;
    pickups.physicsBodyType = Phaser.Physics.ARCADE;
    pickups.setAll('outOfBoundsKill', true);
    pickups.setAll('checkWorldBounds', true);

    //  The hero!
    //  The hero!
    player = game.add.sprite(100, game.height / 2, 'ship');
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
    player.body.drag.setTo(DRAG, DRAG);
    player.health = 100;
    player.weaponLevel = 1;
    player.events.onKilled.add(function() {
      shipTrail.kill();
    })
    player.events.onRevived.add(function() {
      shipTrail.start(false, 5000, 10);
    });

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    rbutton = game.input.keyboard.addKey(Phaser.Keyboard.NINE);

    //  Add an emitter for the ship's trail
    shipTrail = game.add.emitter(player.x - 20, player.y, 400);
    shipTrail.height = 10;
    shipTrail.makeParticles('bullet');
    shipTrail.setYSpeed(20, -20);
    shipTrail.setXSpeed(-140, -120);
    shipTrail.setRotation(50, -50);
    shipTrail.setAlpha(1, 0.01, 800);
    shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000,
      Phaser.Easing.Quintic.Out);
    shipTrail.start(false, 5000, 10);
    //  An explosion pool
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach(function(explosion) {
      explosion.animations.add('explosion');
    });
    //BIGGER EXPLOSION
    playerDeath = game.add.emitter(player.x, player.y);
    playerDeath.width = 50;
    playerDeath.height = 50;
    playerDeath.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7], 10);
    playerDeath.setAlpha(0.9, 0, 800);
    playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);
    //enemies
    greenEnemies = game.add.group();
    greenEnemies.enableBody = true;
    greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
    greenEnemies.createMultiple(30, 'enemy-green');
    greenEnemies.setAll('anchor.x', 0.5);
    greenEnemies.setAll('anchor.y', 0.5);
    greenEnemies.setAll('scale.x', 0.5);
    greenEnemies.setAll('scale.y', 0.5);
    greenEnemies.setAll('angle', 180);
    //	greenEnemies.setAll('outOfBoundsKill', true);
    //	greenEnemies.setAll('checkWorldBounds', true);
    greenEnemies.forEach(function(enemy) {
      addEnemyEmitterTrail(enemy);
      enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
      enemy.damageAmount = 20;
      enemy.events.onKilled.add(function() {
        enemy.trail.kill();
      });
    });

    blueEnemies = game.add.group();
    blueEnemies.enableBody = true;
    blueEnemies.physicsBodyType = Phaser.Physics.ARCADE;
    blueEnemies.createMultiple(30, 'enemy-blue');
    blueEnemies.setAll('anchor.x', 0.5);
    blueEnemies.setAll('anchor.y', 0.5);
    blueEnemies.setAll('scale.x', 0.5);
    blueEnemies.setAll('scale.y', 0.5);
    blueEnemies.setAll('angle', 180);
    blueEnemies.forEach(function(enemy) {

      enemy.damageAmount = 40;
    });
    //  The boss
    boss = game.add.sprite(0, 0, 'boss');
    boss.exists = false;
    boss.alive = false;
    boss.anchor.setTo(0.5, 0.5);
    boss.damageAmount = 50;
    boss.angle = 180;
    boss.scale.x = 0.6;
    boss.scale.y = 0.6;
    game.physics.enable(boss, Phaser.Physics.ARCADE);
    boss.body.setSize(300, 200, 100, null);
    boss.body.maxVelocity.setTo(100, 80);
    boss.dying = false;
    boss.finishOff = function() {
      if (!boss.dying) {
        boss.dying = true;
        bossDeath.x = boss.x;
        bossDeath.y = boss.y;
        bossDeath.start(false, 1000, 50, 20);
        //  kill boss after explotions
        game.time.events.add(1000, function() {
          var explosion = explosions.getFirstExists(false);
          var beforeScaleX = explosions.scale.x;
          var beforeScaleY = explosions.scale.y;
          var beforeAlpha = explosions.alpha;
          explosion.reset(boss.body.x + boss.body.halfWidth, boss.body.y + boss.body.halfHeight);
          explosion.alpha = 0.4;
          explosion.scale.x = 3;
          explosion.scale.y = 3;
          var animation = explosion.play('explosion', 30, false, true);
          animation.onComplete.addOnce(function() {
            explosion.scale.x = beforeScaleX;
            explosion.scale.y = beforeScaleY;
            explosion.alpha = beforeAlpha;
          });
          boss.kill();

          //  booster.kill();
          boss.dying = false;
          bossDeath.on = false;

          game.time.events.add(Phaser.Timer.SECOND * 5, function() {
            lvl2();
            //game.state.start("Level2");
          });
        });

        //  reset pacing for other enemies
        blueEnemySpacing = 2500;
        greenEnemySpacing = 1000;
        //  give some bonus health
        //  player.health = Math.min(100, player.health + 40);
        liferender();
      }
    };





    boss.update = function() {
      if (!boss.alive) return;

      //boss.rayLeft.update();
      //  boss.rayRight.update();

      if (boss.y > 140) {
        boss.body.acceleration.y = -50;
      }
      if (boss.y < 140) {
        boss.body.acceleration.y = 50;
      }
      if (boss.x > player.x + 50) {
        boss.body.acceleration.x = -50;
      } else if (boss.x < player.x - 50) {
        boss.body.acceleration.x = 50;
      } else {
        boss.body.acceleration.x = 0;
      }

      //  Squish and rotate boss for illusion of "banking"
      var bank = boss.body.velocity.x / MAXSPEED;
      boss.scale.x = 0.6 - Math.abs(bank) / 3;
      boss.angle = 180 - bank * 20;
    }

    //boss explosion
    //  Big explosion for boss
    bossDeath = game.add.emitter(boss.x, boss.y);
    bossDeath.width = boss.width / 2;
    bossDeath.height = boss.height / 2;
    bossDeath.makeParticles('explosion', [0, 1, 2, 3, 4, 5, 6, 7], 20);
    bossDeath.setAlpha(0.9, 0, 900);
    bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);

    boss.bringToTop();



    game.time.events.add(1000, launchGreenEnemy);
    flagtext = game.add.text(game.world.centerX, game.world.centerY, flag2, {
      font: "65px Arial",
      fill: "#ff0044",
      align: "center"
    });
    //FONT CREATION
    life = game.add.bitmapText(game.world.width - 300, 10, 'spacefont', player.health + '%', 50);
    liferender();
    //  Score
    scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 50);
    scoreTextrender();
    Clickrestart = game.add.bitmapText(game.world.width - 300, 550, 'spacefont', '', 30);
    Clickrestart.text = 'to restart click 9';
    gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
    gameOver.x = gameOver.x - gameOver.textWidth / 2;
    gameOver.y = gameOver.y - gameOver.textHeight / 3;
    gameOver.visible = false;

    timer = game.time.create(false);
    timer.loop(40000, timedOut, this);
    timer.start();


  },

  update: function() {
    flagtext.text = flag2;
    //  Scroll the background
    starfield.tilePosition.x -= 2;
    //  Reset the player, then check for movement keys
    player.body.acceleration.y = 0;
    player.body.acceleration.x = 0;
    key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    if (rbutton.isDown) {
      restart();
    }
    if (cursors.up.isDown) {
      player.body.acceleration.y = -ACCLERATION;
    } else if (cursors.down.isDown) {
      player.body.acceleration.y = ACCLERATION;
    } else if (cursors.left.isDown) {
      player.body.acceleration.x = -ACCLERATION;
    } else if (cursors.right.isDown) {
      player.body.acceleration.x = ACCLERATION;
    }
    //  Stop at screen edges
    if (player.x > game.width - 30) {
      player.x = game.width - 30;
      player.body.acceleration.x = 0;
    }
    if (player.x < 30) {
      player.x = 30;
      player.body.acceleration.x = 0;
    }
    if (player.y > game.height - 15) {
      player.y = game.height - 15;
      player.body.acceleration.y = 0;
    }
    if (player.y < 15) {
      player.y = 15;
      player.body.acceleration.y = 0;
    }
    //  Fire bullet
    if (player.alive && fireButton.isDown) {
      fireBullet();
    }

    //  Keep the shipTrail lined up with the ship
    shipTrail.y = player.y;
    shipTrail.x = player.x - 20;
    //  Check collisions
    game.physics.arcade.overlap(player, greenEnemies, shipCollide, null, this);
    game.physics.arcade.overlap(greenEnemies, bullets, hitEnemy, null, this);

    game.physics.arcade.overlap(player, blueEnemies, shipCollide, null, this);
    game.physics.arcade.overlap(blueEnemies, bullets, hitEnemy, null, this);

    game.physics.arcade.overlap(blueEnemyBullets, player, enemyHitsPlayer, null, this);

    game.physics.arcade.overlap(player, coins, increaseScore, null, this);
    game.physics.arcade.overlap(player, healthpack, increaseHealth, null, this);
    game.physics.arcade.overlap(player, pickups, setPickup, null, this);

    game.physics.arcade.overlap(boss, bullets, hitBoss, bossHitTest, this);
    game.physics.arcade.overlap(plasmabullets, player, enemyHitsPlayer, null, this);

    //  game.physics.arcade.overlap(player, boss,bossdamaged,bossHitTest,this);

    scoreTextrender();
    liferender();
    if (score >= 10000 && bossLaunched == false) {
      bossLaunchTimer = game.time.events.add(game.rnd.integerInRange(bossSpacing, bossSpacing + 100), launchBoss);
      bossLaunched = true;
      firingDelay2 = 2000;


    }
    if (!themesound.isPlaying) {
      themesound.play();
    }

    if (!player.alive && gameOver.visible === false) {
      gameOver.visible = true;
      gameOver.alpha = 0;
      var fadeInGameOver = game.add.tween(gameOver);
      fadeInGameOver.to({
        alpha: 1
      }, 1000, Phaser.Easing.Quintic.Out);
      fadeInGameOver.onComplete.add(setResetHandlers);
      fadeInGameOver.start();

      function setResetHandlers() {
        //  The "click to restart" handler
        tapRestart = game.input.onTap.addOnce(_restart, this);
        spaceRestart = fireButton.onDown.addOnce(_restart, this);

        function _restart() {
          tapRestart.detach();
          spaceRestart.detach();
          gameOver.visible = false;
          restart();

        }
      }
    }


  },


  render: function() {
    // for (var i = 0; i < greenEnemies.length; i++)
    //   {
    //    game.debug.body(plasmabullets);

    //}
    //  game.debug.body(player);
  },





}
