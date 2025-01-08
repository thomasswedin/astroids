import Phaser from 'phaser';
import { LivesPaneShip } from './LivesPaneShip';

export class LivesPanel extends Phaser.GameObjects.Graphics {

    protected _scoreLabel!: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, { x, y });
        this.createScoreLabel();
        this.drawPanel();
    }

    public setScore(value: Number) {
        this._scoreLabel.text = value.toString();
    }

    protected drawPanel() {
        for (let i = 0; i < 2; i++) {
            const ship: Phaser.GameObjects.Sprite = new LivesPaneShip(this.scene, (i + 1) * 20, 40, "life" + i);
            this.scene.add.existing(ship);

            this.scene.physics.add.existing(this);
            this.scene.physics.world.enable(this);
        }
    }

    protected createScoreLabel() {
        this._scoreLabel = this.scene.make.text({
            x: 10,
            y: 8,
            padding: {
                left: 64,
                right: 16,
                top: 20,
                bottom: 40
                //x: 32,    // 32px padding on the left/right
                //y: 16     // 16px padding on the top/bottom
            },
            text: '00000',
            style: {
                fontSize: '22px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'left',  // 'left'|'center'|'right'|'justify'
            },
            // origin: {x: 0.5, y: 0.5},
            add: true
        });
    }
}
