import Phaser from 'phaser';
import { GameConstants } from '../../../constants/GameConstants';
export class MKeypad extends Phaser.GameObjects.Graphics {

    private _joyStick: any;
    //private _fireButton: any;
    private _currentScene: Phaser.Scene;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, { x, y });
        this._currentScene = scene;
        scene.input.addPointer(1);
        const joystickPlugin = scene.plugins.get('rexvirtualjoystickplugin') as any;
        if (!joystickPlugin) {
            throw new Error('rexvirtualjoystickplugin is not available');
        }
        this._joyStick = joystickPlugin.add(scene, {
                x: x,
                y: y,
                radius: 100,
                base: this.createBaseGameObject(scene),
                thumb: this.createThumbGameObject(scene),
                // dir: '8dir',
                // forceMin: 16,
            })
            .on('update', this.dumpJoyStickState.bind(this));


            this.dumpJoyStickState();

            /*this._fireButton = this.createFireButtonGameObject(scene)
            .setInteractive()
            .on('pointerdown', this.dumpButtonState, this)
            .on('pointerup', this.dumpButtonState, this);*/

            /*
            let leftKeyDown = this._joyStick.left;
            let rightKeyDown = this._joyStick.right;
            let upKeyDown = this._joyStick.up;
            let downKeyDown = this._joyStick.down;
            let noKeyDown = this._joyStick.noKey;
            */
            //I would like to trace all joystick events here
    
    }

    private createBaseGameObject(scene: Phaser.Scene): Phaser.GameObjects.GameObject {
        // Create and return the base game object here
        return scene.add.circle(0, 0, 50, 0x888888, 0.3);
    }

    private createThumbGameObject(scene: Phaser.Scene): Phaser.GameObjects.GameObject {
        // Create and return the thumb game object here
        return scene.add.circle(0, 0, 25, 0xaaaaaa, 0.3);
    }

    /*private createFireButtonGameObject(scene: Phaser.Scene): Phaser.GameObjects.GameObject {
        // Create and return the fire button game object here
        return scene.add.circle(1040, 560, 50, 0x888888, 0.3);
    }*/

    dumpJoyStickState() {
        const leftKeyDown = this._joyStick.left;
        const rightKeyDown = this._joyStick.right;
        const upKeyDown = this._joyStick.up;
        const downKeyDown = this._joyStick.down;
        const noKeyDown = this._joyStick.noKey;
    
        if (leftKeyDown) { this.dispatchJoyStickState(GameConstants.JOYSTICK_LEFT); }
        if (rightKeyDown) { this.dispatchJoyStickState(GameConstants.JOYSTICK_RIGHT); }
        if (upKeyDown) { this.dispatchJoyStickState(GameConstants.JOYSTICK_UP); }
        if (downKeyDown) { this.dispatchJoyStickState(GameConstants.JOYSTICK_DOWN); }
        if (noKeyDown) { this.dispatchJoyStickState(GameConstants.JOYSTICK_NONE); }
    }

    dumpButtonState(pointer: any) {
        this.dispatchFireButtonState(pointer.isDown ? GameConstants.FIRE_BUTTON_DOWN : GameConstants.FIRE_BUTTON_UP);
    }

    dispatchJoyStickState(action: string) {
        this._currentScene.events.emit(GameConstants.JOYSTICK_EVENT, action);
    }

    dispatchFireButtonState(action: string) {
        this._currentScene.events.emit(GameConstants.FIRE_BUTTON_EVENT, action);
    }
}
