import { OdysseyController } from ".";
import { OdysseyModelAnimation, OdysseyModelAnimationManager } from "..";
import { OdysseyModelControllerType } from "../../enums/odyssey/OdysseyModelControllerType";
import { OdysseyControllerFrameGeneric } from "../../interface/odyssey/controller/OdysseyControllerFrameGeneric";
import { OdysseyControllerGeneric } from "../../interface/odyssey/controller/OdysseyControllerGeneric";

export class ColorStartController extends OdysseyController {

  type: OdysseyModelControllerType = OdysseyModelControllerType.ColorStart;

  constructor( controller: OdysseyControllerGeneric){
    super(controller);
  }

  setFrame(manager: OdysseyModelAnimationManager, anim: OdysseyModelAnimation, data: OdysseyControllerFrameGeneric){
    if(manager.modelNode.emitter){
      manager.modelNode.emitter.colorStart.setRGB( data.x, data.y, data.z );
      manager.modelNode.emitter.material.uniforms.colorStart.value.copy(manager.modelNode.emitter.colorStart);
      manager.modelNode.emitter.material.uniformsNeedUpdate = true;
    }
  }

  animate(manager: OdysseyModelAnimationManager, anim: OdysseyModelAnimation, last: OdysseyControllerFrameGeneric, next: OdysseyControllerFrameGeneric, fl: number = 0){
    if(manager.modelNode.emitter){
      manager.modelNode.emitter.colorStart.setRGB(
        last.x + fl * (next.x - last.x),
        last.y + fl * (next.y - last.y),
        last.z + fl * (next.z - last.z)
      );
      manager.modelNode.emitter.material.uniforms.colorStart.value.copy(manager.modelNode.emitter.colorStart);
      manager.modelNode.emitter.material.uniformsNeedUpdate = true;
    }
  }

}
