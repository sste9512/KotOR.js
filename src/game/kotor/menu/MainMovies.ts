/* KotOR JS - A remake of the Odyssey Game Engine that powered KotOR I & II
*/

import { GameState } from "../../../GameState";
import { GameMenu, GUILabel, GUIListBox, GUIButton } from "../../../gui";

/* @file
* The MainMovies menu class.
*/

export class MainMovies extends GameMenu {

  LBL_TITLE: GUILabel;
  LB_MOVIES: GUIListBox;
  BTN_BACK: GUIButton;

  constructor(){
    super();
    this.gui_resref = 'titlemovie';
    this.background = '';
    this.voidFill = false;
  }

  async MenuControlInitializer() {
    await super.MenuControlInitializer();
    return new Promise((resolve, reject) => {
    });
}
  
}
