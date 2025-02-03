export class Menu extends Phaser.Scene {

    constructor() {
        super({
            key: 'Menu'
        });
    }

    preload() {
        // Load assets here
      }

    create() {
        // Scene creation logic here
        //console.log('Scene is created');
        //this.events.emit('sceneLoaded');
        this.scene.start('Game');
    }
}