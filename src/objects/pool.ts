export class Pool {

    kind: string
    color: string
    value: number
    cardSprites: Phaser.GameObjects.Sprite[]
    pile: number[]
    circle: Phaser.GameObjects.Sprite
    arrow: Phaser.GameObjects.Sprite
    btnDraw: Phaser.GameObjects.Sprite;
    btnDiscard: Phaser.GameObjects.Sprite;
    btnPass: Phaser.GameObjects.Sprite;

    constructor() {
        this.kind = '';
        this.color = '';
        this.value = 0;
        this.cardSprites = [];
        this.pile = [];
        this.circle = null;
        this.arrow = null;
        this.btnDraw = null;
        this.btnDiscard = null;
        this.btnPass = null;
    }
}