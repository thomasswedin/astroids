export class Preloader extends Phaser.Scene {

    constructor() {
        super({
            key: 'Preloader'
        });
    }

    preload() {
        // Load assets here
      }

    create() {
        // Scene creation logic here
        //console.log('Scene is created');
        //this.events.emit('sceneLoaded');
        this.scene.start('Menu');
    }
}