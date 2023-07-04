/* KotOR JS - A remake of the Odyssey Game Engine that powered KotOR I & II
 */

import { GameState } from "./GameState";
import { GFFDataType } from "./enums/resource/GFFDataType";
import { TLKManager, TwoDAManager } from "./managers";
import { OdysseyModel } from "./odyssey";
import { GFFField } from "./resource/GFFField";
import { GFFStruct } from "./resource/GFFStruct";
import { TwoDAObject } from "./resource/TwoDAObject";

/* @file
 * The Planetary class.
 */

export class Planetary {
  static planets: Planet[];
  static selectedIndex: number;
  static selected: Planet;

  static models: Map<string, OdysseyModel> = new Map();

  static async Init(){

    Planetary.planets = [];
    Planetary.selectedIndex = -1;
    const planetary2DA = TwoDAManager.datatables.get('planetary');
    Planetary.selected = undefined;
    let planetList = planetary2DA.rows;
    for(let i = 0; i < planetary2DA.RowCount; i++){
      const planet = new Planet(planetList[i]);
      Planetary.planets.push(planet);
      if(planet.model != '****'){
        try{
          const mdl = await GameState.ModelLoader.load(planet.model);
          if(mdl){
            Planetary.models.set(planet.model, mdl);
          }
        }catch(e){
          console.error(e);
        }
      }
    }

  }

  static SetSelectedPlanet( index = 0 ){
    Planetary.selectedIndex = index;
    Planetary.selected = Planetary.planets[index];
  }

  static SetPlanetAvailable(index: number, bState: boolean){
    Planetary.planets[index].enabled = bState;
  }

  static SetPlanetSelectable(index: number, bState: boolean){
    Planetary.planets[index].selectable = bState;
  }

  static GetPlanetByGUITag(sTag = ''): Planet{

    for(let i = 0; i < Planetary.planets.length; i++){
      if(Planetary.planets[i].guitag?.toLowerCase() === sTag.toLowerCase()){
        return Planetary.planets[i];
      }
    }

    return;
  }
  
  static GetPlanetByIndex(index: number = 0): Planet {
    return Planetary.planets[index];
  }

  static SaveStruct(){
    let struct = new GFFStruct();

    struct.AddField( new GFFField(GFFDataType.DWORD, 'GlxyMapNumPnts') ).SetValue(Planetary.planets.length);

    let planetMask = 0
    for(let i = 0; i < Planetary.planets.length; i++){
      let planet = Planetary.planets[i];
      if(planet.enabled){
        planetMask |= 1 << planet.id;
      }
      planetMask = planetMask >>> 0;
    }
    struct.AddField( new GFFField(GFFDataType.DWORD, 'GlxyMapPlntMsk') ).SetValue(planetMask);
    struct.AddField( new GFFField(GFFDataType.INT, 'GlxyMapSelPnt') ).SetValue(Planetary.selectedIndex);

    return struct;
  }

}

export class Planet {
  id: number;
  label: string;
  name: number;
  description: number;
  icon: string;
  model: string;
  guitag: string;
  enabled: boolean;
  selectable: boolean;

  constructor(_2da: any = {}){
    this.id = parseInt(TwoDAObject.cellParser(_2da.__rowlabel));
    this.label = TwoDAObject.cellParser(_2da.label);
    this.name = parseInt( TwoDAObject.cellParser(_2da.name) );
    this.description = parseInt( TwoDAObject.cellParser(_2da.description) );
    this.icon = TwoDAObject.cellParser(_2da.icon);
    this.model = TwoDAObject.cellParser(_2da.model);
    this.guitag = TwoDAObject.cellParser(_2da.guitag);

    this.enabled = false;
    this.selectable = false;
  }

  getId(){
    return this.id;
  }

  getLabel(){
    return this.label;
  }

  getName(): string {
    return TLKManager.TLKStrings[this.name].Value;
  }

  getDescription(): string {
    if(this.description)
      return TLKManager.TLKStrings[this.description].Value;
    else
      return '';
  }

  getIcon(){
    return this.icon;
  }

  getModel(){
    return this.model;
  }

}
