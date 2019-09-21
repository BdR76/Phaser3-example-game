// Phaser3 example game
// main game scene

var DIR_UP    = 1;
var DIR_DOWN  = 2;
var DIR_LEFT  = 4;
var DIR_RIGHT = 8;

var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gamescene' });
    },

    preload: function ()
    {

    },

    create: function ()
    {
		// add player sprite
		this.dude = this.physics.add.image(400, 200, 'sprites', 'dude');
		//this.dude = this.add.sprite(400, 200, 'sprites', 'dude');

		this.dude.setCollideWorldBounds(true);
			
		// add random coins and bombs
		this.gameitems = this.physics.add.group();

        for (var i = 0; i < 20; i++) {
			// parameters
            var x = Phaser.Math.RND.between(0, 800);
            var y = Phaser.Math.RND.between(0, 600);
			var objtype = (i < 5 ? TYPE_BOMB : TYPE_COIN);

			// create custom sprite object
			var newobj = new CollectObj(this, x, y, 'sprites', objtype);

			this.gameitems.add(newobj);
        }

		// coin particles
		var sparks = this.add.particles('sprites');
		this.coinspark = sparks.createEmitter({
			frame: [ 'sparkle1', 'sparkle2' ],
			quantity: 15,
			scale: { start: 1.0, end: 0 },
			on: false,
			speed: 200,
			lifespan: 500
		});
		
		// bomb explosion particles (small)
		var expl1 = this.add.particles('sprites');
		this.bombexpl1 = expl1.createEmitter({
			frame: [ 'bombexpl1' ],
			frequency: 100,
			quantity: 10,
			scale: { start: 1.0, end: 0 },
			speed: { min: -1000, max: 1000 },
			lifespan: 800,
			on: false
		});
		
		// bomb explosion particles (big)
		var expl2 = this.add.particles('sprites');
		this.bombexpl2 = expl2.createEmitter({
			frame: [ 'bombexpl2' ],
			quantity: 3,
			scale: { start: 2.0, end: 0 },
			frequency: 500,
			on: false,
			speed: { min: -200, max: 200 },
			lifespan: 1000
		});

		// sound effects
		this.sfxcoin = this.sound.add('coin');
		this.sfxbomb = this.sound.add('bomb');

		// set up arcade physics, using `physics` requires "physics:{default: 'arcade'" when starting "new Phaser.Game(.."
		this.physics.add.overlap(this.dude, this.gameitems, this.doOverlapItem, null, this);
		
		// player input
		this.cursors = this.input.keyboard.createCursorKeys();
		
		// quit to menu button
		this.btnquit = this.addButton(760, 40, 'sprites', this.doBack, this, 'btn_close_hl', 'btn_close', 'btn_close_hl', 'btn_close');
    },

    update: function (time, delta)
    {
		// reset velocity
		//this.dude.setVelocityX(0);
		//this.dude.setVelocityY(0);

		// keyboard input
		this.dude.setVelocity(0);
		if (this.cursors.up.isDown)    this.movePlayer(DIR_UP);
		if (this.cursors.down.isDown)  this.movePlayer(DIR_DOWN);
		if (this.cursors.left.isDown)  this.movePlayer(DIR_LEFT);
		if (this.cursors.right.isDown) this.movePlayer(DIR_RIGHT);
    },
	
    doOverlapItem: function (dud, obj) {
		console.log('doOverlapItem -- hit!');
		
		if (obj.data.values.type == TYPE_COIN) {
		//if (obj.getData("type") == TYPE_COIN) { // does the exact same
			// coin
			// play coin sound
			this.sfxcoin.play();

			// set emitter to coin position and emit particles
			this.coinspark.setPosition(obj.x, obj.y);
			this.coinspark.explode();	
		} else {
			// bomb
			// play bomb sound
			this.sfxbomb.play();
			
			// set emitters for bomb explosion
			this.bombexpl1.setPosition(obj.x, obj.y);
			this.bombexpl1.explode();

			this.bombexpl2.setPosition(obj.x, obj.y);
			this.bombexpl2.explode();
			//this.bombexpl2.start();
			
			// player dies
			this.playerDies();
		};

		// Completely destroy and remove object from memory
		obj.destroy();

		// Hide the sprite and disable the body,
		//   don't destroy sprite and potentially re-use memory at later time
		//   when adding new sprites to this.gameitems
		//this.gameitems.killAndHide(obj);
		//obj.body.enable = false;
	},
	
    playerDies: function () {

		// make player invisible
		this.dude.visible = false;
		this.dude.body.enable = false;
		
		// add game over text
		var txt = this.add.bitmapText(400, 300, 'fontwhite', 'Game over!');
		txt.setOrigin(0.5).setCenterAlign();

		// set gameover text as transparant, upside down and larger
		txt.setAlpha(0.0);
		txt.setAngle(180);
		txt.setScale(4.0, 4.0);
		
		// add twirl/zoom animation to gameover text
		var tw = this.tweens.add(
			{
				targets: txt,
				scaleX: 1.0,
				scaleY: 1.0,
				alpha: 1.0,
				angle: 0,
				ease: 'Power3',
				duration: 1000, // duration of animation; higher=slower
				delay: 500      // wait 500 ms before starting
			}
		);
	},
	

    movePlayer: function (dir) {

		// move the dude
		//if (dir == DIR_UP)    this.dude.setVelocityY(-200);
		//if (dir == DIR_DOWN)  this.dude.setVelocityY(+200);
		//if (dir == DIR_LEFT)  this.dude.setVelocityX(-200);
		//if (dir == DIR_RIGHT) this.dude.setVelocityX(+200);
		if (dir == DIR_UP)    this.dude.y -= 2;
		if (dir == DIR_DOWN)  this.dude.y += 2;
		if (dir == DIR_LEFT)  this.dude.x -= 2;
		if (dir == DIR_RIGHT) this.dude.x += 2;
		
		//var test = this.scene.getBounds();
		// check limits
		if (this.dude.y < 0)   this.dude.y = 0;
		if (this.dude.y > 600) this.dude.y = 600;
		if (this.dude.x < 0)   this.dude.x = 0;
		if (this.dude.x > 800) this.dude.x = 800;
	},

    doBack: function ()
    {
        console.log('gamescene doBack was called!');
		this.scene.start('mainmenu');
    }

});
