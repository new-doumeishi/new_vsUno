/**
 * Player クラスが所持する、現在のカードデータの interface です。
 */
export interface CurrentCard {
    //所持しているカードの配列です。「カード番号」はCardsオブジェクトを参照
    numbers : number[],
    //カードのスプライトの配列
    sprites : Phaser.GameObjects.Sprite[]
    //選択したカードのスプライトの配列
    selected : Phaser.GameObjects.Rectangle[]
}