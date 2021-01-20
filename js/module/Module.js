/* KotOR JS - A remake of the Odyssey Game Engine that powered KotOR I & II
 */

/* @file
 * The Module class.
 */

class Module {

  constructor(onLoad = null){
    this.scripts = {};
    this.archives = [];
    this.effects = [];
    this.eventQueue = [];
    this.area = new ModuleArea();

    this.initProperties();

    this.customTokens = new Map();
  }

  initProperties(){
    this.Expansion_Pack;
    this.Mod_Area_list = [];
    this.Mod_Creator_ID = 2; //UNUSED always set to 2
    this.Mod_CutSceneList = [];
    this.Mod_DawnHour;
    this.Mod_Description = new CExoLocString();
    this.Mod_DuskHour;
    this.Mod_Entry_Area;
    this.Mod_Entry_Dir_X;
    this.Mod_Entry_Dir_Y;
    this.Mod_Entry_X;
    this.Mod_Entry_Y;
    this.Mod_Entry_Z;

    this.Mod_Expan_List = [];
    this.Mod_GVar_List = [];

    this.Mod_Hak;
    this.Mod_ID = Buffer.alloc(16);
    this.Mod_IsSaveGame = 0;
    this.Mod_MinPerHour;
    this.Mod_Name = new CExoLocString();

    this.Mod_NextCharId0 = 0; // DWORD Keeps track of which id to give the next character created
    this.Mod_NextCharId1 = 0; // DWORD -
    this.Mod_NextObjId0  = 0; // DWORD Keeps track of which id to give the next object created
    this.Mod_NextObjId1  = 0; // DWORD -


    this.scripts = {
      Mod_OnAcquirItem: '',
      Mod_OnActvtItem: '',
      Mod_OnClientEntr: '',
      Mod_OnClientLeav: '',
      Mod_OnHeartbeat: '',
      Mod_OnModLoad: '',
      Mod_OnModStart: '',
      Mod_OnPlrDeath: '',
      Mod_OnPlrDying: '',
      Mod_OnPlrLvlUp: '',
      Mod_OnPlrRest: '',
      Mod_OnSpawnBtnDn: '',
      Mod_OnUnAqreItem: '',
      Mod_OnUsrDefined: '',
    };

    this.Mod_PauseTime = 0;
    this.Mod_StartDay = 1;
    this.Mod_StartHour = 13;
    this.Mod_StartMonth = 1;
    this.Mod_StartMovie = '';
    this.Mod_StartYear = 0;
    this.Mod_Tag;
    this.Mod_VO_ID = '';
    this.Mod_Version;
    this.Mod_XPScale;
  }

  setFromIFO( ifo = undefined, isLoadingSave = false ){
    if(ifo instanceof GFFObject){
      this.ifo = ifo;

      if(ifo.RootNode.HasField('Mod_PauseTime')){
        this.Mod_PauseTime = ifo.GetFieldByLabel('Mod_PauseTime').GetValue();
      }
      
      let Mod_Area_list = ifo.GetFieldByLabel('Mod_Area_list');
      let Mod_Area_listLen = Mod_Area_list.GetChildStructs().length;
      let Mod_Area = Mod_Area_list.ChildStructs[0];

      this.Area_Name = ifo.GetFieldByLabel('Area_Name', Mod_Area.GetFields()).GetValue();

      this.Mod_Area_list = [];
      //KOTOR modules should only ever have one area. But just incase lets loop through the list
      for(let i = 0; i < Mod_Area_listLen; i++){
        let Mod_Area = Mod_Area_list.ChildStructs[0];
        let area = { 'Area_Name': Mod_Area.GetFieldByLabel('Area_Name').GetValue() };
        this.Mod_Area_list.push(area);
      }

      //LISTS
      if(ifo.RootNode.HasField('Expansion_Pack')){
        this.Expansion_Pack = ifo.GetFieldByLabel('Expansion_Pack').GetValue();
      }else{
        this.Expansion_Pack = 0;
      }

      this.Mod_CutSceneList = [];
      this.Mod_Expan_List = [];
      this.Mod_GVar_List = [];

      this.Mod_Creator_ID = ifo.GetFieldByLabel('Mod_Creator_ID').GetValue();
      this.Mod_DawnHour = ifo.GetFieldByLabel('Mod_DawnHour').GetValue();
      this.Mod_Description = ifo.GetFieldByLabel('Mod_Description').GetCExoLocString();
      this.Mod_DuskHour = ifo.GetFieldByLabel('Mod_DuskHour').GetValue();

      this.Mod_Entry_Area = ifo.GetFieldByLabel('Mod_Entry_Area').GetValue();
      this.Mod_Entry_Dir_X = ifo.GetFieldByLabel('Mod_Entry_Dir_X').GetValue();
      this.Mod_Entry_Dir_Y = ifo.GetFieldByLabel('Mod_Entry_Dir_Y').GetValue();
      this.Mod_Entry_X = ifo.GetFieldByLabel('Mod_Entry_X').GetValue();
      this.Mod_Entry_Y = ifo.GetFieldByLabel('Mod_Entry_Y').GetValue();
      this.Mod_Entry_Z = ifo.GetFieldByLabel('Mod_Entry_Z').GetValue();

      this.Mod_Hak = ifo.GetFieldByLabel('Mod_Hak').GetValue();
      this.Mod_ID = ifo.GetFieldByLabel('Mod_ID').GetVoid(); //Generated by the toolset (Not sure if it is used in game)
      this.Mod_MinPerHour = ifo.GetFieldByLabel('Mod_MinPerHour').GetValue();
      this.Mod_Name = ifo.GetFieldByLabel('Mod_Name').GetCExoLocString();

      //Mod_Tokens
      if(ifo.RootNode.HasField('Mod_Tokens') && isLoadingSave){
        let tokenList = ifo.GetFieldByLabel('Mod_Tokens').GetChildStructs();
        for(let i = 0, len = tokenList.length; i < len; i++){
          this.setCustomToken(
            tokenList[i].GetFieldByLabel('Mod_TokensNumber').GetValue(),
            tokenList[i].GetFieldByLabel('Mod_TokensValue').GetValue()
          );
        }
      }

      if(ifo.RootNode.HasField('Mod_PlayerList') && isLoadingSave){
        let playerList = ifo.GetFieldByLabel('Mod_PlayerList').GetChildStructs();
        if(playerList.length){
          PartyManager.Player = GFFObject.FromStruct(playerList[0]);
        }
      }

      //Scripts
      this.scripts.onAcquirItem = ifo.GetFieldByLabel('Mod_OnAcquirItem').GetValue();
      this.scripts.onActvItem = ifo.GetFieldByLabel('Mod_OnActvtItem').GetValue();
      this.scripts.onClientEntr = ifo.GetFieldByLabel('Mod_OnClientEntr').GetValue();
      this.scripts.onClientLeav = ifo.GetFieldByLabel('Mod_OnClientLeav').GetValue();
      this.scripts.onHeartbeat = ifo.GetFieldByLabel('Mod_OnHeartbeat').GetValue();
      this.scripts.onModLoad = ifo.GetFieldByLabel('Mod_OnModLoad').GetValue();
      this.scripts.onModStart = ifo.GetFieldByLabel('Mod_OnModStart').GetValue();
      this.scripts.onPlrDeath = ifo.GetFieldByLabel('Mod_OnPlrDeath').GetValue();
      this.scripts.onPlrDying = ifo.GetFieldByLabel('Mod_OnPlrDying').GetValue();
      this.scripts.onPlrLvlUp = ifo.GetFieldByLabel('Mod_OnPlrLvlUp').GetValue();
      this.scripts.onPlrRest = ifo.GetFieldByLabel('Mod_OnPlrRest').GetValue();
      this.scripts.onSpawnBtnDn = ifo.GetFieldByLabel('Mod_OnSpawnBtnDn').GetValue();
      this.scripts.onUnAqreItem = ifo.GetFieldByLabel('Mod_OnUnAqreItem').GetValue();
      this.scripts.onUsrDefined = ifo.GetFieldByLabel('Mod_OnUsrDefined').GetValue();

      this.Mod_StartDay = ifo.GetFieldByLabel('Mod_StartDay').GetValue();
      this.Mod_StartHour = ifo.GetFieldByLabel('Mod_StartHour').GetValue();
      this.Mod_StartMonth = ifo.GetFieldByLabel('Mod_StartMonth').GetValue();

      if(ifo.RootNode.HasField('Mod_StartMovie')){
        this.Mod_StartMovie = ifo.GetFieldByLabel('Mod_StartMovie').GetValue();
      }else{
        this.Mod_StartMovie = '';
      }

      this.Mod_StartYear = ifo.GetFieldByLabel('Mod_StartYear').GetValue();

      this.Mod_Tag = ifo.GetFieldByLabel('Mod_Tag').GetValue();

      if(ifo.RootNode.HasField('Mod_VO_ID')){
        this.Mod_VO_ID = ifo.GetFieldByLabel('Mod_VO_ID').GetValue();
      }

      this.Mod_Version = ifo.GetFieldByLabel('Mod_Version').GetValue();
      this.Mod_XPScale = ifo.GetFieldByLabel('Mod_XPScale').GetValue();

      if(ifo.RootNode.HasField('Mod_NextCharId0'))
        this.Mod_NextCharId0 = ifo.GetFieldByLabel('Mod_NextCharId0').GetValue();

      if(ifo.RootNode.HasField('Mod_NextCharId1'))
        this.Mod_NextCharId1 = ifo.GetFieldByLabel('Mod_NextCharId1').GetValue();

      if(ifo.RootNode.HasField('Mod_NextObjId0'))
        this.Mod_NextObjId0 = ifo.GetFieldByLabel('Mod_NextObjId0').GetValue();

      if(ifo.RootNode.HasField('Mod_NextObjId1'))
        this.Mod_NextObjId1 = ifo.GetFieldByLabel('Mod_NextObjId1').GetValue();

    }
  }

  addEffect(effect = undefined, lLocation = undefined){
    if(effect instanceof GameEffect){
      let object = {
        model: new THREE.Object3D(),
        position: lLocation.position,
        dispose: function(){
          this.onRemove();
          this.removeEffect(this);
        },
        removeEffect: function(effect){
          let index = Game.module.effects.indexOf(effect);
          if(index >= 0){
            Game.module.effects.splice(index, 1);
          }
        }
      };

      object.audioEmitter = new AudioEmitter({
        engine: Game.audioEngine,
        props: object,
        template: {
          sounds: [],
          isActive: true,
          isLooping: false,
          isRandom: false,
          isRandomPosition: false,
          interval: 0,
          intervalVariation: 0,
          maxDistance: 50,
          volume: 127,
          positional: 1
        },
        onLoad: () => {
        },
        onError: () => {
        }
      });
      Game.audioEngine.AddEmitter(object.audioEmitter);
      object.audioEmitter.SetPosition(lLocation.position.x, lLocation.position.y, lLocation.position.z);

      object.model.position.copy(lLocation.position);

      effect.setObject(object);
      effect.onApply(object);
      this.effects.push(effect);

      Game.group.effects.add(object.model);
    }
  }

  tick(delta = 0){

    if(this.readyToProcessEvents){

      //Process EventQueue
      let eqLen = this.eventQueue.length - 1;
      for(let i = eqLen; i >= 0; i--){
        let event = this.eventQueue[i];
        
        if(event.id == Module.EventID.TIMED_EVENT){
          if( ( Game.time * 1000 ) >= event.time ){
            if(event.script instanceof NWScriptInstance){
              event.script.beginLoop({
                _instr: null, 
                index: -1, 
                seek: event.offset,
                onComplete: () => { 
                  //console.log('ScriptEvent: complete', event); 
                }
              });
            }

            this.eventQueue.splice(i, 1);
          }
        }
      }

      //Process EffectList
      let elLen = this.effects.length - 1;
      for(let i = elLen; i >= 0; i--){
        this.effects[i].update(delta);
      }

    }

  }


  setReturnStrRef(enabled = false, str1 = -1, str2 = -1){
    Game.MenuMap.BTN_RETURN.setText(Global.kotorTLK.GetStringById(str1));
  }

  loadScene( onLoad = null, onProgress = null ){

    PartyManager.party = [];
    
    ModuleObject.ResetPlayerId();

    if(this.area.SunFogOn && this.area.SunFogColor){
      Game.globalLight.color.setHex('0x'+this.area.SunFogColor.toString(16));
    }else{
      Game.globalLight.color.setHex('0x'+this.area.DynAmbientColor.toString(16));
    }
    
    Game.globalLight.color.setRGB(
      THREE.Math.clamp(Game.globalLight.color.r, 0.2, 1),
      THREE.Math.clamp(Game.globalLight.color.g, 0.2, 1),
      THREE.Math.clamp(Game.globalLight.color.b, 0.2, 1),
    );

    Game.camera.position.setX(this['Mod_Entry_X']);
    Game.camera.position.setY(this['Mod_Entry_Y']);
    Game.camera.position.setZ(this['Mod_Entry_Z'] + 2);
    Game.camera.rotation.set(Math.PI / 2, -Math.atan2(this['Mod_Entry_Dir_X'], this['Mod_Entry_Dir_Y']), 0);

    //this.camera.pitch = THREE.Math.radToDeg(this.camera.rotation.y) * -1;
    //this.camera.yaw = THREE.Math.radToDeg(this.camera.rotation.x);

    let ypr = this.toEulerianAngle(Game.camera.quaternion);

    Game.camera.pitch = THREE.Math.radToDeg(ypr.pitch);
    Game.camera.yaw = THREE.Math.radToDeg(ypr.yaw) * -1;

    if (Game.camera.pitch > 89.0)
      Game.camera.pitch = 89.0;
    if (Game.camera.pitch < -89.0)
      Game.camera.pitch = -89.0;

    for(let i = 0, len = this.area.cameras.length; i < len; i++){
      let cam = this.area.cameras[i];
      cam.InitProperties();
      let camera = new THREE.PerspectiveCamera(cam.fov, $(window).innerWidth() / $(window).innerHeight(), 0.1, 1500);
      camera.up = new THREE.Vector3( 0, 1, 0 );
      camera.position.set(cam.position.x, cam.position.y, cam.position.z + cam.height);
      camera.rotation.reorder('YZX');
      let quat = new THREE.Quaternion().copy(cam.orientation);
      let rot = quat.multiplyVector3(new THREE.Vector3(1, 1, 0));
      camera.rotation.x = THREE.Math.degToRad(cam.pitch);
      camera.rotation.z = -Math.atan2(cam.orientation.w, -cam.orientation.x)*2;

      //Clipping hack
      camera.position.add(new THREE.Vector3(0, 0, 0.5).applyEuler(camera.rotation));

      camera.ingameID = cam.cameraID;
      Game.staticCameras.push(camera);

      camera._cam = cam;
    }

    Game.LoadScreen.setProgress(0);

    try{
      Game.InGameOverlay.SetMapTexture('lbl_map'+this.Mod_Entry_Area);
      Game.MenuMap.SetMapTexture('lbl_map'+this.Mod_Entry_Area);
    }catch(e){

    }

    this.area.loadScene( () => {
      if(typeof onLoad === 'function')
        onLoad();

      this.transWP = null;
    });

  }

  initScripts(onComplete = null){

    let initScripts = [];

    if(this.scripts.onModLoad != ''){
      initScripts.push('onModLoad');
    }
    
    if(this.scripts.onClientEntr != ''){
      initScripts.push('onClientEntr');
    }

    let keys = Object.keys(this.scripts);
    let loop = new AsyncLoop({
      array: initScripts,
      onLoop: async (key, asyncLoop) => {
        let _script = this.scripts[key];
        if(_script != '' && !(_script instanceof NWScriptInstance)){
          //let script = await NWScript.Load(_script);
          this.scripts[key] = await NWScript.Load(_script);
          if(this.scripts[key] instanceof NWScriptInstance){
            //this.scripts[key].name = _script;
            this.scripts[key].enteringObject = Game.player;
            this.scripts[key].run(Game.module.area, 0, () => {
              asyncLoop.next();
            });
          }else{
            console.error('Module failed to load script', _script, key);
            asyncLoop.next();
          }
        }else{
          asyncLoop.next();
        }
      }
    });
    loop.iterate(() => {
      //Load any MiniGame scripts if available
      this.miniGameScripts( () => {
        //Load the Module Area's onEnter Script
        if(this.area.scripts.onEnter instanceof NWScriptInstance){
          console.log('onEnter', this.area.scripts.onEnter)
          this.area.scripts.onEnter.enteringObject = Game.player;
          this.area.scripts.onEnter.debug.action = true;
          this.area.scripts.onEnter.run(this.area, 0, () => {
            if(typeof onComplete === 'function')
              onComplete();
          });
        }else{
          if(typeof onComplete === 'function')
            onComplete();
        }
      });
    });
    
  }

  miniGameScripts(onComplete = null){

    if(!Game.module.area.MiniGame){
      if(typeof onComplete === 'function')
        onComplete();
      return;
    }

    let loop = new AsyncLoop({
      array: this.area.MiniGame.Enemies,
      onLoop: (enemy, asyncLoop) => {
        if(enemy.scripts.onCreate instanceof NWScriptInstance){
          enemy.scripts.onCreate.run(enemy, 0, () => {
            asyncLoop.next();
          });
        }else{
          asyncLoop.next();
        }
      }
    });
    loop.iterate(() => {
      if(typeof onComplete === 'function')
        onComplete();
    });

  }

  getCameraStyle(){
    return Global.kotor2DA["camerastyle"].rows[this.area.CameraStyle];
  }

  setCustomToken(tokenNumber = 0, tokenValue = ''){
    this.customTokens.set(tokenNumber, tokenValue);
  }

  getCustomToken(tokenNumber){
    return this.customTokens.get(tokenNumber) || `<Missing CustomToken ${tokenNumber}>`;
  }

  initEventQueue(){
    //Load module EventQueue after the area is intialized so that ModuleObject ID's are set
    if(this.ifo.RootNode.HasField('EventQueue')){
      let eventQueue = this.ifo.GetFieldByLabel('EventQueue').GetChildStructs();
      for(let i = 0; i < eventQueue.length; i++){
        let event_struct = eventQueue[i];
        console.log(event_struct);
        let event = {
          id: event_struct.GetFieldByLabel('EventId').GetValue()
        }
        if(event.id == Module.EventID.TIMED_EVENT){

          let eventData = event_struct.GetFieldByLabel('EventData').GetChildStructs()[0];

          let script = new NWScript();
          script.name = eventData.GetFieldByLabel('Name').GetValue();
          script.init(
            eventData.GetFieldByLabel('Code').GetVoid(),
            eventData.GetFieldByLabel('CodeSize').GetValue()
          );

          let scriptInstance = script.newInstance();
          scriptInstance.isStoreState = true;
          scriptInstance.setCaller(ModuleObject.GetObjectById(event_struct.GetFieldByLabel('ObjectId').GetValue()) );

          let stackStruct = eventData.GetFieldByLabel('Stack').GetChildStructs()[0];
          scriptInstance.stack = NWScriptStack.FromActionStruct(stackStruct);

          event.script = scriptInstance;
          event.offset = eventData.GetFieldByLabel('InstructionPtr').GetValue();
          event.day = event_struct.GetFieldByLabel('Day').GetValue();
          event.time = event_struct.GetFieldByLabel('Time').GetValue();
          this.eventQueue.push(event);
        }
      }
    }
  }

  static async GetModuleMod(modName = ''){
    return new Promise( (resolve, reject) => {
      let resource_path = path.join(app_profile.directory, 'modules', modName+'.mod');
      new ERFObject(path.join(app_profile.directory, 'modules', modName+'.mod'), (mod) => {
        console.log('Module.GetModuleMod success', resource_path);
        resolve(mod);
      }, () => {
        console.error('Module.GetModuleMod failed', resource_path);
        resolve(undefined);
      });
    });
  }

  static async GetModuleRimA(modName = ''){
    return new Promise( (resolve, reject) => {
      let resource_path = path.join(app_profile.directory, 'modules', modName+'.rim');
      new RIMObject(path.join(app_profile.directory, 'modules', modName+'.rim'), (rim) => {
        resolve(rim);
      }, () => {
        console.error('Module.GetModuleRimA failed', resource_path);
        resolve(undefined);
      });
    });
  }

  static async GetModuleRimB(modName = ''){
    return new Promise( (resolve, reject) => {
      let resource_path = path.join(app_profile.directory, 'modules', modName+'_s.rim');
      new RIMObject(path.join(app_profile.directory, 'modules', modName+'_s.rim'), (rim) => {
        resolve(rim);
      }, () => {
        console.error('Module.GetModuleRimB failed', resource_path);
        resolve(undefined);
      });
    });
  }

  static async GetModuleLipsLoc(){
    return new Promise( (resolve, reject) => {
      let resource_path = path.join(app_profile.directory, 'lips', 'localization.mod');
      new ERFObject(path.join(app_profile.directory, 'lips', 'localization.mod'), (mod) => {
        console.log('Module.GetModuleLipsLoc success', resource_path);
        resolve(mod);
      }, () => {
        console.error('Module.GetModuleLipsLoc failed', resource_path);
        resolve(undefined);
      });
    });
  }

  static async GetModuleLips(modName = ''){
    return new Promise( (resolve, reject) => {
      let resource_path = path.join(app_profile.directory, 'lips', modName+'_loc.mod');
      new ERFObject(path.join(app_profile.directory, 'lips', modName+'_loc.mod'), (mod) => {
        resolve(mod);
      }, () => {
        console.error('Module.GetModuleLips failed', resource_path);
        resolve(undefined);
      });
    });
  }

  static async GetModuleDLG(modName = ''){
    return new Promise( (resolve, reject) => {
      let resource_path = path.join(app_profile.directory, 'modules', modName+'_dlg.erf');
      new ERFObject(resource_path, (mod) => {
        resolve(mod);
      }, () => {
        console.error('Module.GetModuleDLG failed', resource_path);
        resolve(undefined);
      });
    });
  }

  static async GetModuleArchives(modName = ''){
    return new Promise( async (resolve, reject) => {
      let archives = [];
      let archive = undefined;

      let isModuleSaved = Game.SaveGame && Game.SaveGame.IsModuleSaved(modName);

      try{
        if(isModuleSaved){
          archive = await Game.SaveGame.GetModuleRim(modName);
          if(archive instanceof ERFObject){
            archives.push(archive);
          }

          //Locate the module's MOD file
          archive = await Module.GetModuleMod(modName);
          if(archive instanceof ERFObject){
            archives.push(archive);
          }

          //Locate the module's RIM_S file
          archive = await Module.GetModuleRimB(modName);
          if(archive instanceof RIMObject){
            archives.push(archive);
          }
        }else{
          //Locate the module's MOD file
          archive = await Module.GetModuleMod(modName);
          if(archive instanceof ERFObject){
            archives.push(archive);
          }

          //Locate the module's RIM file
          archive = await Module.GetModuleRimA(modName);
          if(archive instanceof RIMObject){
            archives.push(archive);
          }

          //Locate the module's RIM_S file
          archive = await Module.GetModuleRimB(modName);
          if(archive instanceof RIMObject){
            archives.push(archive);
          }
        }

        //Locate the module's LIPs file
        archive = await Module.GetModuleLips(modName);
        if(archive instanceof ERFObject){
          archives.push(archive);
        }

        //Locate the global LIPs file
        archive = await Module.GetModuleLipsLoc(modName);
        if(archive instanceof ERFObject){
          archives.push(archive);
        }

        //Locate the module's dialog MOD file (TSL)
        archive = await Module.GetModuleDLG(modName);
        if(archive instanceof ERFObject){
          archives.push(archive);
        }
      }catch(e){
        console.error(e);
      }
      
      //Return the archive array
      resolve(archives);
    });
  }

  static async GetModuleProjectArchives(modName = ''){
    return new Promise( async (resolve, reject) => {
      let archives = [];
      let archive = undefined;

      try{
        //Locate the module's RIM file
        archive = await Module.GetModuleRimA(modName);
        if(archive instanceof RIMObject){
          archives.push(archive);
        }

        //Locate the module's RIM_S file
        archive = await Module.GetModuleRimB(modName);
        if(archive instanceof RIMObject){
          archives.push(archive);
        }

        //Locate the module's dialog MOD file (TSL)
        archive = await Module.GetModuleDLG(modName);
        if(archive instanceof ERFObject){
          archives.push(archive);
        }
      }catch(e){
        console.error(e);
      }
      
      //Return the archive array
      resolve(archives);
    });
  }

  //ex: end_m01aa end_m01aa_s
  static BuildFromExisting(modName = null, waypoint = null, onComplete = null){
    console.log('BuildFromExisting', modName);
    let module = new Module();
    module.filename = modName;
    module.transWP = waypoint;
    Game.module = module;
    if(modName != null){
      try{
        Module.GetModuleArchives(modName).then( (archives) => {
          Game.module.archives = archives;

          ResourceLoader.loadResource(ResourceTypes['ifo'], 'module', (ifo_data) => {
            
            new GFFObject(ifo_data, (ifo, rootNode) => {

              Game.module.setFromIFO(ifo, Game.isLoadingSave);
              Game.time = Game.module.Mod_PauseTime / 1000;

              ResourceLoader.loadResource(ResourceTypes['git'], module.Mod_Entry_Area, (data) => {
                new GFFObject(data, (git, rootNode) => {
                  Game.module.git = git;
                  ResourceLoader.loadResource(ResourceTypes['are'], module.Mod_Entry_Area, (data) => {
                    new GFFObject(data, (are, rootNode) => {
                      Game.module.are = are;
                      module.area = new ModuleArea(module.Mod_Entry_Area, are, git);
                      module.Mod_Area_list = [module.area];
                      module.area.module = module;
                      module.area.SetTransitionWaypoint(module.transWP);
                      module.area.Load( () => {

                        if(module.Mod_NextObjId0)
                          ModuleObject.COUNT = module.Mod_NextObjId0;

                        if(typeof onComplete == 'function')
                          onComplete(module);
                      });                        
                    });
                  });
                });
              });
            });
          }, (err) => {
            console.error('LoadModule', err);
            Game.module = undefined;
          });
        });
      }catch(e){
        Game.module = undefined;
      }
    }
    return module;
  }

  //This should only be used inside KotOR Forge
  static FromProject(directory = null, onComplete = null){
    console.log('BuildFromExisting', directory);
    let module = new Module();
    module.transWP = null;
    Game.module = module;
    if(directory != null){

      fs.readFile(path.join(directory, 'module.ifo'), (err, ifo_data) => {
        new GFFObject(ifo_data, (ifo) => {
          console.log('Module.FromProject', 'IFO', ifo);
          try{
            Game.module.setFromIFO(ifo);
            Game.time = Game.module.Mod_PauseTime / 1000;

            fs.readFile(path.join(directory, module.Mod_Entry_Area+'.git'), (err, data) => {
              new GFFObject(data, (git) => {
                console.log('Module.FromProject', 'GIT', git);
                fs.readFile(path.join(directory, module.Mod_Entry_Area+'.are'), (err, data) => {
                  new GFFObject(data, (are) => {
                    console.log('Module.FromProject', 'ARE', are);
                    module.area = new ModuleArea(module.Mod_Entry_Area, are, git);
                    module.area.module = module;
                    module.Mod_Area_list = [module.area];
                    module.area.SetTransitionWaypoint(module.transWP);
                    module.area.Load( () => {
                      if(typeof onComplete == 'function')
                        onComplete(module);
                    });                        
                  });
                });
              });
            });
          }catch(e){
            console.error(e);
          }
        });
      });
      
    }
    return module;
  }

  toEulerianAngle(q){
  	let ysqr = q.y * q.y;

  	// roll (x-axis rotation)
  	let t0 = +2.0 * (q.w * q.x + q.y * q.z);
  	let t1 = +1.0 - 2.0 * (q.x * q.x + ysqr);
  	let roll = Math.atan2(t0, t1);

  	// pitch (y-axis rotation)
  	let t2 = +2.0 * (q.w * q.y - q.z * q.x);
  	t2 = t2 > 1.0 ? 1.0 : t2;
  	t2 = t2 < -1.0 ? -1.0 : t2;
  	let pitch = Math.asin(t2);

  	// yaw (z-axis rotation)
  	let t3 = +2.0 * (q.w * q.z + q.x *q.y);
  	let t4 = +1.0 - 2.0 * (ysqr + q.z * q.z);
  	let yaw = Math.atan2(t3, t4);

    return {yaw: yaw, pitch: pitch, roll: roll};
  }

  Save(){

    //Export .ifo

    //Export .are

    //Export .git

    return {
      are: null,
      git: null,
      ifo: null
    };

  }

  static FromJSON(path){
    let module = new Module();
    if(path != null){
      let json = JSON.parse(fs.readFileSync(path, 'utf8'));

      module = Object.assign(new Module(), json);

      //module.area = new ModuleArea();
      module.area = Object.assign(new ModuleArea(), json.area);

    }else{
      this.path = Global.Project.directory;
    }
    return module;
  }

  toolsetExportIFO(){
    let ifo = new GFFObject();
    ifo.FileType = 'IFO ';

    ifo.RootNode.AddField( new Field(GFFDataTypes.WORD, 'Expansion_Pack', this.Expansion_Pack) );
    let areaList = ifo.RootNode.AddField( new Field(GFFDataTypes.LIST, 'Mod_Area_list') );

    //KotOR only supports one Area per module
    if(this.area instanceof ModuleArea){
      let areaStruct = new Struct(6);
      areaStruct.AddField( new Field(GFFDataTypes.RESREF, 'Area_Name', this.area._name) );
      areaList.AddChildStruct(areaStruct);
    }

    ifo.RootNode.AddField( new Field(GFFDataTypes.INT, 'Mod_Creator_ID', this.Expansion_Pack) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.LIST, 'Mod_CutSceneList') );
    ifo.RootNode.AddField( new Field(GFFDataTypes.BYTE, 'Mod_DawnHour', this.Mod_DawnHour) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.CEXOLOCSTRING, 'Mod_Description'), this.Mod_Description );
    ifo.RootNode.AddField( new Field(GFFDataTypes.BYTE, 'Mod_DuskHour', this.Mod_DuskHour) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_Entry_Area', this.Mod_Entry_Area) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.FLOAT, 'Mod_Entry_Dir_X', this.Mod_Entry_Dir_X) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.FLOAT, 'Mod_Entry_Dir_Y', this.Mod_Entry_Dir_Y) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.FLOAT, 'Mod_Entry_X', this.Mod_Entry_X) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.FLOAT, 'Mod_Entry_Y', this.Mod_Entry_Y) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.FLOAT, 'Mod_Entry_Z', this.Mod_Entry_Z) );

    ifo.RootNode.AddField( new Field(GFFDataTypes.LIST, 'Mod_Expan_List') );
    ifo.RootNode.AddField( new Field(GFFDataTypes.LIST, 'Mod_GVar_List') );

    ifo.RootNode.AddField( new Field(GFFDataTypes.CEXOSTRING, 'Mod_Hak', this.Mod_Hak) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.VOID, 'Mod_ID') ).SetData(this.Mod_ID || Buffer.alloc(16));
    ifo.RootNode.AddField( new Field(GFFDataTypes.BYTE, 'Mod_IsSaveGame', 0) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.BYTE, 'Mod_MinPerHour', this.Mod_MinPerHour) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.CEXOLOCSTRING, 'Mod_Name'), this.Mod_Name );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnAcquirItem', this.onAcquirItem) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnActvtItem', this.onActvItem) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnClientEntr', this.onClientEntr) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnClientLeav', this.onClientLeav) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnHeartbeat', this.onHeartbeat) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnModLoad', this.onModLoad) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnModStart', this.onModStart) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnPlrDeath', this.onPlrDeath) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnPlrDying', this.onPlrDying) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnPlrLvlUp', this.onPlrLvlUp) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnPlrRest', this.onPlrRest) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnSpawnBtnDn', this.onSpawnBtnDn) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnUnAqreItem', this.onUnAqreItem) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_OnUsrDefined', this.onUsrDefined) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.WORD, 'Mod_StartDay', this.Mod_StartDay) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.WORD, 'Mod_StartHour', this.Mod_StartHour) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.WORD, 'Mod_StartMonth', this.Mod_StartMonth) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.RESREF, 'Mod_StartMovie', this.Mod_StartMovie) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.WORD, 'Mod_StartYear', this.Mod_StartYear) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.CEXOSTRING, 'Mod_Tag', this.Mod_Tag) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.CEXOSTRING, 'Mod_VO_ID', this.Mod_VO_ID) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.DWORD, 'Mod_Version', this.Mod_Version) );
    ifo.RootNode.AddField( new Field(GFFDataTypes.BYTE, 'Mod_XPScale', this.Mod_XPScale) );

    return ifo;

  }

}

Module.EventID = {
  TIMED_EVENT: 1,
  ENTERED_TRIGGER: 2,
  LEFT_TRIGGER: 3,
  REMOVE_FROM_AREA: 4,
  APPLY_EFFECT: 5,
  CLOSE_OBJECT: 6,
  OPEN_OBJECT: 7,
  SPELL_IMPACT: 8,
  PLAY_ANIMATION: 9,
  SIGNAL_EVENT: 10,
  DESTROY_OBJECT: 11,
  UNLOCK_OBJECT: 12,
  LOCK_OBJECT: 13,
  REMOVE_EFFECT: 14,
  ON_MELEE_ATTACKED: 15,
  DECREMENT_STACKSIZE: 16,
  SPAWN_BODY_BAG: 17,
  FORCED_ACTION: 18,
  ITEM_ON_HIT_SPELL_IMPACT: 19,
  BROADCAST_AOO: 20,
  BROADCAST_SAFE_PROJECTILE: 21,
  FEEDBACK_MESSAGE: 22,
  ABILITY_EFFECT_APPLIED: 23,
  SUMMON_CREATURE: 24,
  AQUIRE_ITEM: 25
}

module.exports = Module;
