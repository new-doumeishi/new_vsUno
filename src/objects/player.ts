import { CurrentCard} from "../interfaces/current-card";

/**
 * プレイヤークラスです。
 * プレイヤーもしくはNPCのデータを保持します。
 */
export class Player {

    //プレイヤーの番号です。0がプレイヤー、1~3がNPC
    playerNo : number;
    //選択したカードのカード番号配列
    selectedCards : number[];
    //現在所持しているカードの配列です
    currentCard : CurrentCard;
    //プレイヤーかドウかです。true: プレイヤー、false: NPC
    isHuman : boolean;
    //プレイヤーの名前です。プレイヤーは「YOU」となります
    playerName : string;

    constructor() {
        this.playerNo = 0;
        this.selectedCards = [];
        this.currentCard = {
            numbers: [],
            sprites: [],
            selected: []
        };
        this.isHuman = false;
        this.playerName = null;
    }
}