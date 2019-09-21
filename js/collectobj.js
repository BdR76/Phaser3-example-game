// Phaser3 example game
// collectable object class
// Typically you would have a separate class for enemies
// The enemy class contains code for movement patterns etc.
// This is to separate the code and keep it manageable and organised

var TYPE_COIN = 1;
var TYPE_BOMB  = 2;

class CollectObj extends Phaser.Physics.Arcade.Sprite {

	constructor(scene, x, y, texture, objtype) {
		// pass parameters to the class we are extending, call super
		super(scene, x, y, texture)

		// add to scene
		scene.add.existing(this)
		scene.physics.add.existing(this)

		// when scene updates, also update this object
		//scene.events.on('update', this.update, this)

		// save type for collision detection
		this.setData("type", objtype); // use data for overlap later

		// frame and animation for bomb or coin
		if (objtype == TYPE_BOMB) {
			// bomb
			this.setFrame('bomb');
		} else {
			// coin, play animation with random frame offset, so that coins don't all spin exactly the same way
			var r = Phaser.Math.RND.between(0, 7);
			this.play('cointurn', null, r); // key, ignoreIfPlaying = null, startFrame = r; note: animation created in preloader scene
		};
	}

	update() {
		//this.healthBar.follow(this)
	}
}

