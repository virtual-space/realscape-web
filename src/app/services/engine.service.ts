import * as THREE from 'three';
import * as GLTFLoader from 'three/examples/jsm/loaders/GLTFLoader';
import * as ColladaLoader from 'three/examples/jsm/loaders/ColladaLoader';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import * as OrbitControls from 'three/examples/jsm/controls/OrbitControls';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private orbitControl;

  private frameId: number = null;
  private engineWrapper:ElementRef<HTMLElement> = null;

  public constructor(private ngZone: NgZone, private httpClient: HttpClient, private snackBar: MatSnackBar) {
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>, engineWrapper: ElementRef<HTMLElement>, src:string): void {

    window.addEventListener('resize', () => {
      this.resize();
    });

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    this.engineWrapper = engineWrapper;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });

    var width = engineWrapper.nativeElement.offsetWidth;
    var height = engineWrapper.nativeElement.offsetHeight;

    this.renderer.setSize(width, height);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      50, width / height, 0.1, 1000
    );

    //this.camera.position.z = 5;
    this.scene.add(this.camera);

    this.orbitControl = new OrbitControls.OrbitControls(this.camera, this.canvas);

    // soft white light
    this.light = new THREE.AmbientLight( 0x404040 );
    this.light.position.z = 10;
    this.scene.add(this.light);

    if (src) {
      const colladaLoader = new ColladaLoader.ColladaLoader();
      colladaLoader.load(src, (cld) => {
          const boundingBox = new THREE.Box3();
          if (cld && cld.scene) {
            boundingBox.setFromObject( cld.scene );

            let center = new THREE.Vector3();
            let size = new THREE.Vector3();

            boundingBox.getCenter(center);
            boundingBox.getSize(size);

            const maxDim = Math.max( size.x, size.y, size.z );

            const fov = this.camera.fov * ( Math.PI / 180 );
            let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );
            this.camera.position.z = cameraZ;

            const minZ = boundingBox.min.z;
            const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

            this.camera.far = cameraToFarEdge * 3;
            this.camera.lookAt(center);
            this.camera.updateProjectionMatrix();

            this.orbitControl.target = center;
            this.orbitControl.maxDistance = cameraToFarEdge * 2;
            this.orbitControl.saveState();
            this.scene.add(cld.scene);
            this.render();
          } else {
            this.snackBar.open('Error loading file. Only Collada files are supported.', 'Dismiss');
          }
        },
        (progressEvt) => {},
        (errEvt) => {
          this.snackBar.open('Error loading file. Only Collada files are supported.', 'Dismiss');
        });
    }
  }

  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
    });
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = this.engineWrapper.nativeElement.offsetWidth;
    const height = this.engineWrapper.nativeElement.offsetHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

  getSceneData(src:string) : Observable<any> {
    return this.httpClient.get(src, {responseType: 'blob'});
  }
}

