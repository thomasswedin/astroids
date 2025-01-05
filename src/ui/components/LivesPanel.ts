import Phaser from 'phaser';
import { ShipMain } from './ShipMain';

export class LivesPanel extends Phaser.GameObjects.Graphics {

    constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
        super(scene, { x, y });
        this.drawPanel();
    }

    protected drawPanel() {
        for (let i = 0; i < 2; i++) {
            const ship = new ShipMain(this.scene, (i+1) * 20, 40, "life" + i);
            ship.setScale(0.5);
            this.scene.add.existing(ship);
        }
    }
}
