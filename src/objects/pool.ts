/**
 * 場（捨て札置き場）のデータを扱う class です
 */
export class Pool {

    //場に出ているカードの種類
    kind: string
    //場に出ているカードの色
    color: string
    //場に出ているカードの数字
    value: number
    //場に出ているカードのスプライト
    cardSprites: Phaser.GameObjects.Sprite[]
    //裏向きカードの山
    pile: number[]
    //場に出ているカードの色を表す円形の画像
    circle: Phaser.GameObjects.Sprite
    //順番の流れを表す矢印の画像
    arrow: Phaser.GameObjects.Sprite
    //ドローボタン
    btnDraw: Phaser.GameObjects.Sprite;
    //ディスカード（カードを捨てるの意味）ボタン
    btnDiscard: Phaser.GameObjects.Sprite;
    //パスボタン
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