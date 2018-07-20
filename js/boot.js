// Phaser3 example game
// boot scene, only to load loadingbar graphics

var Boot = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Boot ()
    {
        Phaser.Scene.call(this, { key: 'boot' });
    },

    preload: function ()
    {
		this.load.image('loadingbar_bg', 'img/loadingbar_bg.png');
		this.load.image('loadingbar_fill', 'img/loadingbar_fill.png');
    },

    create: function ()
    {
		this.scene.start('preloader');
    }
});
