import Phaser from 'phaser';
import { LivesPanelShip } from './LivesPanelShip';

export class LivesPanel extends Phaser.GameObjects.Graphics {

    protected _scoreLabel!: Phaser.GameObjects.Text;
    protected _livesGroup!: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, { x, y });
        this.createScoreLabel();
    }

    public setScore(value: Number) {
        this._scoreLabel.text = value.toString();
    }

    public setLives(lives: number) {
        this.drawLives(lives);
    }

    protected drawLives(lives: number) {

        if (this._livesGroup) {
            //Remove all children in this._livesGroup and from scene
            this._livesGroup.clear(true, true);
        } else {
            this._livesGroup = this.scene.add.group();
        }

        // Add the lives sprites to the group
        for (let i = 0; i < lives; i++) {
            const ship: Phaser.GameObjects.Sprite = new LivesPanelShip(this.scene, (i + 1) * 20, 40, "life" + i);
            this._livesGroup.add(ship);
            this.scene.add.existing(ship); // Add each ship to the scene
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
            text: '',
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
