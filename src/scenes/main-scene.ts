import { Player } from '../objects/player';
import { Pool } from '../objects/pool';
import { Consts, Cards, IS_IPHONE, IS_IPAD} from '../consts';

export class MainScene extends Phaser.Scene {

  //UNO参加プレイヤー（0がプレイヤー、1~3がNPC)
  private players: Player[];
  //場（捨て札置き場）
  private pool: Pool;
  //現在処理中のプレイヤー
  private currentPlayer: number;
  //リバース中か
  private isReverse: boolean;
  //スキップ中か
  private isSkip: boolean;
  //ドロー２か
  private isDraw2: boolean;
  //ワイルドか
  private isWild: boolean;
  //ドロー４か
  private isDraw4: boolean;
  //ドロー２、４の被プレイヤー
  private drawTarget: number;
  //あなた
  private YOU: Player;
  private NPC1: Player;
  private NPC2: Player;
  private NPC3: Player;
  private selectedSprites: Phaser.GameObjects.Sprite[];

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.initialize();
    this.loadImages();
    this.setBackGroundColor();
    this.dealOutCards();
    this.shufflePile();
    this.randomOrder();
    this.setPlayers();
  }

  create(): void {

    if(IS_IPAD()){
      this.cameras.main.setZoom(1,0.4);
    } else if(IS_IPHONE()){
      this.cameras.main.setZoom(0.90);
    }
    this.getCookie();
    this.showPile();
    this.showNpcNames();
    this.showYourCards(true);
    this.showNpcCards();
    this.showFirstPlayerText();
    this.showFirstCard();
  }

  afterDiscard(someone: Player): void {
    var Scene = this;
    if(Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.NUMBER){
      this.whoIsNext();
    } else if(Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.REVERSE){
      this.isReverse = !this.isReverse;
      this.whoIsNext();
    } else if(Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.SKIP){
      this.isSkip = true;
      this.whoIsNext();
    } else if(Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.DRAW2){
      this.isDraw2 = true;
      this.whoIsNext();
      this.giveDraw().then(function(result){
        Scene.yourNextProcess().then(function(){
          if(0 >= Scene.YOU.currentCard.numbers.length){
            Scene.youWin();
          } else {
            Scene.processOrder();
          }
        });
      });
      return;
    } else if(Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.WILD){
      this.isWild = true;
    } else if(Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.DRAW4){
      this.isDraw4 = true;
    }

    if(this.isWild || this.isDraw4) {
      this.selectColor();
    } else {
      this.yourNextProcess().then(function(result){
        if(0 >= Scene.YOU.currentCard.numbers.length){
          Scene.youWin();
        } else {
          Scene.processOrder();
        }
      });
    }
  }

  afterDiscardNpc(npc: Player): void {
    var Scene = this;
    if(Cards[npc.selectedCards[0]].kind === Consts.Cards.KIND.NUMBER){
      this.whoIsNext();
    } else if(Cards[npc.selectedCards[0]].kind === Consts.Cards.KIND.REVERSE){
      this.isReverse = !this.isReverse;
      this.whoIsNext();
    } else if(Cards[npc.selectedCards[0]].kind === Consts.Cards.KIND.SKIP){
      this.isSkip = true;
      this.whoIsNext();
    } else if(Cards[npc.selectedCards[0]].kind === Consts.Cards.KIND.DRAW2){
      this.isDraw2 = true;
      this.whoIsNext();
      this.giveDraw().then(function(result){
        Scene.npcCardDecrease(npc);
        Scene.showNpcCards();
        if(0 >= npc.currentCard.numbers.length){
          Scene.npcWin(npc);
        } else {
          Scene.processOrder();
        }
      });
      return;
    } else if(Cards[npc.selectedCards[0]].kind === Consts.Cards.KIND.WILD){
      this.isWild = true;
    } else if(Cards[npc.selectedCards[0]].kind === Consts.Cards.KIND.DRAW4){
      this.isDraw4 = true;
    }

    this.updatePoolData(Cards[npc.selectedCards[0]]);
    this.npcCardDecrease(npc);
    
    if(this.isWild || this.isDraw4){
      this.whoIsNext();
      this.selectColorForNpc(npc);
    } else {
      this.showNpcCards();
      if(0 >= npc.currentCard.numbers.length){
        this.npcWin(npc);
      } else {
        this.processOrder();
      }
    }
  }
  
  cardValidate(someone: Player)
  {
    //カードが2枚以上選択されている場合はエラー
    if(1 < someone.selectedCards.length){
      return false;
    }

    if(this.pool.value !== 99){
      if((Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.NUMBER
              && this.pool.kind === Consts.Cards.KIND.NUMBER
              && this.pool.value !== Cards[someone.selectedCards[0]].value)
          &&
          (Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.NUMBER
              && this.pool.kind === Consts.Cards.KIND.NUMBER
              && this.pool.color !== Cards[someone.selectedCards[0]].color)){
        return false;
      } else {
        //スキップ、リバース、draw2の場合で、場の種類と色も違う場合
        if((Cards[someone.selectedCards[0]].kind !== Consts.Cards.KIND.WILD
            && Cards[someone.selectedCards[0]].kind !== Consts.Cards.KIND.DRAW4
        )){
          if(Cards[someone.selectedCards[0]].kind !== this.pool.kind
              && Cards[someone.selectedCards[0]].color !== this.pool.color
          ){
            return false;
          }
        }
      }
    } else {
      if((Cards[someone.selectedCards[0]].kind === Consts.Cards.KIND.NUMBER
          && this.pool.kind === Consts.Cards.KIND.NUMBER
          && this.pool.color !== Cards[someone.selectedCards[0]].color)){
        return false;
      } else {
        //スキップ、リバース、draw2の場合で、場の種類と色も違う場合
        if((Cards[someone.selectedCards[0]].kind !== Consts.Cards.KIND.WILD
            && Cards[someone.selectedCards[0]].kind !== Consts.Cards.KIND.DRAW4
        )){
          if(Cards[someone.selectedCards[0]].kind !== this.pool.kind
              && Cards[someone.selectedCards[0]].color !== this.pool.color
          ){
            return false;
          }
        }
      }
    }

    return true;
  }

  createDiscardButton(): void {
    var btnDiscard = this.add.sprite(Consts.Button.BtnDiscard.X_ORIGIN
        ,Consts.Button.BtnDiscard.Y_ORIGIN
        ,Consts.Button.BtnDiscard.NAME
    ).setInteractive();
    btnDiscard.setOrigin(0,0);
    btnDiscard.displayWidth = Consts.Button.BtnDiscard.WIDTH;
    btnDiscard.displayHeight = Consts.Button.BtnDiscard.HEIGHT;
    var Scene = this;
    btnDiscard.on('pointerdown', function(pointer: Phaser.GameObjects.Sprite){
      if(Scene.cardValidate(Scene.YOU) === false){
        Scene.youCannot();
        return;
      }
      this.disableInteractive();
      Scene.updatePoolData(Cards[Scene.YOU.selectedCards[0]]);
      Scene.showDiscard(Scene.YOU);
    });
    Scene.pool.btnDiscard = btnDiscard;
  }

  createDrawButton(): void {
    var btnDraw = this.add.sprite(Consts.Button.BtnDraw.X_ORIGIN
        ,Consts.Button.BtnDraw.Y_ORIGIN
        ,Consts.Button.BtnDraw.NAME
    ).setInteractive();
    btnDraw.setOrigin(0,0);
    btnDraw.displayWidth = Consts.Button.BtnDraw.WIDTH;
    btnDraw.displayHeight = Consts.Button.BtnDraw.HEIGHT;
    var Scene = this;
    btnDraw.on('pointerdown', function(pointer: Phaser.GameObjects.Sprite){
      this.disableInteractive();
      Scene.drawCardFromPile(Scene.YOU);
      Scene.showYourCards(true);
      this.setVisible(false);
      Scene.createPassButton();
    });
    Scene.pool.btnDraw = btnDraw;
  }

  createPassButton(): void
  {
    var btnPass = this.add.sprite(Consts.Button.BtnDraw.X_ORIGIN
        ,Consts.Button.BtnDraw.Y_ORIGIN
        ,'btn_pass.png'
    ).setInteractive();
    btnPass.setOrigin(0,0);
    btnPass.displayWidth = Consts.Button.BtnDraw.WIDTH;
    btnPass.displayHeight = Consts.Button.BtnDraw.HEIGHT;
    var Scene = this;
    btnPass.on('pointerdown', function(pointer: Phaser.GameObjects.Sprite){
      this.disableInteractive();
      Scene.whoIsNext();
      Scene.yourNextProcess(true).then(function(){
        Scene.processOrder();
      })
    });
    Scene.pool.btnPass = btnPass;
  }

  /**
   * 各プレイヤーへカードの配布（グラフィックの更新は別処理）
   */
  dealOutCards() : void {
    var l;
    for(var i = 0; i < this.players.length; i++){

      for(var k = 0; k < Consts.Cards.NUMBER_OF_START_CARDS; k++){
        l = i;

        //各プレイヤーの所持カードを調査し、プレイヤー達が持っていないカードになるまで乱数を作り続ける
        while(true){
          var random = Math.floor(Math.random() * Consts.Cards.TOTAL_NUMBER_OF_CARDS_IN_GAME);
          if( this.players[0].currentCard.numbers.includes(random) === false
              && this.players[1].currentCard.numbers.includes(random) === false
              && this.players[2].currentCard.numbers.includes(random) === false
              && this.players[3].currentCard.numbers.includes(random) === false
          ) {
            this.players[l].currentCard.numbers.push(random);
            break;
          }
        }
        l++;
        if(l >= this.players.length){
          l = 0;
        }
      }

      //配布したカードのソート
      this.players[i].currentCard.numbers.sort(function(left:number, right:number){
        var l = Cards[left].value;
        var r = Cards[right].value;
        return l - r;
      });
    }
  }

  destroyNpcCardSprites(): void
  {
    var npcs = [this.NPC1, this.NPC2, this.NPC3];
    for(var i = 0; i < npcs.length; i++){
      for(var k = 0; k < npcs[i].currentCard.sprites.length;k++){
        npcs[i].currentCard.sprites[k].destroy();
      }
      npcs[i].currentCard.sprites = [];
    }
  }

  drawCardFromPile(someone: Player): void {
    if ((this.pool.pile.length - 1) < 0) {
      this.shufflePile();
    }
    someone.currentCard.numbers.push(this.pool.pile[0]);
    this.pool.pile.splice(0, 1);
  }

  async giveDraw(): Promise<string> {
    var drawNumber = 0;
    if(this.isDraw4) {
      drawNumber = 4;
    } else if(this.isDraw2){
      drawNumber = 2;
    }
    if(0 > (this.pool.pile.length-drawNumber)) {
      this.shufflePile();
    }

    for(var i = 0; i < drawNumber; i++){
      this.players[this.drawTarget].currentCard.numbers.push(this.pool.pile[i]);
    }
    this.pool.pile.splice(0, drawNumber);
    this.isDraw2 = false;

    if(this.players[this.drawTarget].isHuman){
      var text;
      if(this.isDraw4){
        text = 'ドロー４';
      } else {
        text = 'ドロー２';
      }
      var message = this.add.text(350,400, text + 'をくらった！')
          .setOrigin(0,0).setFontSize(35);
      setTimeout(function(){
        message.destroy();
      },1500);
    }
    this.showNpcCards();
    this.showYourCards(false);
    return new Promise(function(resolve: CallableFunction){
      resolve();
    });
  }

  getCookie()
  {
console.log("---1");
    var cookie = document.cookie;
    var win : string　= '0';
    var lose : string = '0';
    if(!cookie){
      cookie = 'win=0&lose=0';
      win = '0';
      lose = '0';
      document.cookie=cookie+'max-age: 315360000';
    } else {
      win = '0';
      lose = '0';

      var buf = cookie.split(';');
      for(var k = 0; k < buf.length;k++){
        if(buf[k].indexOf('win=') !== -1){
          var temp = buf[k].split('&');
          for(var i = 0; i < temp.length; i++){
            var temp2 = temp[i].split('=');
            if(temp2[0] == 'win'){
              win = temp2[1];
            } else if(temp2[0] == 'lose'){
              lose = temp2[1];
            }
          }
        }
      }
    }
console.log("---2");
    document.cookie='win='+win+'&lose='+lose+';'+'max-age: 315360000';
    this.add.text(5, 1200, 'win :' + win).setFontSize(25);
    this.add.text(5, 1230, 'lose:' + lose).setFontSize(25);
  }

  initialize(): void {
    this.players = [];
    for(var i = 0; i < Consts.NUMBER_OF_PLAYERS; i++){
      this.players.push(new Player());
      this.players[i].playerNo = i;
      if(i === 0){
        this.players[i].isHuman = true;
      } else {
        this.players[i].isHuman = false;
      }
    }
    this.pool = new Pool();
    this.currentPlayer = 0;
    this.isReverse = false;
    this.isSkip = false;
    this.isDraw2 = false;
    this.isWild = false;
    this.isDraw4 = false;
    this.drawTarget = 0;
    this.selectedSprites = [];
  }

  loadImages(): void {
    var colors = Consts.Cards.Color.PREFIXES;
    for(var i = 0; i < colors.length; i++) {
      for(var k = 0; k < 10; k++){
        if(k === 0){
          this.load.image(colors[i]+'0.png', Consts.Folder.CARDS+colors[i]+k+'.png');
        } else if(1 <= k && k <= 9){
          this.load.image(colors[i]+k+'_1.png', Consts.Folder.CARDS+colors[i]+k+'_1.png');
          this.load.image(colors[i]+k+'_2.png', Consts.Folder.CARDS+colors[i]+k+'_2.png');
        }
      }
      this.load.image(colors[i]+'reverse_1.png', Consts.Folder.CARDS+colors[i]+'reverse_1.png');
      this.load.image(colors[i]+'reverse_2.png', Consts.Folder.CARDS+colors[i]+'reverse_2.png');
      this.load.image(colors[i]+'skip_1.png', Consts.Folder.CARDS+colors[i]+'skip_1.png');
      this.load.image(colors[i]+'skip_2.png', Consts.Folder.CARDS+colors[i]+'skip_2.png');
      this.load.image(colors[i]+'d2_1.png', Consts.Folder.CARDS+colors[i]+'d2_1.png');
      this.load.image(colors[i]+'d2_2.png', Consts.Folder.CARDS+colors[i]+'d2_2.png');
    }
    this.load.image('d4_1.png', Consts.Folder.CARDS+'d4_1.png');
    this.load.image('d4_2.png', Consts.Folder.CARDS+'d4_2.png');
    this.load.image('d4_3.png', Consts.Folder.CARDS+'d4_3.png');
    this.load.image('d4_4.png', Consts.Folder.CARDS+'d4_4.png');
    this.load.image('wild_1.png', Consts.Folder.CARDS+'wild_1.png');
    this.load.image('wild_2.png', Consts.Folder.CARDS+'wild_2.png');
    this.load.image('wild_3.png', Consts.Folder.CARDS+'wild_3.png');
    this.load.image('wild_4.png', Consts.Folder.CARDS+'wild_4.png');
    this.load.image(Consts.Cards.Name.CARD_BIHIND, Consts.Folder.CARDS+Consts.Cards.Name.CARD_BIHIND);

    for(var i = 0; i < Consts.Button.FILE_NAMES.length; i++) {
      this.load.image(Consts.Button.FILE_NAMES[i], Consts.Folder.BUTTON+ Consts.Button.FILE_NAMES[i]);
    }
  }

  npcCardCheck(npc: Player): boolean {
    for (var i = 0; i < npc.currentCard.numbers.length; i++) {
      npc.selectedCards[0] = npc.currentCard.numbers[i];
      if (this.cardValidate(npc) === false) {
        continue;
      } else {
        return true;
      }
    }
    return false;
  }

  npcCardDecrease(npc: Player): void {
    var position = npc.currentCard.numbers.indexOf(npc.selectedCards[0]);
    npc.currentCard.numbers.splice(position, 1);
    npc.selectedCards = [];
  }

  npcThink(npc: Player) {
    //出せるカードが有った
    if (this.npcCardCheck(npc)) {
      this.updatePoolData(Cards[npc.selectedCards[0]]);
      this.showDiscard(npc);
      return;
      //カードを引く
    } else {
      this.drawCardFromPile(npc);
      this.showNpcCards();
      if (this.npcCardCheck(npc)) {
        this.updatePoolData(Cards[npc.selectedCards[0]]);
        this.showDiscard(npc);
      } else {
        this.showNpcPass(npc);
      }
    }
  }

  npcWin(someone: Player)
  {
    var cookie = document.cookie;
    var win : number;
    var lose : number;

    var buf = cookie.split(';');
    for(var k = 0; k < buf.length;k++){
      if(buf[k].indexOf('win=') !== -1){
        var temp = buf[k].split('&');
        for(var i = 0; i < temp.length; i++){
          var temp2 = temp[i].split('=');
          if(temp2[0] == 'win'){
            win = parseInt(temp2[1]);
          } else if(temp2[0] == 'lose'){
            lose = parseInt(temp2[1]);
          }
        }
      }
    }
    lose++;
    document.cookie = 'win='+win+'&lose='+lose+';max-age=315360000';

    var wint = this.add.text(400, 600, someone.playerName + 'が勝利').setFontSize(35);
    wint.setOrigin(0,0);
    this.add.tween({
      targets: wint,
      y: 300,
      duration: 3000,
      ease: 'Power3',
      onComplete: function(a,b){
        document.location.reload();
      }
    });
  }

  processOrder(): void {
    var player = this.players[this.currentPlayer];
    if(player.isHuman){
      this.showButtons();
    } else {
      this.npcThink(player);
    }
  }

  randomOrder(): void {
    var target = Math.floor(Math.random() * Consts.NUMBER_OF_PLAYERS)
    var order;
    switch (target) {
      case 0:
        order = [0, 1, 2, 3];
        break;
      case 1:
        order = [1, 2, 3, 0];
        break;
      case 2:
        order = [2, 3, 0, 1];
        break;
      case 3:
        order = [3, 0, 1, 2];
        break;
    }

    var temp = [];
    for(var i = 0; i < order.length; i++){
      for(var k = 0; k < this.players.length; k++){
        if(this.players[k].playerNo == order[i]){
          temp.push(this.players[k]);
        }
      }
    }
    this.players = temp;
  }
  
  setPlayers(): void {
    for(var i = 0; i < this.players.length; i++) {
      if (this.players[i].isHuman) {
        this.YOU = this.players[i];
        this.players[i].playerName = 'ＹＯＵ';
      } else if (this.players[i].playerNo == Consts.Npc.NO1) {
        this.NPC1 = this.players[i];
        this.players[i].playerName = Consts.Npc.NAME1;
      } else if (this.players[i].playerNo == Consts.Npc.NO2) {
        this.NPC2 = this.players[i];
        this.players[i].playerName = Consts.Npc.NAME2;
      } else if (this.players[i].playerNo == Consts.Npc.NO3) {
        this.NPC3 = this.players[i];
        this.players[i].playerName = Consts.Npc.NAME3;
      }
    }
  }
  
  setBackGroundColor(): void {
    var graphics = this.add.graphics();
    graphics.fillGradientStyle(0x4b0082, 0x4b0082, 0xdda0dd, 0xdda0dd, 1);
    graphics.fillRect(0, 0, Consts.Screen.WIDTH, Consts.Screen.HEIGHT);
  }

  selectColor()
  {
    var btnRed = this.add.sprite(400, 600, 'btn_red.png').setInteractive();
    var btnBlue = this.add.sprite(490, 600, 'btn_blue.png').setInteractive();
    var btnYellow = this.add.sprite(400, 650, 'btn_yellow.png').setInteractive();
    var btnGreen = this.add.sprite(490, 650, 'btn_green.png').setInteractive();
    btnRed.setOrigin(0,0);
    btnBlue.setOrigin(0,0);
    btnYellow.setOrigin(0,0);
    btnGreen.setOrigin(0,0);
    var Scene = this;
    btnRed.on('pointerdown', function(pointer: Phaser.GameObjects.Sprite){
      Scene.pool.color = Consts.Cards.Color.RED;
      Scene.updateCurrentColor();
      Scene.pool.value = 99;
      btnRed.destroy();
      btnBlue.destroy()
      btnYellow.destroy();
      btnGreen.destroy();
      Scene.whoIsNext();
      if(Scene.isDraw4){
console.log("---a");
        Scene.giveDraw().then(function(result){
          Scene.isDraw4 = false;
          Scene.isWild = false;
console.log("---b");
          Scene.yourNextProcess().then(function(){
            Scene.processOrder();
          });
        });
      } else {
        Scene.isDraw4 = false;
        Scene.isWild = false;
        Scene.yourNextProcess().then(function(){
          Scene.processOrder();
        });
      }
    });
    btnBlue.on('pointerdown', function(pointer: Phaser.GameObjects.Sprite){
      Scene.pool.color = Consts.Cards.Color.BLUE;
      Scene.updateCurrentColor();
      Scene.pool.value = 99;
      btnRed.destroy();
      btnBlue.destroy()
      btnYellow.destroy();
      btnGreen.destroy();
      Scene.whoIsNext();
      if(Scene.isDraw4){
        console.log("---a");
        Scene.giveDraw().then(function(result){
          Scene.isDraw4 = false;
          Scene.isWild = false;
          console.log("---b");
          Scene.yourNextProcess().then(function(){
            Scene.processOrder();
          });
        });
      } else {
        Scene.isDraw4 = false;
        Scene.isWild = false;
        Scene.yourNextProcess().then(function(){
          Scene.processOrder();
        });
      }
    });
    btnYellow.on('pointerdown', function(pointer: Phaser.GameObjects.Sprite){
      Scene.pool.color = Consts.Cards.Color.YELLOW;
      Scene.updateCurrentColor();
      Scene.pool.value = 99;
      btnRed.destroy();
      btnBlue.destroy()
      btnYellow.destroy();
      btnGreen.destroy();
      Scene.whoIsNext();
      if(Scene.isDraw4){
        console.log("---a");
        Scene.giveDraw().then(function(result){
          Scene.isDraw4 = false;
          Scene.isWild = false;
          console.log("---b");
          Scene.yourNextProcess().then(function(){
            Scene.processOrder();
          });
        });
      } else {
        Scene.isDraw4 = false;
        Scene.isWild = false;
        Scene.yourNextProcess().then(function(){
          Scene.processOrder();
        });
      }
    });
    btnGreen.on('pointerdown', function(pointer: Phaser.GameObjects.Sprite){
      Scene.pool.color = Consts.Cards.Color.GREEN;
      Scene.updateCurrentColor();
      Scene.pool.value = 99;
      btnRed.destroy();
      btnBlue.destroy()
      btnYellow.destroy();
      btnGreen.destroy();
      Scene.whoIsNext();
      if(Scene.isDraw4){
        console.log("---a");
        Scene.giveDraw().then(function(result){
          Scene.isDraw4 = false;
          Scene.isWild = false;
          console.log("---b");
          Scene.yourNextProcess().then(function(){
            Scene.processOrder();
          });
        });
      } else {
        Scene.isDraw4 = false;
        Scene.isWild = false;
        Scene.yourNextProcess().then(function(){
          Scene.processOrder();
        });
      }
    });
  }

  selectColorForNpc(npc: Player): void
  {
    var random = Math.floor(Math.random() * 4);
    var color;
    switch(random){
      case 0:
        color = 'b';
        break;
      case 1:
        color = 'r';
        break;
      case 2:
        color = 'y';
        break;
      case 3:
        color = 'g';
        break;
    }
    this.pool.color = color;
    this.updateCurrentColor();
    this.pool.value = 99;
    var Scene = this;
    if(this.isDraw4){
      this.giveDraw().then(function(result){
        Scene.isDraw4 = false;
        Scene.isWild = false;
        Scene.showNpcCards();
        if(0 >= npc.currentCard.numbers.length){
          Scene.npcWin(npc);
        } else {
          Scene.processOrder();
        }
      });
    } else {
      Scene.isWild = false;
      Scene.showNpcCards();
      if(0 >= npc.currentCard.numbers.length){
        Scene.npcWin(npc);
      } else {
        Scene.processOrder();
      }
    }
  }

  showButtons(): void {
    this.createDrawButton();
    this.createDiscardButton();
    this.showYourCards(true)
  }

  showNpcPass(npc: Player)
  {
    var someoneName = this.add.text(400, 5, npc.playerName).setFontSize(35);
    var pass = this.add.text(400, 5, 'パス').setFontSize(35);
    someoneName.setOrigin(0,0);
    pass.setOrigin(0, 0);
    var Scene = this;
    this.add.tween({
      targets: someoneName,
      y: 600,
      duration: 1500,
      ease: 'Power3',
      onComplete: function(a, b){
        someoneName.destroy();
      }
    });
    this.add.tween({
      targets: pass,
      y: 650,
      duration: 1500,
      ease: 'Power3',
      onComplete: function(a, b){
        pass.destroy();
        Scene.whoIsNext();
        Scene.processOrder();
      }
    });
  }

  showDiscard(someone: Player)
  {
    var discard;
    discard = someone.selectedCards[0];
    var card = this.add.sprite(500, 5, Cards[discard].fileName);
    var someoneName = this.add.text(400, 5, someone.playerName).setFontSize(35);
    card.setOrigin(0,0);
    someoneName.setOrigin(0,0);
    card.displayHeight = Consts.Cards.Size.PileCard.HEIGHT;
    card.displayWidth = Consts.Cards.Size.PileCard.WIDTH;
    this.add.tween({
      targets: someoneName,
      y: 600,
      duration: 1500,
      ease: 'Power3',
      onComplete: function(a, b){
        someoneName.destroy();
      }
    });
    var Scene = this;
    this.add.tween({
      targets: card,
      y: 700,
      duration: 1500,
      ease: 'Power3',
      onComplete: function(a,b){
        if(0 < Scene.pool.cardSprites.length){
          Scene.pool.cardSprites[0].destroy();
        }
        Scene.pool.cardSprites = [];
        Scene.pool.cardSprites.push(card);
        if(someone.isHuman){
          Scene.afterDiscard(someone);
        } else {
          Scene.afterDiscardNpc(someone);
        }
      }
    });
  }

  showFirstPlayerText()
  {
    var firstText = this.add.text(300,350, this.players[0].playerName + "からスタートです").setFontSize(30);
    setTimeout(function(){
      firstText.destroy();
    }, 1500);
  }

  showFirstCard() : void {
    var firstCard : number = 0;
    var i = 0;
    for(; i < this.pool.pile.length; i++){
      if(Cards[this.pool.pile[i]].kind === Consts.Cards.KIND.NUMBER){
        firstCard = this.pool.pile[i];
        break;
      }
    }
    this.pool.pile.splice(i,1);
    var card = this.add.sprite(500, 5, Cards[firstCard].fileName);
    card.setOrigin(0,0);
    card.displayHeight = Consts.Cards.Size.PileCard.HEIGHT;
    card.displayWidth = Consts.Cards.Size.PileCard.WIDTH;
    this.pool.cardSprites.push(card);
    var Scene = this;
    this.add.tween({
      targets: card,
      y: Consts.Cards.Location.FirstCard.Y_ORIGIN,
      duration: 2000,
      ease: 'Power3',
      onComplete: function(a,b){
        Scene.updatePoolData(Cards[firstCard]);
        Scene.processOrder();
      }
    });
  }

  showNpcNames(): void {
    this.add.text(5, 290, Consts.Npc.NAME1).setFont(Consts.Font.NAME).setFontSize(30);
    this.add.text(35, 5, Consts.Npc.NAME2).setFont(Consts.Font.NAME).setFontSize(30);
    this.add.text(780, 290, Consts.Npc.NAME3).setFont(Consts.Font.NAME).setFontSize(30);
  }

  showNpcCards(): void {
    this.destroyNpcCardSprites();
    var npcs = [this.NPC1, this.NPC2, this.NPC3];
    for(var i = 0; i < npcs.length;i++)
    {
      for(var k = 0; k < npcs[i].currentCard.numbers.length; k++){
        var x = 0;
        var y = 0;
        var sprite : Phaser.GameObjects.Sprite;
        if(Consts.Cards.Location.FIRST_LINE_START_POSITION <= npcs[i].currentCard.numbers.length) {
          if(16 <= k){
            if(npcs[i].playerNo === Consts.Npc.NO1){
              x = Consts.Cards.Location.Npc1.X_ORIGIN
              y = Consts.Cards.Location.Npc1.Y_ORIGIN + ((k-16) * Consts.Cards.Size.Normal.WIDTH) + ((k-16) * Consts.Cards.Location.Npc1.Y_MARGIN);
            } else if(npcs[i].playerNo === Consts.Npc.NO2){
              x = Consts.Cards.Location.Npc2.X_ORIGIN + ((k-16) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Npc2.X_MARGIN * (k-16))
              y = Consts.Cards.Location.Npc2.Y_ORIGIN;
            } else if(npcs[i].playerNo === Consts.Npc.NO3){
              x = Consts.Cards.Location.Npc3.X_ORIGIN
              y = Consts.Cards.Location.Npc3.Y_ORIGIN + ((k-16) * Consts.Cards.Size.Normal.WIDTH) + ((k-16) * Consts.Cards.Location.Npc3.Y_MARGIN);
            }
            sprite = this.add.sprite(x, y, Consts.Cards.Name.CARD_BIHIND);
          } else if(8 <= k){
            if(npcs[i].playerNo === Consts.Npc.NO1){
              x = Consts.Cards.Location.Npc1.X_ORIGIN - Consts.Cards.Size.Normal.HEIGHT;
              y = Consts.Cards.Location.Npc1.Y_ORIGIN + ((k-8) * Consts.Cards.Size.Normal.WIDTH) + ((k-8) * Consts.Cards.Location.Npc1.Y_MARGIN);
            } else if(npcs[i].playerNo === Consts.Npc.NO2){
              x = Consts.Cards.Location.Npc2.X_ORIGIN + ((k-8) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Npc2.X_MARGIN * (k-8))
              y = Consts.Cards.Location.Npc2.Y_ORIGIN - Consts.Cards.Location.Npc2.Y_MARGIN;
            } else if(npcs[i].playerNo === Consts.Npc.NO3){
              x = Consts.Cards.Location.Npc3.X_ORIGIN + Consts.Cards.Size.Normal.HEIGHT;
              y = Consts.Cards.Location.Npc3.Y_ORIGIN + ((k-8) * Consts.Cards.Size.Normal.WIDTH) + ((k-8) * Consts.Cards.Location.Npc3.Y_MARGIN);
            }
            sprite = this.add.sprite(x, y, Consts.Cards.Name.CARD_BIHIND);
          } else {
            if(npcs[i].playerNo === Consts.Npc.NO1){
              x = Consts.Cards.Location.Npc1.X_ORIGIN - (Consts.Cards.Size.Normal.HEIGHT * 2);
              y = Consts.Cards.Location.Npc1.Y_ORIGIN + ((Consts.Cards.Size.Normal.WIDTH * k) + (Consts.Cards.Location.Npc1.Y_MARGIN * k));
            } else if(npcs[i].playerNo === Consts.Npc.NO2){
              x = Consts.Cards.Location.Npc2.X_ORIGIN + ((k) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Npc2.X_MARGIN * (k))
              y = Consts.Cards.Location.Npc2.Y_ORIGIN - Consts.Cards.Location.Npc2.Y_MARGIN * 2;
            } else if(npcs[i].playerNo === Consts.Npc.NO3){
              x = Consts.Cards.Location.Npc3.X_ORIGIN + ((Consts.Cards.Size.Normal.HEIGHT * 2) + Consts.Cards.Location.Npc3.Y_MARGIN);
              y = Consts.Cards.Location.Npc3.Y_ORIGIN + ((Consts.Cards.Size.Normal.WIDTH * k) + (Consts.Cards.Location.Npc3.Y_MARGIN * k));
            }
            sprite = this.add.sprite(x, y, Consts.Cards.Name.CARD_BIHIND);
          }
        } else if(Consts.Cards.Location.SECOND_LINE_START_POSITION <= npcs[i].currentCard.numbers.length) {
          if(8 <= k){
            if(npcs[i].playerNo === Consts.Npc.NO1){
              x = Consts.Cards.Location.Npc1.X_ORIGIN - Consts.Cards.Size.Normal.HEIGHT;
              y = Consts.Cards.Location.Npc1.Y_ORIGIN + ((k-8) * Consts.Cards.Size.Normal.WIDTH) + ((k-8) * Consts.Cards.Location.Npc1.Y_MARGIN);
            } else if(npcs[i].playerNo === Consts.Npc.NO2){
              x = Consts.Cards.Location.Npc2.X_ORIGIN + ((k-8) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Npc2.X_MARGIN * (k-8))
              y = Consts.Cards.Location.Npc2.Y_ORIGIN;
            } else if(npcs[i].playerNo === Consts.Npc.NO3){
              x = Consts.Cards.Location.Npc3.X_ORIGIN + Consts.Cards.Size.Normal.HEIGHT
              y = Consts.Cards.Location.Npc3.Y_ORIGIN + ((k-8) * Consts.Cards.Size.Normal.WIDTH) + ((k-8) * Consts.Cards.Location.Npc3.Y_MARGIN);
            }
            sprite = this.add.sprite(x, y, Consts.Cards.Name.CARD_BIHIND);
          } else {
            if(npcs[i].playerNo === Consts.Npc.NO1){
              x = Consts.Cards.Location.Npc1.X_ORIGIN - (Consts.Cards.Size.Normal.HEIGHT*2);
              y = Consts.Cards.Location.Npc1.Y_ORIGIN + ((k) * Consts.Cards.Size.Normal.WIDTH) + ((k) * Consts.Cards.Location.Npc1.Y_MARGIN);
            } else if(npcs[i].playerNo === Consts.Npc.NO2){
              x = Consts.Cards.Location.Npc2.X_ORIGIN + ((k) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Npc2.X_MARGIN * (k))
              y = Consts.Cards.Location.Npc2.Y_ORIGIN - Consts.Cards.Location.Npc2.Y_MARGIN;
            } else if(npcs[i].playerNo === Consts.Npc.NO3){
              x = Consts.Cards.Location.Npc3.X_ORIGIN + (Consts.Cards.Size.Normal.HEIGHT*2);
              y = Consts.Cards.Location.Npc3.Y_ORIGIN + ((k) * Consts.Cards.Size.Normal.WIDTH) + ((k) * Consts.Cards.Location.Npc3.Y_MARGIN);
            }
            sprite = this.add.sprite(x, y, Consts.Cards.Name.CARD_BIHIND);
          }
        } else {
          if(npcs[i].playerNo === Consts.Npc.NO1){
            x = Consts.Cards.Location.Npc1.X_ORIGIN - Consts.Cards.Size.Normal.HEIGHT*2;
            y = Consts.Cards.Location.Npc1.Y_ORIGIN + ((Consts.Cards.Size.Normal.WIDTH * k) + (Consts.Cards.Location.Npc1.Y_MARGIN * k));
          } else if(npcs[i].playerNo === Consts.Npc.NO2){
            x = Consts.Cards.Location.Npc2.X_ORIGIN + ((k) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Npc2.X_MARGIN * (k))
            y = Consts.Cards.Location.Npc2.Y_ORIGIN - Consts.Cards.Location.Npc2.Y_MARGIN * 2;
          } else if(npcs[i].playerNo === Consts.Npc.NO3){
            x = Consts.Cards.Location.Npc3.X_ORIGIN + Consts.Cards.Size.Normal.HEIGHT*2;
            y = Consts.Cards.Location.Npc3.Y_ORIGIN + ((Consts.Cards.Size.Normal.WIDTH * k) + (Consts.Cards.Location.Npc3.Y_MARGIN * k));
          }
          sprite = this.add.sprite(x, y, Consts.Cards.Name.CARD_BIHIND);
        }

        sprite.setOrigin(0,0);
        sprite.displayHeight = Consts.Cards.Size.Normal.HEIGHT;
        sprite.displayWidth = Consts.Cards.Size.Normal.WIDTH
        ;
        if(npcs[i].playerNo != Consts.Npc.NO2){
          sprite.rotation += 1.56;
        }
        npcs[i].currentCard.sprites.push(sprite);
      }
    }
  }
  
  showPile(): void {
    var sprite = this.add.sprite(
        Consts.Cards.Location.Pile.X_ORIGIN,
        Consts.Cards.Location.Pile.Y_ORIGIN,
        Consts.Cards.Name.CARD_BIHIND);
    sprite.setOrigin(0,0);
    sprite.displayHeight = Consts.Cards.Size.PileCard.HEIGHT;
    sprite.displayWidth = Consts.Cards.Size.PileCard.WIDTH;
  }

  showYourCards(isInteractive : boolean) : void {
    if(0 < this.YOU.currentCard.sprites.length){
      for(var i = 0;i < this.YOU.currentCard.sprites.length;i++){
        this.YOU.currentCard.sprites[i].destroy();
      }
      this.YOU.currentCard.sprites = [];
    }

    for(var i = 0; i < this.YOU.currentCard.numbers.length; i++){
      var sprite : Phaser.GameObjects.Sprite;
      if(Consts.Cards.Location.FIRST_LINE_START_POSITION <= this.YOU.currentCard.numbers.length) {
        var x : number = 0;
        var y : number = 0;
        if(0 <= i && i <= 7){
          x = Consts.Cards.Location.Player.X_ORIGIN + ((i) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Player.X_MARGIN * (i));
          y = Consts.Cards.Location.Player.Y_ORIGIN
        }else if(8 <= i && i <= 15){
          x = Consts.Cards.Location.Player.X_ORIGIN + ((i - 8) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Player.X_MARGIN * (i - 8));
          y = Consts.Cards.Location.Player.Y_ORIGIN + Consts.Cards.Location.Player.Y_MARGIN;
        }else{
          x = Consts.Cards.Location.Player.X_ORIGIN + ((i - 16) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Player.X_MARGIN * (i - 16));
          y = Consts.Cards.Location.Player.Y_ORIGIN + (Consts.Cards.Location.Player.Y_MARGIN * 2);
        }
        sprite = this.add.sprite(
            x,
            y,
            Cards[this.YOU.currentCard.numbers[i]].fileName);
      }else if(Consts.Cards.Location.SECOND_LINE_START_POSITION <= this.YOU.currentCard.numbers.length) {
        var x : number = 0;
        var y : number = 0;
        if(8 <= i){
          x = Consts.Cards.Location.Player.X_ORIGIN + ((i - 8) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Player.X_MARGIN * (i - 8));
          y = Consts.Cards.Location.Player.Y_ORIGIN + (Consts.Cards.Location.Player.Y_MARGIN*2);
        } else {
          x = Consts.Cards.Location.Player.X_ORIGIN + ((i) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Player.X_MARGIN * (i));
          y = Consts.Cards.Location.Player.Y_ORIGIN + (Consts.Cards.Location.Player.Y_MARGIN*1);
        }
        sprite = this.add.sprite(
            x,
            y,
            Cards[this.YOU.currentCard.numbers[i]].fileName);
      }else {
        var x : number = 0;
        var y : number = 0;
        x = Consts.Cards.Location.Player.X_ORIGIN + ((i) * Consts.Cards.Size.Normal.WIDTH) + (Consts.Cards.Location.Player.X_MARGIN * (i));
        y = Consts.Cards.Location.Player.Y_ORIGIN + (Consts.Cards.Location.Player.Y_MARGIN * 2);
        sprite = this.add.sprite(
            x,
            y,
            Cards[this.YOU.currentCard.numbers[i]].fileName);
      }
      if(isInteractive){
        sprite.setInteractive();
      }
      sprite.setOrigin(0,0);
      sprite.displayHeight = Consts.Cards.Size.Normal.HEIGHT;
      sprite.displayWidth = Consts.Cards.Size.Normal.WIDTH;

      sprite.depth = i
      var Scene = this;
      sprite.on('pointerdown', function(pointer : Phaser.GameObjects.Sprite){
        for(var i = 0; i < Scene.YOU.currentCard.selected.length;i++){
          Scene.YOU.selectedCards.splice(Scene.YOU.selectedCards.indexOf(Scene.YOU.currentCard.numbers[this.depth]), 1);
          Scene.YOU.currentCard.selected[i].destroy();
          Scene.YOU.currentCard.selected = [];
        }
        for(var i = 0; i < Scene.selectedSprites.length; i++){
          Scene.selectedSprites[i].y += 8;
        }
        Scene.selectedSprites = [];
        this.y -= 8;
        var rectangle = Scene.add.rectangle(this.x, this.y, this.displayWidth, this.displayHeight);
        rectangle.setStrokeStyle(10, Consts.Screen.CARD_SELECT_COLOR);
        rectangle.setOrigin(0,0)
        Scene.YOU.currentCard.selected.push(rectangle);
        Scene.YOU.selectedCards.push(Scene.YOU.currentCard.numbers[this.depth]);
        Scene.selectedSprites.push(this);
      });
      Scene.YOU.currentCard.sprites.push(sprite);
    }
  }

  /**
   * プールの山を作り直す
   */
  shufflePile(): void {
    var count = this.players[0].currentCard.numbers.length
        + this.players[1].currentCard.numbers.length
        + this.players[2].currentCard.numbers.length
        + this.players[3].currentCard.numbers.length;
    while(true){
      if(Consts.Cards.TOTAL_NUMBER_OF_CARDS_IN_GAME <= count){
        break;
      }
      //既にプレイヤー達が持っている、または山に積まれたカードは除いて乱数を作り続ける
      var random = Math.floor(Math.random() * Consts.Cards.TOTAL_NUMBER_OF_CARDS_IN_GAME);
      if( this.players[0].currentCard.numbers.includes(random) === false
          && this.players[1].currentCard.numbers.includes(random) === false
          && this.players[2].currentCard.numbers.includes(random) === false
          && this.players[3].currentCard.numbers.includes(random) === false
          && this.pool.pile.includes(random) === false
      ) {
        this.pool.pile.push(random);
        count++;
      }
    }
  }

  update(): void {

    if(this.pool.arrow){
      if(this.isReverse){
        this.pool.arrow.rotation -= 0.01
      } else {
        this.pool.arrow.rotation += 0.01
      }
    }
  }

  updateCurrentColor(): void
  {
    if(this.pool.circle){
      this.pool.circle.destroy();
    }

    switch(this.pool.color){
      case Consts.Cards.Color.BLUE:
        this.pool.circle = this.add.sprite(Consts.Button.ShowBlue.X_ORIGIN, Consts.Button.ShowBlue.Y_ORIGIN, Consts.Button.ShowBlue.NAME).setOrigin(0,0);
        break;
      case Consts.Cards.Color.RED:
        this.pool.circle = this.add.sprite(Consts.Button.ShowRed.X_ORIGIN, Consts.Button.ShowRed.Y_ORIGIN, Consts.Button.ShowRed.NAME).setOrigin(0,0);
        break;
      case Consts.Cards.Color.YELLOW:
        this.pool.circle = this.add.sprite(Consts.Button.ShowYellow.X_ORIGIN, Consts.Button.ShowYellow.Y_ORIGIN, Consts.Button.ShowYellow.NAME).setOrigin(0,0);
        break;
      case Consts.Cards.Color.GREEN:
        this.pool.circle = this.add.sprite(Consts.Button.ShowGreen.X_ORIGIN, Consts.Button.ShowGreen.Y_ORIGIN, Consts.Button.ShowGreen.NAME).setOrigin(0,0);
        break;
    }

    if(this.pool.arrow){
      this.pool.arrow.destroy();
    }

    var fileName;
    if(this.isReverse){
      fileName = Consts.Button.Inverse.NAME;
    } else {
      fileName = Consts.Button.Direct.NAME;
    }
    var arrow = this.add.sprite(Consts.Button.Direct.X_ORIGIN, Consts.Button.Direct.Y_ORIGIN, fileName)
        .setOrigin(0.5,0.5);
    arrow.displayWidth = 200;
    arrow.displayHeight = 200;
    this.pool.arrow = arrow;
  }

  updatePoolData(card : any): void {
    this.pool.value = card.value;
    this.pool.color = card.color;
    this.pool.kind = card.kind;
    this.updateCurrentColor();
  }

  async yourNextProcess(isPass: boolean = false): Promise<string>
  {
    if(this.pool.btnDraw){
      this.pool.btnDraw.destroy();
    }
    if(this.pool.btnPass){
      this.pool.btnPass.destroy();
    }
    if(this.pool.btnDiscard){
      this.pool.btnDiscard.destroy();
    }
    for(var i = 0; i < this.YOU.currentCard.selected.length;i++){
      this.YOU.currentCard.selected[i].destroy();
    }
    this.YOU.currentCard.selected = [];
    if(!isPass){
      var cardPosition = this.YOU.currentCard.numbers.indexOf(this.YOU.selectedCards[0]);
      this.YOU.currentCard.numbers.splice(cardPosition, 1);
    }
    this.YOU.selectedCards = [];
    this.showYourCards(false);
    this.showNpcCards();
    this.updateCurrentColor();

    return new Promise(function(resolve: CallableFunction){
      resolve();
    });
  }

  youCannot(): void
  {
    var cannot = this.add.text(320, 350, 'それはできない').setFontSize(35);
    cannot.setOrigin(0,0);
    setTimeout(function (){
      cannot.destroy();
    },1500);
  }

  youWin()
  {
    var cookie = document.cookie;
    var win : number;
    var lose : number;

    var buf = cookie.split(';');
    for(var k = 0; k < buf.length;k++){
      if(buf[k].indexOf('win=') !== -1){
        var temp = buf[k].split('&');
        for(var i = 0; i < temp.length; i++){
          var temp2 = temp[i].split('=');
          if(temp2[0] == 'win'){
            win = parseInt(temp2[1]);
          } else if(temp2[0] == 'lose'){
            lose = parseInt(temp2[1]);
          }
        }
      }
    }
    win++;
    document.cookie = 'win='+win+'&lose='+lose+';max-age=315360000';

    var wint = this.add.text(400, 600, 'あなたが勝利').setFontSize(35);
    wint.setOrigin(0,0);
    this.add.tween({
      targets: wint,
      y: 300,
      duration: 3000,
      ease: 'Power3',
      onComplete: function(a,b){
        document.location.reload();
      }
    });
  }

  whoIsNext(): void {
    var currentPlayer = this.currentPlayer;
    var drawTarget = currentPlayer;
    if(this.isReverse){
      if(this.isSkip || this.isDraw2 || this.isDraw4){
        currentPlayer -= 2;
        drawTarget -= 1;
        if(currentPlayer == -1){
          currentPlayer = 3;
          drawTarget = 0;
        } else if(currentPlayer == -2){
          currentPlayer = 2;
          drawTarget = 3;
        }
      } else {
        currentPlayer -= 1;
        if(currentPlayer == -1){
          currentPlayer = 3;
          drawTarget = 3;
        }
      }
    } else {
      if(this.isSkip || this.isDraw2 || this.isDraw4){
        currentPlayer += 2;
        drawTarget += 1;
        if(currentPlayer == 4){
          currentPlayer = 0;
          drawTarget = 3;
        } else if(currentPlayer == 5){
          currentPlayer = 1;
          drawTarget = 0;
        }
      } else {
        currentPlayer += 1;
        drawTarget += 1;
        if(currentPlayer == 4){
          currentPlayer = 0;
          drawTarget = 0;
        }
      }
    }
    this.isSkip = false;
    this.currentPlayer = currentPlayer;
    this.drawTarget = drawTarget;
  }
}
