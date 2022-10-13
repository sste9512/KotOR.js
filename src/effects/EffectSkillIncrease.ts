import { GameEffect } from ".";
import { GameEffectType } from "../enums/effects/GameEffectType";
import { ModuleObject } from "../module";

export class EffectSkillIncrease extends GameEffect {
  constructor(){
    super();
    this.type = GameEffectType.EffectSkillIncrease;
    
    //intList[0] : skill id
    //intList[1] : amount
    //intList[2] : racialtypes.2da rowcount
    
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

