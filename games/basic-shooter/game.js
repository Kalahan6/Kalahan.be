
BasicGame.Game = function (game) {

};

BasicGame.Game.prototype = {
	preload: function(){
		this.load.image('sea', 'assets/sea.png');
		this.load.image('bullet', 'assets/bullet.png');
		this.load.spritesheet('greenEnemy','assets/enemy.png', 32, 32);
		this.load.spritesheet('explosion','assets/explosion.png', 32, 32);
		this.load.spritesheet('player','assets/player.png', 64, 64);
	},
	
 	create: function () {
    	this.sea = this.add.tileSprite(0, 0, 800, 600, 'sea');
		
		this.player = this.add.sprite(400, 550, 'player');
		this.player.anchor.setTo(0.5,0.5);
		this.player.animations.add('fly', [0, 1, 2], 20, true);
		this.player.play('fly');
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = 300;
		this.player.body.collideWorldBounds = true;
		
		this.enemyPool = this.add.group();
		this.enemyPool.enableBody = true;
		this.enemyPool.physicsBodyTyp = Phaser.Physics.ARCADE;
		this.enemyPool.createMultiple(100, 'greenEnemey');
		this.enemyPool.setAll('anchor.x', 0.5);
		this.enemyPool.setAll('anchor.y', 0.5);
		this.enemyPool.setAll('outOfBoundsKill', true);
		this.enemyPool.setAll('checkWorldBounds', true);
		
		this.enemyPool.forEach(
		function (enemy){
			enemy.animations.add('fly', [0, 1, 2], 20, true);
		}
		);
		
		this.nextEnemyAt = 0;
		this.enemyDelay = 1000;
		
		this.bulletPool = this.add.group();
		this.bulletPool.enableBody = true;
		this.bulletPool.physicsBodyTyp = Phaser.Physics.ARCADE;
		this.bulletPool.createMultiple(100, 'bullet');
		this.bulletPool.setAll('anchor.x', 0.5);
		this.bulletPool.setAll('anchor.y', 0.5);
		this.bulletPool.setAll('outOfBoundsKill', true);
		this.bulletPool.setAll('checkWorldBounds', true);
		
		this.nextShotAt = 0;
		this.shotDelay = 100;
		
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.instructions = this.add.text(400,500, 'User Arrow Keys to Move, Press SPACE to Fire\n' + 'Tapping/Clicking does both', {font: '20px monospace', fill: '#fff', align: 'center'});
  		this.instructions.anchor.setTo(0.5, 0.5);
		this.instExpire = this.time.now + 3000;
	
	},

  	update: function () {
  		this.sea.tilePosition.y += 0.2;
		
		this.physics.arcade.overlap(this.bulletPool, this.enemyPool, this.enemyHit, null, this);
		
		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;
		
		if (this.cursors.left.isDown){
			this.player.body.velocity.x = -this.player.speed;
		} else if (this.cursors.right.isDown){
			this.player.body.velocity.x = this.player.speed;
		}
		
		if (this.cursors.up.isDown){
			this.player.body.velocity.y = -this.player.speed;
		} else if (this.cursors.down.isDown){
			this.player.body.velocity.y = this.player.speed;
		}
		
		if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15){
			this.physics.arcade.moveToPointer(this.player, this.player.speed);
		}
		
		if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR, 100) || this.input.activePointer.isDown) {
			this.fire();
		}
		
		if (this.instructions.exists && this.time.now > this.instExpire) {
			this.instructions.destroy();
		}
  	},
	
	render: function() {
	},

  	quitGame: function (pointer) {

    	//  Here you should destroy anything you no longer need.
    	//  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    	//  Then let's go back to the main menu.
    	this.state.start('MainMenu');

  	},
	
	enemyHit: function (bullet, enemy) {
		bullet.kill();
		enemy.kill();
		var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
		explosion.anchor.setTo(0.5,0.5);
		explosion.animations.add('boom');
		explosion.play('boom', 15, false, true);
	},
	
	fire: function(){
		
		if (this.nextShotAt > this.time.now) {
			return;
		}
		
		if (this.bulletPool.countDead() === 0){
			return;
		}
		this.nextShotAt = this.time.now + this.shotDelay;
		
		var bullet = this.bulletPool.getFirstExists(false);
		bullet.reset(this.player.x, this.player.y - 20);
		bullet.body.velocity.y = -500;
	}

};
