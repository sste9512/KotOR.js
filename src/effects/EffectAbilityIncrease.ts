import { GameEffect } from ".";
import { GameEffectType } from "../enums/effects/GameEffectType";
import { ModuleObject } from "../module";

export class EffectAbilityIncrease extends GameEffect {
  constructor(){
    super();
    this.type = GameEffectType.EffectAbilityIncrease;

    //intList[0] : nAbility
    //intList[1] : nAmount

  }

  onApply(){
    if(this.applied)
      return;
      
    super.onApply();
    
    if(this.object instanceof ModuleObject){
      //
    }
  }

}
