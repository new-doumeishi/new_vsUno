import { CurrentCard} from "../interfaces/current-card";

export class Player {

    playerNo : number;
    selectedCards : number[];
    currentCard : CurrentCard;
    isHuman : boolean;
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