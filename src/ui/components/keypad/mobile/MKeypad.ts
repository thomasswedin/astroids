import Phaser from 'phaser';

export class MKeypad extends Phaser.GameObjects.Graphics {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, { x, y });

        let joystickPlugin = scene.plugins.get('rexVirtualJoystick') as any;
        if (joystickPlugin) {
            joystickPlugin.add(scene, {
                x: x,
                y: y,
                radius: 100,
                base: this.createBaseGameObject(scene),
                thumb: this.createThumbGameObject(scene),
                // dir: '8dir',
                // forceMin: 16,
            });
        }
    }

    private createBaseGameObject(scene: Phaser.Scene): Phaser.GameObjects.GameObject {
        // Create and return the base game object here
        return scene.add.circle(0, 0, 50, 0x888888);
    }

    private createThumbGameObject(scene: Phaser.Scene): Phaser.GameObjects.GameObject {
        // Create and return the thumb game object here
        return scene.add.circle(0, 0, 25, 0xaaaaaa);
    }
}
