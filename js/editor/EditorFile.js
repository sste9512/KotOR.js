class EditorFile {

  constructor( options = {} ){

    options = Object.assign({
      path: null,
      resref: null,
      restype: null,
      ext: null,
      archive_path: null,
      location: EditorFile.LOCATION_TYPE.OTHER,
      buffer: []
    }, options);

    console.log(options);

    this.resref = options.resref;
    this.buffer = options.buffer;
    this.path = options.path;
    this.ext = options.ext;
    this.reskey = options.reskey;
    this.archive_path = options.archive_path;
    this.location = options.location;
    this.unsaved_changes = false;

    if(!this.ext && this.reskey){
      this.ext = ResourceTypes.getKeyByValue(this.reskey);
    }

    this.setPath(this.path);

    if(!this.ext && this.reskey){
      this.ext = ResourceTypes.getKeyByValue(this.reskey);
    }

    if(this.location == EditorFile.LOCATION_TYPE.OTHER)
      this.unsaved_changes = true;

    this.onSavedStateChanged = undefined;

  }

  setPath(filepath){
    this.path = filepath;
    if(typeof this.path === 'string'){
      let path_obj = path.parse(this.path);

      this.location = EditorFile.LOCATION_TYPE.LOCAL;

      //Test for archive file path
      if(this.path.indexOf('?') >= 0){
        let pth = this.path.split('?');
        this.path = pth[1];
        this.archive_path = pth[0];
        this.location = EditorFile.LOCATION_TYPE.ARCHIVE;
        path_obj = path.parse(this.path);
      }

      if(path_obj.name){
        this.resref = path_obj.name;
      }

      if(!this.reskey){
        this.reskey = ResourceTypes[path_obj.ext.slice(1)];
      }

      this.ext = ResourceTypes.getKeyByValue(this.reskey);
    }
  }

  getPath(){
    //Check to see if the EditorFile has the path variable set.
    //If not it's because the file was created in memory and hasn't been saved to the HDD yet
    if(this.path && !this.archive_path){
      return this.path;
    }else if(this.archive_path){
      return this.archive_path + '?' + this.resref + '.' + this.ext;
    }
    return undefined;
  }

  readFile( onLoad = null ){

    if(this.reskey == ResourceTypes.mdl || this.reskey == ResourceTypes.mdx){
      //Mdl / Mdx Special Loader
      if(this.archive_path){
        let archive_path = path.parse(this.archive_path);
        switch(archive_path.ext.slice(1)){
          case 'bif':
            new BIFObject(this.archive_path, (archive) => {

              if(!(this.buffer instanceof Buffer)){
                archive.GetResourceData(archive.GetResourceByLabel(this.resref, this.reskey), (buffer) => {
                  this.buffer = buffer;
                  let mdl_mdx_key = ResourceTypes.mdx;
                  if(this.reskey == ResourceTypes.mdx){
                    mdl_mdx_key = ResourceTypes.mdl;
                    archive.GetResourceData(archive.GetResourceByLabel(this.resref, mdl_mdx_key), (buffer) => {
                      this.buffer2 = buffer;
                      if(typeof onLoad === 'function'){
                        onLoad(buffer, this.buffer);
                      }
                    });
                  }else{
                    archive.GetResourceData(archive.GetResourceByLabel(this.resref, mdl_mdx_key), (buffer) => {
                      this.buffer2 = buffer;
                      if(typeof onLoad === 'function'){
                        onLoad(this.buffer, buffer);
                      }
                    });
                  }
                });
              }else{
                let mdl_mdx_key = ResourceTypes.mdx;
                if(this.reskey == ResourceTypes.mdx){
                  mdl_mdx_key = ResourceTypes.mdl;
                  archive.GetResourceData(archive.GetResourceByLabel(this.resref, mdl_mdx_key), (buffer) => {
                    this.buffer2 = buffer;
                    if(typeof onLoad === 'function'){
                      onLoad(buffer, this.buffer);
                    }
                  });
                }else{
                  archive.GetResourceData(archive.GetResourceByLabel(this.resref, mdl_mdx_key), (buffer) => {
                    this.buffer2 = buffer;
                    if(typeof onLoad === 'function'){
                      onLoad(this.buffer, buffer);
                    }
                  });
                }
              }

            });
          break;
          case 'erf':
          case 'mod':
            new ERFObject(this.archive_path, (archive) => {

              if(!(this.buffer instanceof Buffer)){
                archive.getRawResource(this.resref, this.reskey, (buffer) => {
                  this.buffer = buffer;
                  let mdl_mdx_key = ResourceTypes.mdx;
                  if(this.reskey == ResourceTypes.mdx){
                    mdl_mdx_key = ResourceTypes.mdl;
                    archive.getRawResource(this.resref, mdl_mdx_key, (buffer) => {
                      this.buffer2 = buffer;
                      if(typeof onLoad === 'function'){
                        onLoad(buffer, this.buffer);
                      }
                    });
                  }else{
                    archive.getRawResource(this.resref, mdl_mdx_key, (buffer) => {
                      this.buffer2 = buffer;
                      if(typeof onLoad === 'function'){
                        onLoad(this.buffer, buffer);
                      }
                    });
                  }
                });
              }else{
                let mdl_mdx_key = ResourceTypes.mdx;
                if(this.reskey == ResourceTypes.mdx){
                  mdl_mdx_key = ResourceTypes.mdl;
                  archive.getRawResource(this.resref, mdl_mdx_key, (buffer) => {
                    this.buffer2 = buffer;
                    if(typeof onLoad === 'function'){
                      onLoad(buffer, this.buffer);
                    }
                  });
                }else{
                  archive.getRawResource(this.resref, mdl_mdx_key, (buffer) => {
                    this.buffer2 = buffer;
                    if(typeof onLoad === 'function'){
                      onLoad(this.buffer, buffer);
                    }
                  });
                }
              }

            });
          break;
          case 'rim':
            new RIMObject(this.archive_path, (archive) => {

              if(!(this.buffer instanceof Buffer)){
                archive.GetResourceData(archive.GetResourceByLabel(this.resref, this.reskey), (buffer) => {
                  this.buffer = buffer;
                  let mdl_mdx_key = ResourceTypes.mdx;
                  if(this.reskey == ResourceTypes.mdx){
                    mdl_mdx_key = ResourceTypes.mdl;
                    archive.GetResourceData(archive.GetResourceByLabel(this.resref, mdl_mdx_key), (buffer) => {
                      this.buffer2 = buffer;
                      if(typeof onLoad === 'function'){
                        onLoad(buffer, this.buffer);
                      }
                    });
                  }else{
                    archive.GetResourceData(archive.GetResourceByLabel(this.resref, mdl_mdx_key), (buffer) => {
                      this.buffer2 = buffer;
                      if(typeof onLoad === 'function'){
                        onLoad(this.buffer, buffer);
                      }
                    });
                  }
                });
              }else{
                let mdl_mdx_key = ResourceTypes.mdx;
                if(this.reskey == ResourceTypes.mdx){
                  mdl_mdx_key = ResourceTypes.mdl;
                  archive.GetResourceData(archive.GetResourceByLabel(this.resref, mdl_mdx_key), (buffer) => {
                    this.buffer2 = buffer;
                    if(typeof onLoad === 'function'){
                      onLoad(buffer, this.buffer);
                    }
                  });
                }else{
                  archive.GetResourceData(archive.GetResourceByLabel(this.resref, mdl_mdx_key), (buffer) => {
                    this.buffer2 = buffer;
                    if(typeof onLoad === 'function'){
                      onLoad(this.buffer, buffer);
                    }
                  });
                }
              }

            });
          break;
        }
      }else{
        if(this.buffer instanceof Buffer){

          if(this.buffer2 instanceof Buffer){
            if(typeof onLoad === 'function'){
              onLoad(this.buffer, this.buffer2);
            }
          }else{
            if(typeof onLoad === 'function'){
              onLoad(this.buffer, Buffer.alloc(0));
            }
          }

        }else{
          //Load the MDL file
          fs.readFile(this.path, (err, buffer) => {

            if(err) throw err;

            let root_dir = path.parse(this.path).dir;

            //Load the MDX file
            fs.readFile(path.join(root_dir, this.resref+'.mdx'), (err, buffer2) => {

              if(err) throw err;

              if(typeof onLoad === 'function'){
                this.buffer = buffer;
                this.buffer2 = buffer2;
                onLoad(buffer, buffer2);
              }

            });

          });

        }

      }
    }else{
      //Common Loader
      if(this.buffer instanceof Buffer){
        if(typeof onLoad === 'function'){
          onLoad(this.buffer);
        }
      }else{

        if(this.archive_path){
          let archive_path = path.parse(this.archive_path);
          console.log(archive_path.ext.slice(1))
          switch(archive_path.ext.slice(1)){
            case 'bif':
              new BIFObject(this.archive_path, (archive) => {

                archive.GetResourceData(archive.GetResourceByLabel(this.resref, this.reskey), (buffer) => {
                  this.buffer = buffer;
                  if(typeof onLoad === 'function'){
                    onLoad(this.buffer);
                  }
                });

              });
            break;
            case 'erf':
            case 'mod':
              new ERFObject(this.archive_path, (archive) => {

                archive.getRawResource(this.resref, this.reskey, (buffer) => {
                  this.buffer = buffer;
                  if(typeof onLoad === 'function'){
                    onLoad(this.buffer);
                  }
                });

              })
            break;
            case 'rim':
              new RIMObject(this.archive_path, (archive) => {

                archive.GetResourceData(archive.GetResourceByLabel(this.resref, this.reskey), (buffer) => {
                  this.buffer = buffer;
                  if(typeof onLoad === 'function'){
                    onLoad(this.buffer);
                  }
                });

              })
            break;
          }
        }else{
          if(typeof this.path === 'string'){
            fs.readFile(this.path, (err, buffer) => {

              if(err) throw err;

              this.buffer = buffer;

              if(typeof onLoad === 'function'){
                onLoad(this.buffer);
              }

            });
          }else{
            this.buffer = Buffer.alloc(0);
            if(typeof onLoad === 'function'){
              onLoad(this.buffer);
            }
          }
        }

      }
    }

  }

  getData(){
    return this.buffer;
  }

  getLocalPath(){
    if(!this.archive_path && this.path)
      return this.path;
    else
      return null;
  }

  getFilename(){
    return this.resref+'.'+this.ext;
  }

  setOnSavedStateChanged( listener ){
    if(typeof listener === 'function') this.onSavedStateChanged = listener;
  }

  updateOpenedFiles(){
    const recent_files = Config.getRecentFiles();
    //Update the opened files list
    if(this.getPath()){
      const index = recent_files.indexOf(this.getPath());
      if (index >= 0) {
        recent_files.splice(index, 1);
      }

      //Append this file to the beginning of the list
      recent_files.unshift(this.getPath());
      Config.save(null, true); //Save the configuration silently

      //Notify the project we have opened a new file
      if(Global.Project instanceof Project){
        Global.Project.addToOpenFileList(this);
      }
    }
  }

  save(){
    //stub
  }

  saveAs(){
    //stub
  }

  get unsaved_changes(){
    return this._unsaved_changes;
  };

  set unsaved_changes(value){
    this._unsaved_changes = ( value || (this.location == EditorFile.LOCATION_TYPE.OTHER) ) ? true : false;
    if(typeof this.onSavedStateChanged === 'function') this.onSavedStateChanged(this);
    if(!this.unsaved_changes) this.updateOpenedFiles();
  }

  get resref(){
    return this._resref;
  }

  set resref(value){
    this._resref = value;
    if(typeof this.onNameChanged === 'function') this.onNameChanged(this);
  }

  get reskey(){
    return this._reskey;
  }

  set reskey(value){
    console.log('reskey', value);
    this._reskey = value;
    this._ext = ResourceTypes.getKeyByValue(this.reskey);
    if(typeof this.onNameChanged === 'function') this.onNameChanged(this);
  }

  get ext(){
    return this._ext;
  }

  set ext(value){
    console.log('ext', value);
    this._ext = value;
    this._reskey = ResourceTypes[value];
    if(typeof this.onNameChanged === 'function') this.onNameChanged(this);
  }

}

EditorFile.LOCATION_TYPE = {
  OTHER: -1,
  ARCHIVE: 1,
  LOCAL: 2
}

module.exports = EditorFile;
