import { Card } from "./interfaces/card";

export const Consts = {
    //プレイヤー人数
    NUMBER_OF_PLAYERS: 4,
    //NPC番号
    Npc: {
        NO1: 1,
        NO2: 2,
        NO3: 3,
        NAME1: 'ＮＰＣ１',
        NAME2: 'ＮＰＣ２',
        NAME3: 'ＮＰＣ３',
    },
    //カード関係の固定値
    Cards: {
        //カードの表示位置
        Location: {
            //カードが17枚以上の場合3行表示
            FIRST_LINE_START_POSITION: 17,
            //カードが8枚上の場合9行表示
            SECOND_LINE_START_POSITION: 9,
            //カードが8枚未満の場合1行表示
            THIRD_LINE_START_POSITION: 1,
            //1行の表示枚数
            MAX_NUMBER_OF_CARDS_IN_LINE: 8,
            FirstCard:{
                X_ORIGIN: 350,
                Y_ORIGIN: 700,
            },
            Pile: {
                X_ORIGIN: 350,
                Y_ORIGIN: 700,
            },
            Player: {
                X_ORIGIN: 155,
                Y_ORIGIN: 1015,
                X_MARGIN: 10,
                Y_MARGIN: 100,
            },
            Npc1: {
                X_ORIGIN: 285,
                Y_ORIGIN: 320,
                X_MARGIN: 95,
                Y_MARGIN: 5,
            },
            Npc2: {
                X_ORIGIN: 155,
                Y_ORIGIN: 190,
                X_MARGIN: 10,
                Y_MARGIN: 95,
            },
            Npc3: {
                X_ORIGIN: 785,
                Y_ORIGIN: 320,
                X_MARGIN: 95,
                Y_MARGIN: 5,
            },
        },
        Name: {
            //カードの背面の画像ファイル名
            CARD_BIHIND: 'behind_card.png',
        },
        //カードのサイズ
        Size: {
            Normal: {
                WIDTH: 70,
                HEIGHT: 90,
            },
            //場のカードは大きめに表示する
            PileCard: {
                WIDTH: 110,
                HEIGHT: 150,
            }
        },
        //全カード枚数
        TOTAL_NUMBER_OF_CARDS_IN_GAME: 108,
        //各色のカード枚数
        MAX_NUMBER_OF_EACH_COLOR: 13,
        //初期所持のカード枚数
        NUMBER_OF_START_CARDS: 7,
        //カードの色
        Color: {
            BLUE: 'b',
            GREEN: 'g',
            RED: 'r',
            YELLOW: 'y',
            PREFIXES: ['b', 'g', 'y', 'r'],
        },
        //カードの種類
        KIND: {
            NUMBER: 'number',
            REVERSE: 'reverse',
            SKIP: 'skip',
            DRAW2: 'draw2',
            DRAW4: 'draw4',
            WILD: 'wild',
        },
    },
    //フォルダーのパス
    Folder: {
        CARDS: 'assets/images/',
        BUTTON: 'assets/images/buttons/',
    },
    //画面のサイズ
    Screen: {
        WIDTH: 1000,
        HEIGHT: 1350,
        CARD_SELECT_COLOR: 0x000000,
    },
    //ボタンのファイル名と表示位置
    Button: {
        FILE_NAMES: ['btn_draw.png', 'btn_discard.png'
            , 'btn_blue.png', 'btn_red.png', 'btn_yellow.png', 'btn_green.png'
            , 'show_blue.png', 'show_red.png', 'show_yellow.png', 'show_green.png'
            , 'btn_pass.png', 'direct.png', 'inverse.png'
        ],
        BtnDraw: {
            X_ORIGIN: 320,
            Y_ORIGIN: 900,
            WIDTH: 160,
            HEIGHT: 80,
            NAME: 'btn_draw.png',
        },
        BtnDiscard: {
            X_ORIGIN: 500,
            Y_ORIGIN: 900,
            WIDTH: 160,
            HEIGHT: 80,
            NAME: 'btn_discard.png',
        },
        ShowBlue: {
            X_ORIGIN: 45,
            Y_ORIGIN: 150,
            NAME: 'show_blue.png',
        },
        ShowYellow: {
            X_ORIGIN: 45,
            Y_ORIGIN: 150,
            NAME: 'show_yellow.png',
        },
        ShowGreen: {
            X_ORIGIN: 45,
            Y_ORIGIN: 150,
            NAME: 'show_green.png',
        },
        ShowRed: {
            X_ORIGIN: 45,
            Y_ORIGIN: 150,
            NAME: 'show_red.png',
        },
        Inverse: {
            X_ORIGIN: 900,
            Y_ORIGIN: 100,
            NAME: 'inverse.png',
        },
        Direct: {
            X_ORIGIN: 900,
            Y_ORIGIN: 100,
            NAME: 'direct.png',
        }
    },
    //フォント
    Font: {
        SIZE: 50,
        NAME: 'Arial',
    },
};

export const Cards: { [index: number] : Card } = {
    0: {color:'b',value:0,fileName:'b0.png',kind:'number'
    },
    1: {color:'b',value:1,fileName:'b1_1.png',kind:'number'
    },
    2: {color:'b',value:1,fileName:'b1_2.png',kind:'number'
    },
    3: {color:'b',value:2,fileName:'b2_1.png',kind:'number'
    },
    4: {color:'b',value:2,fileName:'b2_2.png',kind:'number'
    },
    5: {color:'b',value:3,fileName:'b3_1.png',kind:'number'
    },
    6: {color:'b',value:3,fileName:'b3_2.png',kind:'number'
    },
    7: {color:'b',value:4,fileName:'b4_1.png',kind:'number'
    },
    8: {color:'b',value:4,fileName:'b4_2.png',kind:'number'
    },
    9: {color:'b',value:5,fileName:'b5_1.png',kind:'number'
    },
    10: {color:'b',value:5,fileName:'b5_2.png',kind:'number'
    },
    11: {color:'b',value:6,fileName:'b6_1.png',kind:'number'
    },
    12: {color:'b',value:6,fileName:'b6_2.png',kind:'number'
    },
    13: {color:'b',value:7,fileName:'b7_1.png',kind:'number'
    },
    14: {color:'b',value:7,fileName:'b7_2.png',kind:'number'
    },
    15: {color:'b',value:8,fileName:'b8_1.png',kind:'number'
    },
    16: {color:'b',value:8,fileName:'b8_2.png',kind:'number'
    },
    17: {color:'b',value:9,fileName:'b9_1.png',kind:'number'
    },
    18: {color:'b',value:9,fileName:'b9_2.png',kind:'number'
    },
    19: {color:'b',kind:'reverse',fileName:'breverse_1.png', value:11
    },
    20: {color:'b',kind:'reverse',fileName:'breverse_2.png', value:11
    },
    21: {color:'b',kind:'draw2',fileName:'bd2_1.png',value:12
    },
    22: {color:'b',kind:'draw2',fileName:'bd2_2.png',value:12
    },
    23: {color:'b',kind:'skip',fileName:'bskip_1.png',value:13
    },
    24: {color:'b',kind:'skip',fileName:'bskip_2.png',value:13
    },
    25: {color:'g',value:0,fileName:'g0.png',kind:'number'
    },
    26: {color:'g',value:1,fileName:'g1_1.png',kind:'number'
    },
    27: {color:'g',value:1,fileName:'g1_2.png',kind:'number'
    },
    28: {color:'g',value:2,fileName:'g2_1.png',kind:'number'
    },
    29: {color:'g',value:2,fileName:'g2_2.png',kind:'number'
    },
    30: {color:'g',value:3,fileName:'g3_1.png',kind:'number'
    },
    31: {color:'g',value:3,fileName:'g3_2.png',kind:'number'
    },
    32: {color:'g',value:4,fileName:'g4_1.png',kind:'number'
    },
    33: {color:'g',value:4,fileName:'g4_2.png',kind:'number'
    },
    34: {color:'g',value:5,fileName:'g5_1.png',kind:'number'
    },
    35: {color:'g',value:5,fileName:'g5_2.png',kind:'number'
    },
    36: {color:'g',value:6,fileName:'g6_1.png',kind:'number'
    },
    37: {color:'g',value:6,fileName:'g6_2.png',kind:'number'
    },
    38: {color:'g',value:7,fileName:'g7_1.png',kind:'number'
    },
    39: {color:'g',value:7,fileName:'g7_2.png',kind:'number'
    },
    40: {color:'g',value:8,fileName:'g8_1.png',kind:'number'
    },
    41: {color:'g',value:8,fileName:'g8_2.png',kind:'number'
    },
    42: {color:'g',value:9,fileName:'g9_1.png',kind:'number'
    },
    43: {color:'g',value:9,fileName:'g9_2.png',kind:'number'
    },
    44: {color:'g',kind:'reverse',fileName:'greverse_1.png', value:11
    },
    45: {color:'g',kind:'reverse',fileName:'greverse_2.png', value:11
    },
    46: {color:'g',kind:'draw2',fileName:'gd2_1.png',value:12
    },
    47: {color:'g',kind:'draw2',fileName:'gd2_2.png',value:12
    },
    48: {color:'g',kind:'skip',fileName:'gskip_1.png',value:13
    },
    49: {color:'g',kind:'skip',fileName:'gskip_2.png',value:13
    },
    50: {color:'r',value:0,fileName:'r0.png',kind:'number'
    },
    51: {color:'r',value:1,fileName:'r1_1.png',kind:'number'
    },
    52: {color:'r',value:1,fileName:'r1_2.png',kind:'number'
    },
    53: {color:'r',value:2,fileName:'r2_1.png',kind:'number'
    },
    54: {color:'r',value:2,fileName:'r2_2.png',kind:'number'
    },
    55: {color:'r',value:3,fileName:'r3_1.png',kind:'number'
    },
    56: {color:'r',value:3,fileName:'r3_2.png',kind:'number'
    },
    57: {color:'r',value:4,fileName:'r4_1.png',kind:'number'
    },
    58: {color:'r',value:4,fileName:'r4_2.png',kind:'number'
    },
    59: {color:'r',value:5,fileName:'r5_1.png',kind:'number'
    },
    60: {color:'r',value:5,fileName:'r5_2.png',kind:'number'
    },
    61: {color:'r',value:6,fileName:'r6_1.png',kind:'number'
    },
    62: {color:'r',value:6,fileName:'r6_2.png',kind:'number'
    },
    63: {color:'r',value:7,fileName:'r7_1.png',kind:'number'
    },
    64: {color:'r',value:7,fileName:'r7_2.png',kind:'number'
    },
    65: {color:'r',value:8,fileName:'r8_1.png',kind:'number'
    },
    66: {color:'r',value:8,fileName:'r8_2.png',kind:'number'
    },
    67: {color:'r',value:9,fileName:'r9_1.png',kind:'number'
    },
    68: {color:'r',value:9,fileName:'r9_2.png',kind:'number'
    },
    69: {color:'r',kind:'reverse',fileName:'rreverse_1.png', value:11
    },
    70: {color:'r',kind:'reverse',fileName:'rreverse_2.png', value:11
    },
    71: {color:'r',kind:'draw2',fileName:'rd2_1.png',value:12
    },
    72: {color:'r',kind:'draw2',fileName:'rd2_2.png',value:12
    },
    73: {color:'r',kind:'skip',fileName:'rskip_1.png',value:13
    },
    74: {color:'r',kind:'skip',fileName:'rskip_2.png',value:13
    },
    75: {color:'y',value:0,fileName:'y0.png',kind:'number'
    },
    76: {color:'y',value:1,fileName:'y1_1.png',kind:'number'
    },
    77: {color:'y',value:1,fileName:'y1_2.png',kind:'number'
    },
    78: {color:'y',value:2,fileName:'y2_1.png',kind:'number'
    },
    79: {color:'y',value:2,fileName:'y2_2.png',kind:'number'
    },
    80: {color:'y',value:3,fileName:'y3_1.png',kind:'number'
    },
    81: {color:'y',value:3,fileName:'y3_2.png',kind:'number'
    },
    82: {color:'y',value:4,fileName:'y4_1.png',kind:'number'
    },
    83: {color:'y',value:4,fileName:'y4_2.png',kind:'number'
    },
    84: {color:'y',value:5,fileName:'y5_1.png',kind:'number'
    },
    85: {color:'y',value:5,fileName:'y5_2.png',kind:'number'
    },
    86: {color:'y',value:6,fileName:'y6_1.png',kind:'number'
    },
    87: {color:'y',value:6,fileName:'y6_2.png',kind:'number'
    },
    88: {color:'y',value:7,fileName:'y7_1.png',kind:'number'
    },
    89: {color:'y',value:7,fileName:'y7_2.png',kind:'number'
    },
    90: {color:'y',value:8,fileName:'y8_1.png',kind:'number'
    },
    91: {color:'y',value:8,fileName:'y8_2.png',kind:'number'
    },
    92: {color:'y',value:9,fileName:'y9_1.png',kind:'number'
    },
    93: {color:'y',value:9,fileName:'y9_2.png',kind:'number'
    },
    94: {color:'y',kind:'reverse',fileName:'yreverse_1.png', value:11
    },
    95: {color:'y',kind:'reverse',fileName:'yreverse_2.png', value:11
    },
    96: {color:'y',kind:'draw2',fileName:'yd2_1.png',value:12
    },
    97: {color:'y',kind:'draw2',fileName:'yd2_2.png',value:12
    },
    98: {color:'y',kind:'skip',fileName:'yskip_1.png',value:13
    },
    99: {color:'y',kind:'skip',fileName:'yskip_2.png',value:13
    },
    100: {color:'*',kind:'draw4',fileName:'d4_1.png', value:14
    },
    101: {color:'*',kind:'draw4',fileName:'d4_2.png', value:14
    },
    102: {color:'*',kind:'draw4',fileName:'d4_3.png', value:14
    },
    103: {color:'*',kind:'draw4',fileName:'d4_4.png', value:14
    },
    104: {color:'*',kind:'wild',fileName:'wild_1.png', value:15
    },
    105: {color:'*',kind:'wild',fileName:'wild_2.png', value:15
    },
    106: {color:'*',kind:'wild',fileName:'wild_3.png', value:15
    },
    107: {color:'*',kind:'wild',fileName:'wild_4.png', value:15
    },
}

export const IS_IPAD = function(){
    if(navigator.userAgent.indexOf('Mac OS X') > -1
        && navigator.userAgent.indexOf('iPhone') == -1
    ) {
        return true;
    }
    return false;
};

export const IS_IPHONE = function(){
    if(navigator.userAgent.indexOf('iPhone') > -1){
        return true;
    }
    return false;
};








