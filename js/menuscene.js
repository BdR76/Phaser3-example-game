// Phaser3 example game
// mein menu scene

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'mainmenu' });
    },

    preload: function ()
    {
    },

    create: function ()
    {

		// add logo
		//this.sys.config.backgroundColor = '#f3cca3';
        var logo = this.add.sprite(400, 200, 'sprites', 'phaser3');
		
		// add tutorial and start button
		this.btnhelp = this.addButton(400-80, 400, 'sprites', this.doTutor, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
		this.btnstart = this.addButton(400+80, 400, 'sprites', this.doStart, this, 'btn_play_hl', 'btn_play', 'btn_play_hl', 'btn_play');

		console.log('create is ready');
    },
	
    doTutor: function ()
    {
        console.log('doTutor was called!');
		this.scene.start('tutorscene');
    },
	
	doStart: function ()
    {
        console.log('menuscene doStart was called!');
		this.scene.start('gamescene');
    }

});
