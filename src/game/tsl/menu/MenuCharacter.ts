/* KotOR JS - A remake of the Odyssey Game Engine that powered KotOR I & II
*/

import { GameState } from "../../../GameState";
import { GUILabel, GUIButton, GUISlider, LBL_3DView } from "../../../gui";
import { TextureLoader } from "../../../loaders/TextureLoader";
import { PartyManager } from "../../../managers/PartyManager";
import { ModuleCreature } from "../../../module";
import { OdysseyModel } from "../../../odyssey";
import { OdysseyModel3D } from "../../../three/odyssey";
import { MenuCharacter as K1_MenuCharacter } from "../../kotor/KOTOR";
import * as THREE from "three";
import { TwoDAManager } from "../../../managers/TwoDAManager";
import { OdysseyTexture } from "../../../resource/OdysseyTexture";

/* @file
* The MenuCharacter menu class.
*/

export class MenuCharacter extends K1_MenuCharacter {

  declare LBL_BAR6: GUILabel;
  declare LBL_STATSBORDER: GUILabel;
  declare LBL_MORE_BACK: GUILabel;
  declare LBL_XP_BACK: GUILabel;
  declare LBL_3DCHAR: GUILabel;
  declare BTN_3DCHAR: GUIButton;
  declare SLD_ALIGN: GUISlider;
  declare LBL_STR: GUILabel;
  declare LBL_FORTITUDE_STAT: GUILabel;
  declare LBL_REFLEX_STAT: GUILabel;
  declare LBL_WILL_STAT: GUILabel;
  declare LBL_DEFENSE_STAT: GUILabel;
  declare LBL_FORCE_STAT: GUILabel;
  declare LBL_VITALITY_STAT: GUILabel;
  declare LBL_DEX: GUILabel;
  declare LBL_CON: GUILabel;
  declare LBL_INT: GUILabel;
  declare LBL_CHA: GUILabel;
  declare LBL_WIS: GUILabel;
  declare LBL_STR_MOD: GUILabel;
  declare LBL_DEX_MOD: GUILabel;
  declare LBL_CON_MOD: GUILabel;
  declare LBL_INT_MOD: GUILabel;
  declare LBL_WIS_MOD: GUILabel;
  declare LBL_CHA_MOD: GUILabel;
  declare LBL_EXPERIENCE_STAT: GUILabel;
  declare LBL_NEEDED_XP: GUILabel;
  declare LBL_STRENGTH: GUILabel;
  declare LBL_DEXTERITY: GUILabel;
  declare LBL_CONSTITUTION: GUILabel;
  declare LBL_INTELLIGENCE: GUILabel;
  declare LBL_CHARISMA: GUILabel;
  declare LBL_REFLEX: GUILabel;
  declare LBL_WILL: GUILabel;
  declare LBL_EXPERIENCE: GUILabel;
  declare LBL_NEXT_LEVEL: GUILabel;
  declare LBL_FORCE: GUILabel;
  declare LBL_VITALITY: GUILabel;
  declare LBL_DEFENSE: GUILabel;
  declare LBL_FORTITUDE: GUILabel;
  declare LBL_BEVEL: GUILabel;
  declare LBL_WISDOM: GUILabel;
  declare LBL_BEVEL2: GUILabel;
  declare LBL_LIGHT: GUILabel;
  declare LBL_DARK: GUILabel;
  declare LBL_BAR1: GUILabel;
  declare LBL_BAR5: GUILabel;
  declare LBL_BAR2: GUILabel;
  declare LBL_BAR3: GUILabel;
  declare LBL_BAR4: GUILabel;
  declare LBL_TITLE: GUILabel;
  declare BTN_EXIT: GUIButton;
  declare BTN_AUTO: GUIButton;
  declare BTN_LEVELUP: GUIButton;
  declare LBL_FORCEMASTERY: GUILabel;

  constructor(){
    super();
    this.gui_resref = 'character_p';
    this.background = 'blackfill';
    this.voidFill = true;
  }

  async MenuControlInitializer(skipInit: boolean = false) {
    await super.MenuControlInitializer(true);
    if(skipInit) return;
    return new Promise<void>((resolve, reject) => {
      this.BTN_EXIT.addEventListener('click', (e: any) => {
        e.stopPropagation();
        this.Close();
      });

      GameState.ModelLoader.load('charmain_light').then((mdl: OdysseyModel) => {
        OdysseyModel3D.FromMDL(mdl, {
          manageLighting: false,
        }).then((model: OdysseyModel3D) => {
          try{
            this._3dView = new LBL_3DView();
            this._3dView.visible = true;
            this._3dView.camera.aspect = this.LBL_3DCHAR.extent.width / this.LBL_3DCHAR.extent.height;
            this._3dView.camera.updateProjectionMatrix();
            (this.LBL_3DCHAR.getFill().material as any).uniforms.map.value = this._3dView.texture.texture;
            (this.LBL_3DCHAR.getFill().material as any).transparent = false;
            this._3dView.setControl(this.LBL_3DCHAR);
            (this.LBL_3DCHAR.getFill().material as any).visible = true;

            this._3dViewModel = model;
            this._3dView.addModel(this._3dViewModel);
            
            this._3dView.camera.position.copy(model.camerahook.position);
            this._3dView.camera.quaternion.copy(model.camerahook.quaternion);
          }catch(e){
            console.error(e);
            resolve();
            return;
          }

          TextureLoader.LoadQueue(() => {
            this._3dViewModel.playAnimation(0, true);
            resolve();
          });
        }).catch( (e: any) => {
          resolve();
        });
      }).catch( (e: any) => {
        resolve();
      });
    });
  }

  Update(delta: number) {
    if (!this.bVisible)
      return;
    if (this.char)
      this.char.update(delta);
    try {
      this._3dView.render(delta);
      (this.LBL_3DCHAR.getFill().material as any).needsUpdate = true;
    } catch (e: any) {
    }
  }

  Show() {
    super.Show();
    this.RecalculatePosition();
    if (this.char) {
      this._3dViewModel.children[0].children[1].remove(this.char);
    }
    this._3dView.camera.position.z = 1;
    let objectCreature = new ModuleCreature();
    let clone = PartyManager.party[0];
    objectCreature.appearance = clone.appearance;
    objectCreature.LoadModel().then((model: OdysseyModel3D) => {
      model.position.set(0, 0, 0);
      model.rotation.x = -Math.PI / 2;
      model.rotation.z = Math.PI;
      model.box = new THREE.Box3().setFromObject(model);
      this.char = model;
      this._3dViewModel.children[0].children[1].add(this.char);
      TextureLoader.LoadQueue(() => {
        setTimeout(() => {
          this.char.playAnimation('good', true);
        }, 100);
      });
    });
    GameState.MenuActive = true;
    this['BTN_CHANGE1'].hide();
    this['BTN_CHANGE2'].hide();
    for (let i = 0; i < PartyManager.party.length; i++) {
      let partyMember = PartyManager.party[i];
      let portraitId = partyMember.getPortraitId();
      let portrait = TwoDAManager.datatables.get('portraits')?.rows[portraitId];
      if (!i) {
      } else {
        const BTN_CHANGE = this.getControlByName('BTN_CHANGE' + i);
        BTN_CHANGE.show();
        if (BTN_CHANGE.getFillTextureName() != portrait.baseresref) {
          BTN_CHANGE.setFillTextureName(portrait.baseresref);
        }
      }
    }
  }
  
}
