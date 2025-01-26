import * as Phaser from 'phaser';

export class TileTextComponent extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string) {
        super(scene, x, y, 'tile', 0);
        this.drawTileText(text);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setVisible(false);
    }

    protected drawTileText(text: string): void {
        console.log('Text: ' + text);
        const textArray = text.split('');
        let x = this.x;
        let delay = 0;
        const textStyle = { fontSize: '48px', fontFamily: 'Courier New', color: '#FFFFFF', align: 'center' };

        textArray.forEach((character) => {
            const textObject = new Phaser.GameObjects.Text(this.scene, x, this.y, this.getRandomCharacter(), textStyle);
            this.scene.add.existing(textObject);

            for (let j = 0; j <= 10; j++) {
                this.scene.time.addEvent({
                    delay: delay + j * 50,
                    callback: () => {
                        textObject.setText(j === 10 ? character : this.getRandomCharacter());
                    }
                });
            }

            x += textObject.width;
            delay += 50;
        });
    }

    protected getRandomCharacter(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }
}
