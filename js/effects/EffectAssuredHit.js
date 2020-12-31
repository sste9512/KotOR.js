class EffectAssuredHit extends GameEffect {
  constructor(){
    super();
    this.type = GameEffect.Type.EffectAssuredHit;
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

module.exports = EffectAssuredHit;