import { Component, OnInit } from '@angular/core';
import { RnViewComponent } from '../rn-view/rn-view.component';
@Component({
  selector: 'app-rn-scene-view',
  templateUrl: './rn-scene-view.component.html',
  styleUrls: ['./rn-scene-view.component.sass']
})
export class RnSceneViewComponent extends RnViewComponent implements OnInit {

  gltfString = `{"accessors":[{"bufferView":0,"byteOffset":0,"count":3,"componentType":5126,"extras":{},"type":"VEC3","min":[-0.5,-0.5,0.0],"max":[0.5,0.5,0.0]},{"bufferView":0,"byteOffset":12,"count":3,"componentType":5126,"extras":{},"type":"VEC3"}],"asset":{"extras":{},"version":"2.0"},"buffers":[{"byteLength":72,"uri":"data:application/octet-stream;base64,AAAAAAAAAD8AAAAAAACAPwAAAAAAAAAAAAAAvwAAAL8AAAAAAAAAAAAAgD8AAAAAAAAAPwAAAL8AAAAAAAAAAAAAAAAAAIA/","extras":{}}],"bufferViews":[{"buffer":0,"byteLength":72,"byteStride":24,"target":34962,"extras":{}}],"extras":{},"meshes":[{"extras":{},"primitives":[{"attributes":{"POSITION":0,"COLOR_0":1},"extras":{}}]}],"nodes":[{"extras":{},"mesh":0}],"scenes":[{"extras":{},"nodes":[0]}]}`;
  gltfBlob = new Blob([this.gltfString], {
    type: "text/plain"
  });
  gltfUrl = URL.createObjectURL(this.gltfBlob, );

  //public sceneData: string = ''; 

  override initialize(): void {
    this.rendererService.initialize();
    const entity = document.querySelector('#entity');
    if(entity) {
      this.securePipe6.transform(this.getDataLink()).subscribe(res => {
        //////console.logres);
        const b = new Blob([res], {
          type: "application/octet-stream"
        });
        ////////console.logb);
        const u = URL.createObjectURL(b,);
        //this.sceneData = `url(${u})`;
        entity.setAttribute('gltf-model', `url(${u})`);
        //entity.setAttribute('animation-mixer','true');
      })
      //this.getDataLink()
      //entity.setAttribute('gltf-model', `url(${this.gltfUrl})`);
    }
  }
}
