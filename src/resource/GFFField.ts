import { GFFDataType } from "../enums/resource/GFFDataType";
import { CExoLocString } from "./CExoLocString";
import { GFFObject } from "./GFFObject";
import { GFFStruct } from "./GFFStruct";
import * as THREE from "three";
import isBuffer from "is-buffer";

export class GFFField {
  uuid: string;
  type: number;
  label: string;
  data: Buffer;
  value: any;
  childStructs: GFFStruct[] = [];
  cexoLocString: CExoLocString;
  vector: THREE.Vector3;
  orientation: THREE.Quaternion;

  index: number = 0;
  labelIndex: number = 0;

  constructor(type: number = 0, label: string = "", value?: any){
    this.uuid = crypto.randomUUID();
    this.type = type;
    this.label = label;
    this.data = Buffer.alloc(0);
    this.value = value;
    this.childStructs = [];

    switch(this.type){
      case GFFDataType.CEXOSTRING:
      case GFFDataType.RESREF:
        if(typeof this.value !== 'string')
          this.value = '';
      break;
      case GFFDataType.CEXOLOCSTRING:
        this.value = 0;
        this.cexoLocString = (value instanceof CExoLocString) ? value : new CExoLocString();
      break;
      case GFFDataType.ORIENTATION:
        this.value = 0;
        if(typeof value == 'object' && typeof value.x == 'number' && typeof value.y == 'number' && typeof value.z == 'number' && typeof value.w == 'number'){
          this.orientation = value;
        }else{
          this.orientation = new THREE.Quaternion(0, 0, 0, 1);
        }
      break;
      case GFFDataType.VECTOR:
        this.value = 0;
        if(typeof value == 'object' && typeof value.x == 'number' && typeof value.y == 'number' && typeof value.z == 'number'){
          this.vector = value;
        }else{
          this.vector = new THREE.Vector3(0, 0, 0);
        }
      break;
      case GFFDataType.STRUCT:
        this.childStructs[0] = new GFFStruct();
      break;
      case GFFDataType.VOID:
        this.data = Buffer.alloc(0);
        this.value = 0;
      break;
    }

  }

  getType(): number {
    return this.type;
  }

  getLabel(): string {
    return this.label;
  }

  getVoid(){
    return this.data;
  }

  getValue(){
    switch(this.type){
      case GFFDataType.CEXOLOCSTRING:
        return this.cexoLocString.getValue();
      default:
        return this.value;
    }
  }

  getVector(){
    return this.vector;
  }

  getChildStructs(){
    return this.childStructs;
  }

  getChildStructByType(type = -1){
    for(let i = 0; i < this.childStructs.length; i++){
      if(this.childStructs[i].type == type)
        return this.childStructs[i];
    }
    return null;
  }

  getFieldByLabel(Label: string){
    if(this.childStructs.length){
      for(let i = 0; i < this.childStructs[0].fields.length; i++){
        let field = this.childStructs[0].fields[i];
        if (field.label == Label){
          return field;
        }
      }
    }

    return null;
  }

  getCExoLocString(){
    return this.cexoLocString;
  }

  getOrientation(){
    return this.orientation;
  }

  setData(data: Buffer){
    this.data = data;
    return this;
  }

  setValue(val: any){

    switch(this.type){
      case GFFDataType.CEXOLOCSTRING:
        if(val instanceof CExoLocString){
          this.cexoLocString = val;
        }else if(typeof val === 'number'){
          this.cexoLocString.setRESREF(val);
        }else if(typeof val === 'string'){
          this.cexoLocString.addSubString(val, 0);
        }
      break;
      case GFFDataType.RESREF:
        if(!val)
          val = '';

        if(typeof val !== 'string')
          val = val.toString()
        
        this.value = val;
      break;
      case GFFDataType.CEXOSTRING:
        if(!val)
          val = '';

        if(typeof val !== 'string')
          val = val.toString()
        
        this.value = val;
      break;
      case GFFDataType.CHAR:
        if(!val)
          val = '';

        if(typeof val !== 'string')
          val = val.toString()

        this.value = val.toString();
      break;
      case GFFDataType.BYTE:
        if(typeof val === 'undefined'){
          val = 0;
        }
        
        if(val >= 0 && val <= 255){
          this.value = val;
        }else{
          console.error('Field.setValue BYTE OutOfBounds', val, this);
          this.value = val;
        }
      break;
      case GFFDataType.SHORT:
        if(typeof val === 'undefined'){
          val = 0;
        }
        
        if(val >= -32768 && val <= 32767){
          this.value = val;
        }else{
          console.error('Field.setValue SHORT OutOfBounds', val, this);
          this.value = val;
        }
      break;
      case GFFDataType.INT:
        if(typeof val === 'undefined'){
          val = 0;
        }
        
        if(val >= -2147483648 && val <= 21474836487){
          this.value = val;
        }else{
          console.error('Field.setValue INT OutOfBounds', val, this);
          this.value = val;
        }
      break;
      case GFFDataType.WORD:
        if(typeof val === 'undefined'){
          val = 0;
        }

        if(val >= 0 && val <= 65535){
          this.value = val;
        }else{
          console.error('Field.setValue WORD OutOfBounds', val, this);
          this.value = val;
        }
      break;
      case GFFDataType.DWORD:
        if(typeof val === 'undefined'){
          val = 0;
        }

        if(val >= 0 && val <= 4294967296){
          this.value = val;
        }else{
          console.error('Field.setValue DWORD OutOfBounds', val, this);
          this.value = val;
        }
      break;
      case GFFDataType.VOID:
        if(isBuffer(val)){
          this.value = val;
        }else if(val instanceof ArrayBuffer){
          this.value = Buffer.from(val);
        }
      break;
      default:
        this.value = val;
      break;
    }
    return this;

  }

  setType(type: number){
    this.type = type;
    return this;
  }

  setLabel(label: string){
    this.label = label;
    return this;
  }

  setCExoLocString(val: CExoLocString){
    this.cexoLocString = val;
    return this;
  }

  setVector(v: THREE.Vector3){
    this.vector = v;
    return this;
  }

  setOrientation(v: THREE.Quaternion){
    this.orientation = v;
    return this;
  }

  addChildStruct(strt: GFFStruct){
    if(!(strt instanceof GFFStruct)){
      console.log('addChildStruct invalid type', strt);
      return this;
    }

    switch(this.type){
      case GFFDataType.LIST:
        this.childStructs.push(strt);
      break;
      case GFFDataType.STRUCT:
        this.childStructs[0] = strt;
      break;
    }

    return this;
  }

  removeChildStruct(strt: GFFStruct){
    let index = this.childStructs.indexOf(strt);
    if(index >= 0){
      this.childStructs.splice(index, 1);
    }
    return this;
  }

  setChildStructs(strts: GFFStruct[]){
    this.childStructs = strts;
    return this;
  }

  toJSON(){
    return GFFObject.FieldToJSON(this);
  }

}