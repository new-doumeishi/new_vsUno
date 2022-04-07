/**
 *  UNOのカードデータを扱う interface です。
 */
export interface Card {
    //カードの色
    color: string;
    //カードのファイル名(.png)
    fileName: string;
    //カードの種類（数字か、リバースか、スキップか等）
    kind: string;
    //数字カードの数字
    value: number
}