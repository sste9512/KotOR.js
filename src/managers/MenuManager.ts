import { CursorManager } from "../managers/CursorManager";
import * as KOTOR from "../game/kotor/KOTOR";
import * as TSL from "../game/tsl/TSL";
import { GameState } from "../GameState";
import { GameEngineType } from "../enums/engine/GameEngineType";
import { GameMenu } from "../gui";
import { CharGenManager } from "./CharGenManager";
import { ActionMenuManager } from "../ActionMenuManager";
import { EngineMode } from "../enums/engine/EngineMode";


export class MenuManager {
  static pulseOpacity: number;
  static activeMenus: any[];
  static pulse: number;

  //References to the game menus
  static CharGenAbilities: KOTOR.CharGenAbilities;
  static CharGenClass: KOTOR.CharGenClass;
  static CharGenCustomPanel: KOTOR.CharGenCustomPanel;
  static CharGenFeats: KOTOR.CharGenFeats;
  static CharGenMain: KOTOR.CharGenMain;
  static CharGenName: KOTOR.CharGenName;
  static CharGenPortCust: KOTOR.CharGenPortCust;
  static CharGenQuickOrCustom: KOTOR.CharGenQuickOrCustom;
  static CharGenQuickPanel: KOTOR.CharGenQuickPanel;
  static CharGenSkills: KOTOR.CharGenSkills;
  static InGameAreaTransition: KOTOR.InGameAreaTransition;
  static InGameBark: KOTOR.InGameBark;
  static InGameComputer: KOTOR.InGameComputer;
  static InGameComputerCam: KOTOR.InGameComputerCam;
  static InGameConfirm: KOTOR.InGameConfirm;
  static InGameDialog: KOTOR.InGameDialog;
  static InGameOverlay: KOTOR.InGameOverlay;
  static InGamePause: KOTOR.InGamePause;
  static LoadScreen: KOTOR.LoadScreen;
  static MainMenu: KOTOR.MainMenu;
  static MainMovies: KOTOR.MainMovies;
  static MainMusic: TSL.MainMusic;
  static MainOptions: KOTOR.MainOptions;
  static MenuAbilities: KOTOR.MenuAbilities;
  static MenuCharacter: KOTOR.MenuCharacter;
  static MenuChemicals: TSL.MenuChemicals;
  static MenuContainer: KOTOR.MenuContainer;
  static MenuEquipment: KOTOR.MenuEquipment;
  static MenuFeedback: KOTOR.MenuFeedback;
  static MenuGalaxyMap: KOTOR.MenuGalaxyMap;
  static MenuGraphics: KOTOR.MenuGraphics;
  static MenuGraphicsAdvanced: KOTOR.MenuGraphicsAdvanced;
  static MenuInventory: KOTOR.MenuInventory;
  static MenuJournal: KOTOR.MenuJournal;
  static MenuLevelUp: KOTOR.MenuLevelUp;
  static MenuMap: KOTOR.MenuMap;
  static MenuMessages: KOTOR.MenuMessages;
  static MenuOptions: KOTOR.MenuOptions;
  static MenuPartySelection: KOTOR.MenuPartySelection;
  static MenuResolutions: KOTOR.MenuResolutions;
  static MenuSaveLoad: KOTOR.MenuSaveLoad;
  static MenuSaveName: KOTOR.MenuSaveName;
  static MenuSound: KOTOR.MenuSound;
  static MenuSoundAdvanced: KOTOR.MenuSoundAdvanced;
  static MenuStore: KOTOR.MenuStore;
  static MenuTop: KOTOR.MenuTop;

  static Init(){

    MenuManager.activeMenus = [];
    MenuManager.pulse = 0;
    MenuManager.pulseOpacity = 1;

  }

  static Add(menu: GameMenu){
    if(!menu.isOverlayGUI){
      //Hide the current top most menu in the list before adding the new Menu
      if(MenuManager.activeMenus.length)
        MenuManager.activeMenus[MenuManager.activeMenus.length-1].Hide();
    }

    if(menu instanceof GameMenu)
      MenuManager.activeMenus.push(menu);

    MenuManager.Resize();
  }

  static Remove(menu: GameMenu){
    let mIdx = MenuManager.activeMenus.indexOf(menu);
    if(mIdx >= 0)
      MenuManager.activeMenus.splice(mIdx, 1);

    //Reshow the new top most menu in the list
    if(MenuManager.activeMenus.length)
      MenuManager.GetCurrentMenu().Show();

    MenuManager.Resize();
  }

  static ClearMenus(){
    while(MenuManager.activeMenus.length){
      MenuManager.activeMenus[0].Close();
    }
  }

  static GetCurrentMenu(){
    return MenuManager.activeMenus[MenuManager.activeMenus.length-1];
  }

  static Resize(){
    for(let i = 0, len = MenuManager.activeMenus.length; i < len; i++){
      MenuManager.activeMenus[i].Resize();
    }
  }

  static Update(delta = 0){
    GameState.updateCursor();
    CursorManager.cursor.material.depthTest = false;
    CursorManager.cursor.material.depthWrite = false;
    CursorManager.cursor.renderOrder = 9999999;
    MenuManager.pulse += delta;
    if(MenuManager.pulse > 2){
      MenuManager.pulse = 0;
    }

    if(this.pulse > 2){
      MenuManager.pulseOpacity = 0;
    }

    if(this.pulse > 1){
      MenuManager.pulseOpacity = this.pulse - 1;
    }else{
      MenuManager.pulseOpacity = 1 - this.pulse;
    }

    // if(MenuManager.InGameOverlay.bVisible){
    //   GameState.Mode = EngineMode.INGAME;
    // }else if(
    //   MenuManager.InGameComputer.bVisible ||
    //   MenuManager.InGameComputerCam.bVisible ||
    //   MenuManager.InGameDialog.bVisible
    // ){
    //   GameState.Mode = EngineMode.DIALOG;
    // }else if(!MenuManager.activeMenus.length){
    //   GameState.RestoreEnginePlayMode();
    // }

    if(MenuManager.InGameOverlay.bVisible){
      MenuManager.InGameOverlay.Update(delta);
    }

    let activeMenus = MenuManager.activeMenus;
    for(let i = 0, len = activeMenus.length; i < len; i++){
      activeMenus[i].Update(delta);
    }

    if(GameState.scene_gui.children.indexOf(GameState.scene_cursor_holder) != GameState.scene_gui.children.length){
      GameState.scene_cursor_holder.remove(GameState.scene_gui);
      GameState.scene_gui.add(GameState.scene_cursor_holder);
    }

  }

  static async GameMenuLoader(menuConstructor: any): Promise<GameMenu> {
    return new Promise( async (resolve: Function, reject: Function) => {
      const menu: GameMenu = new menuConstructor();
      await menu.Load();
      resolve(menu);
    });
  }

  static async LoadGameMenus(){
    ActionMenuManager.InitActionMenuPanels();
    await CharGenManager.Init();
    try{
      if(GameState.GameKey == GameEngineType.KOTOR){
        MenuManager.CharGenAbilities = await MenuManager.GameMenuLoader(KOTOR.CharGenAbilities) as KOTOR.CharGenAbilities;
        MenuManager.CharGenClass = await MenuManager.GameMenuLoader(KOTOR.CharGenClass) as KOTOR.CharGenClass;
        MenuManager.CharGenCustomPanel = await MenuManager.GameMenuLoader(KOTOR.CharGenCustomPanel) as KOTOR.CharGenCustomPanel;
        MenuManager.CharGenFeats = await MenuManager.GameMenuLoader(KOTOR.CharGenFeats) as KOTOR.CharGenFeats;
        MenuManager.CharGenMain = await MenuManager.GameMenuLoader(KOTOR.CharGenMain) as KOTOR.CharGenMain;
        MenuManager.CharGenName = await MenuManager.GameMenuLoader(KOTOR.CharGenName) as KOTOR.CharGenName;
        MenuManager.CharGenPortCust = await MenuManager.GameMenuLoader(KOTOR.CharGenPortCust) as KOTOR.CharGenPortCust; //Character Portrait
        MenuManager.CharGenQuickOrCustom = await MenuManager.GameMenuLoader(KOTOR.CharGenQuickOrCustom) as KOTOR.CharGenQuickOrCustom;
        MenuManager.CharGenQuickPanel = await MenuManager.GameMenuLoader(KOTOR.CharGenQuickPanel) as KOTOR.CharGenQuickPanel;
        MenuManager.CharGenSkills = await MenuManager.GameMenuLoader(KOTOR.CharGenSkills) as KOTOR.CharGenSkills;

        MenuManager.MenuAbilities = await MenuManager.GameMenuLoader(KOTOR.MenuAbilities) as KOTOR.MenuAbilities;
        MenuManager.MenuCharacter = await MenuManager.GameMenuLoader(KOTOR.MenuCharacter) as KOTOR.MenuCharacter;
        MenuManager.MenuContainer = await MenuManager.GameMenuLoader(KOTOR.MenuContainer) as KOTOR.MenuContainer;
        MenuManager.MenuEquipment = await MenuManager.GameMenuLoader(KOTOR.MenuEquipment) as KOTOR.MenuEquipment;
        MenuManager.MenuGalaxyMap = await MenuManager.GameMenuLoader(KOTOR.MenuGalaxyMap) as KOTOR.MenuGalaxyMap;
        MenuManager.MenuGraphics = await MenuManager.GameMenuLoader(KOTOR.MenuGraphics) as KOTOR.MenuGraphics;
        MenuManager.MenuGraphicsAdvanced = await MenuManager.GameMenuLoader(KOTOR.MenuGraphicsAdvanced) as KOTOR.MenuGraphicsAdvanced;
        MenuManager.MenuInventory = await MenuManager.GameMenuLoader(KOTOR.MenuInventory) as KOTOR.MenuInventory;
        MenuManager.MenuJournal = await MenuManager.GameMenuLoader(KOTOR.MenuJournal) as KOTOR.MenuJournal;
        MenuManager.MenuLevelUp = await MenuManager.GameMenuLoader(KOTOR.MenuLevelUp) as KOTOR.MenuLevelUp;
        MenuManager.MenuMap = await MenuManager.GameMenuLoader(KOTOR.MenuMap) as KOTOR.MenuMap;
        MenuManager.MenuMessages = await MenuManager.GameMenuLoader(KOTOR.MenuMessages) as KOTOR.MenuMessages;
        MenuManager.MenuOptions = await MenuManager.GameMenuLoader(KOTOR.MenuOptions) as KOTOR.MenuOptions;
        MenuManager.MenuFeedback = await MenuManager.GameMenuLoader(KOTOR.MenuFeedback) as KOTOR.MenuFeedback;
        MenuManager.MenuPartySelection = await MenuManager.GameMenuLoader(KOTOR.MenuPartySelection) as KOTOR.MenuPartySelection;
        MenuManager.MenuResolutions = await MenuManager.GameMenuLoader(KOTOR.MenuResolutions) as KOTOR.MenuResolutions;
        MenuManager.MenuSaveLoad = await MenuManager.GameMenuLoader(KOTOR.MenuSaveLoad) as KOTOR.MenuSaveLoad;
        MenuManager.MenuSaveName = await MenuManager.GameMenuLoader(KOTOR.MenuSaveName) as KOTOR.MenuSaveName;
        MenuManager.MenuSound = await MenuManager.GameMenuLoader(KOTOR.MenuSound) as KOTOR.MenuSound;
        MenuManager.MenuSoundAdvanced = await MenuManager.GameMenuLoader(KOTOR.MenuSoundAdvanced) as KOTOR.MenuSoundAdvanced;
        MenuManager.MenuStore = await MenuManager.GameMenuLoader(KOTOR.MenuStore) as KOTOR.MenuStore;
        MenuManager.MenuTop = await MenuManager.GameMenuLoader(KOTOR.MenuTop) as KOTOR.MenuTop;

        MenuManager.MainMenu = await MenuManager.GameMenuLoader(KOTOR.MainMenu) as KOTOR.MainMenu;
        MenuManager.MainMovies = await MenuManager.GameMenuLoader(KOTOR.MainMovies) as KOTOR.MainMovies;
        MenuManager.MainOptions = await MenuManager.GameMenuLoader(KOTOR.MainOptions) as KOTOR.MainOptions;

        MenuManager.LoadScreen = await MenuManager.GameMenuLoader(KOTOR.LoadScreen) as KOTOR.LoadScreen;

        MenuManager.InGameAreaTransition = await MenuManager.GameMenuLoader(KOTOR.InGameAreaTransition) as KOTOR.InGameAreaTransition;
        MenuManager.InGameBark = await MenuManager.GameMenuLoader(KOTOR.InGameBark) as KOTOR.InGameBark;
        MenuManager.InGameComputer = await MenuManager.GameMenuLoader(KOTOR.InGameComputer) as KOTOR.InGameComputer;
        MenuManager.InGameComputerCam = await MenuManager.GameMenuLoader(KOTOR.InGameComputerCam) as KOTOR.InGameComputerCam;
        MenuManager.InGameConfirm = await MenuManager.GameMenuLoader(KOTOR.InGameConfirm) as KOTOR.InGameConfirm;
        MenuManager.InGameDialog = await MenuManager.GameMenuLoader(KOTOR.InGameDialog) as KOTOR.InGameDialog;
        MenuManager.InGameOverlay = await MenuManager.GameMenuLoader(KOTOR.InGameOverlay) as KOTOR.InGameOverlay;
        MenuManager.InGamePause = await MenuManager.GameMenuLoader(KOTOR.InGamePause) as KOTOR.InGamePause;
      }else if(GameState.GameKey == GameEngineType.TSL){
        MenuManager.CharGenAbilities = await MenuManager.GameMenuLoader(TSL.CharGenAbilities) as KOTOR.CharGenAbilities;
        MenuManager.CharGenClass = await MenuManager.GameMenuLoader(TSL.CharGenClass) as KOTOR.CharGenClass;
        MenuManager.CharGenCustomPanel = await MenuManager.GameMenuLoader(TSL.CharGenCustomPanel) as KOTOR.CharGenCustomPanel;
        MenuManager.CharGenFeats = await MenuManager.GameMenuLoader(TSL.CharGenFeats) as KOTOR.CharGenFeats;
        MenuManager.CharGenMain = await MenuManager.GameMenuLoader(TSL.CharGenMain) as KOTOR.CharGenMain;
        MenuManager.CharGenName = await MenuManager.GameMenuLoader(TSL.CharGenName) as KOTOR.CharGenName;
        MenuManager.CharGenPortCust = await MenuManager.GameMenuLoader(TSL.CharGenPortCust) as KOTOR.CharGenPortCust; //Character Portrait
        MenuManager.CharGenQuickOrCustom = await MenuManager.GameMenuLoader(TSL.CharGenQuickOrCustom) as KOTOR.CharGenQuickOrCustom;
        MenuManager.CharGenQuickPanel = await MenuManager.GameMenuLoader(TSL.CharGenQuickPanel) as KOTOR.CharGenQuickPanel;
        MenuManager.CharGenSkills = await MenuManager.GameMenuLoader(TSL.CharGenSkills) as KOTOR.CharGenSkills;

        MenuManager.MenuAbilities = await MenuManager.GameMenuLoader(TSL.MenuAbilities) as KOTOR.MenuAbilities;
        MenuManager.MenuCharacter = await MenuManager.GameMenuLoader(TSL.MenuCharacter) as KOTOR.MenuCharacter;
        MenuManager.MenuChemicals = await MenuManager.GameMenuLoader(TSL.MenuChemicals) as TSL.MenuChemicals;
        MenuManager.MenuContainer = await MenuManager.GameMenuLoader(TSL.MenuContainer) as KOTOR.MenuContainer;
        MenuManager.MenuEquipment = await MenuManager.GameMenuLoader(TSL.MenuEquipment) as KOTOR.MenuEquipment;
        MenuManager.MenuGalaxyMap = await MenuManager.GameMenuLoader(TSL.MenuGalaxyMap) as KOTOR.MenuGalaxyMap;
        MenuManager.MenuGraphics = await MenuManager.GameMenuLoader(TSL.MenuGraphics) as KOTOR.MenuGraphics;
        MenuManager.MenuGraphicsAdvanced = await MenuManager.GameMenuLoader(TSL.MenuGraphicsAdvanced) as KOTOR.MenuGraphicsAdvanced;
        MenuManager.MenuInventory = await MenuManager.GameMenuLoader(TSL.MenuInventory) as KOTOR.MenuInventory;
        MenuManager.MenuJournal = await MenuManager.GameMenuLoader(TSL.MenuJournal) as KOTOR.MenuJournal;
        MenuManager.MenuLevelUp = await MenuManager.GameMenuLoader(TSL.MenuLevelUp) as KOTOR.MenuLevelUp;
        MenuManager.MenuMap = await MenuManager.GameMenuLoader(TSL.MenuMap) as KOTOR.MenuMap;
        MenuManager.MenuMessages = await MenuManager.GameMenuLoader(TSL.MenuMessages) as KOTOR.MenuMessages;
        MenuManager.MenuOptions = await MenuManager.GameMenuLoader(TSL.MenuOptions) as KOTOR.MenuOptions;
        MenuManager.MenuFeedback = await MenuManager.GameMenuLoader(TSL.MenuFeedback) as KOTOR.MenuFeedback;
        MenuManager.MenuPartySelection = await MenuManager.GameMenuLoader(TSL.MenuPartySelection) as KOTOR.MenuPartySelection;
        MenuManager.MenuResolutions = await MenuManager.GameMenuLoader(TSL.MenuResolutions) as KOTOR.MenuResolutions;
        MenuManager.MenuSaveLoad = await MenuManager.GameMenuLoader(TSL.MenuSaveLoad) as KOTOR.MenuSaveLoad;
        MenuManager.MenuSaveName = await MenuManager.GameMenuLoader(TSL.MenuSaveName) as KOTOR.MenuSaveName;
        MenuManager.MenuSound = await MenuManager.GameMenuLoader(TSL.MenuSound) as KOTOR.MenuSound;
        MenuManager.MenuSoundAdvanced = await MenuManager.GameMenuLoader(TSL.MenuSoundAdvanced) as KOTOR.MenuSoundAdvanced;
        MenuManager.MenuStore = await MenuManager.GameMenuLoader(TSL.MenuStore) as KOTOR.MenuStore;
        MenuManager.MenuTop = await MenuManager.GameMenuLoader(TSL.MenuTop) as KOTOR.MenuTop;

        MenuManager.MainMenu = await MenuManager.GameMenuLoader(TSL.MainMenu) as KOTOR.MainMenu;
        MenuManager.MainMovies = await MenuManager.GameMenuLoader(TSL.MainMovies) as KOTOR.MainMovies;
        MenuManager.MainMusic = await MenuManager.GameMenuLoader(TSL.MainMusic) as TSL.MainMusic;
        MenuManager.MainOptions = await MenuManager.GameMenuLoader(TSL.MainOptions) as KOTOR.MainOptions;

        MenuManager.LoadScreen = await MenuManager.GameMenuLoader(TSL.LoadScreen) as KOTOR.LoadScreen;

        MenuManager.InGameAreaTransition = await MenuManager.GameMenuLoader(TSL.InGameAreaTransition) as KOTOR.InGameAreaTransition;
        MenuManager.InGameBark = await MenuManager.GameMenuLoader(TSL.InGameBark) as KOTOR.InGameBark;
        MenuManager.InGameComputer = await MenuManager.GameMenuLoader(TSL.InGameComputer) as KOTOR.InGameComputer;
        MenuManager.InGameComputerCam = await MenuManager.GameMenuLoader(TSL.InGameComputerCam) as KOTOR.InGameComputerCam;
        MenuManager.InGameConfirm = await MenuManager.GameMenuLoader(TSL.InGameConfirm) as KOTOR.InGameConfirm;
        MenuManager.InGameDialog = await MenuManager.GameMenuLoader(TSL.InGameDialog) as KOTOR.InGameDialog;
        MenuManager.InGameOverlay = await MenuManager.GameMenuLoader(TSL.InGameOverlay) as KOTOR.InGameOverlay;
        MenuManager.InGamePause = await MenuManager.GameMenuLoader(TSL.InGamePause) as KOTOR.InGamePause;
      }
    }catch(e){
      console.error(e);
    }
  }

}

MenuManager.Init();
