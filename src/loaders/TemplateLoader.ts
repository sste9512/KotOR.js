/* KotOR JS - A remake of the Odyssey Game Engine that powered KotOR I & II
 */

import { GameState } from "../GameState";
import { BIFManager } from "../managers/BIFManager";
import { GFFObject } from "../resource/GFFObject";
import { ResourceLoader } from "../resource/ResourceLoader";
import { Utility } from "../utility/Utility";
import * as path from "path";
import { ResourceTypes } from "../resource/ResourceTypes";
import { GameFileSystem } from "../utility/GameFileSystem";

/* @file
 * The TemplateLoader class.
 * 
 * This should be used for loading game templates like UTC, UTP, UTD, etc.
 * These assets can be found in the current module, in the games' override
 * folder, or in the games templates.bif
 *
 * The order for searching should be just that unless the override search has
 * been disabled by the user. ("look_in_override" == false in ConfigManager)
 */

export class TemplateLoader {

  static cache: any = {};

  static Load(args: any = {}){

    args = Object.assign({
      ResRef: null,
      ResType: null,
      onLoad: null,
      onFail: null
    }, args);

    ResourceLoader.loadResource(args.ResType, args.ResRef, (data: Buffer) => {
      new GFFObject(data, (gff) => {
        if(args.onLoad != null)
          args.onLoad(gff);
      }); 
    }, args.onFail);

  }

  static LoadFromResources ( args: any = {} ) {

    args = Object.assign({
      ResRef: null,
      ResType: null,
      onLoad: null,
      onFail: null
    }, args);

    // if(true){

    //   let resKey = GameState.module.rim_s.GetResourceByLabel(args.ResRef.toLowerCase(), args.ResType);
    //   if(resKey != null){
    //     //console.log('Template Resource found');
    //     GameState.module.rim_s.GetResourceData(resKey, (buffer) => {
    //       if(args.onLoad != null)
    //         args.onLoad(buffer);
    //     });

    //     return;
    //   }

    //   resKey = BIFManager.GetBIFByName('templates').GetResourceByLabel(args.ResRef.toLowerCase(), args.ResType);
    //   if(resKey != null){
    //     //console.log('Template Resource found');
    //     BIFManager.GetBIFByName('templates').GetResourceData(resKey, (buffer) => {
    //       if(args.onLoad != null)
    //         args.onLoad(buffer);
    //     });

    //     return;
    //   }

    //   resKey = ResourceLoader.getResource(args.ResType, args.ResRef.toLowerCase());
    //   if(resKey){
    //     if(!resKey.inArchive){
          
    //     }else{

    //     }
    //   }
      
    //   if(args.onFail != null)
    //     args.onFail();
    // }else{
    //   if(args.onFail != null)
    //     args.onFail();
    // }
  }

}
