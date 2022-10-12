export class EffectHealForcePoints extends GameEffect {
  constructor(){
    super();
    this.type = GameEffectType.EffectHealForcePoints;
    
    //intList[0] : heal amount

  }

  onApply(){
    if(this.applied)
      return;
      
    super.onApply();

    this.object.addFP(this.getAmount());
  }

  getAmount(){
    return this.getInt(0);
  }

}

