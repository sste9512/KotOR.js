import * as THREE from "three";

export class TileColor {

  red: number = 0;
  green: number = 0;
  blue: number = 0;
  color: THREE.Color = new THREE.Color();

  static From2DA(row: any = {}){
    const tileColor = new TileColor();
    if(typeof row.red !== 'undefined') tileColor.red = parseFloat(row.red);
    if(typeof row.green !== 'undefined') tileColor.green = parseFloat(row.green);
    if(typeof row.blue !== 'undefined') tileColor.blue = parseFloat(row.blue);

    tileColor.color = new THREE.Color( tileColor.red, tileColor.green, tileColor.blue );
    return tileColor;
  }

}
