import { MainScene } from './scenes/main-scene';
import { Consts } from './consts';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'new_vsUno',
  url: 'https://www.new-doumeishi.me/new_vsUno',
  version: '2.0',
  width: Consts.Screen.WIDTH,
  height: Consts.Screen.HEIGHT,
  backgroundColor: 0x3a404d,
  type: Phaser.AUTO,
  parent: 'game',
  scene: [MainScene]
};
