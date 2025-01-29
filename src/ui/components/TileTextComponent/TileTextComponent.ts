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
        const textStyle = { fontSize: '28px', fontFamily: 'Hyperspace', color: '#FFFFFF', align: 'center'};

        textArray.forEach((character) => {
            const textObject = new Phaser.GameObjects.Text(this.scene, x, this.y, this.getRandomCharacter(true), textStyle);
            this.scene.add.existing(textObject);

            for (let j = 0; j <= 10; j++) {
                this.scene.time.addEvent({
                    delay: delay + j * 50,
                    callback: () => {
                        textObject.setText(j === 10 ? character : this.getRandomCharacter());
                    }
                });
            }

            x += 28;
            console.log('X: ' + x);
            delay += 50;
        });
    }

    protected getRandomCharacter(isStartCharacter: boolean = false): string {
        //How to type backslash on mac keyboard?


        const characters = isStartCharacter ? "/\\" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }
}
