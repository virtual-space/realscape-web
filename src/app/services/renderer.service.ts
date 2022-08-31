/* global AFRAME, THREE */
declare var AFRAME:any;
declare var THREE:any;

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RendererService {

  constructor() { }

  initialize() {
    //console.log('init renderer')
    /*
    AFRAME.registerComponent('ar-hit-test', {
      schema: {targetEl: {type: 'selector'}},
    
      init: function () {
        var self = this;
        var targetEl = this.data.targetEl;
        this.xrHitTestSource = null;
        this.viewerSpace = null;
        this.refSpace = null;
    
        this.el.sceneEl.renderer.xr.addEventListener(function () {
          self.viewerSpace = null;
          self.refSpace = null;
          self.xrHitTestSource = null;
        });
    
        this.el.sceneEl.addEventListener('enter-vr', function () {
          var el = self.el;
          var targetEl = self.data.targetEl;
          var session: any;
    
          if (!self.el.sceneEl.is('ar-mode')) { return; }
    
          session = self.el.sceneEl.renderer.xr.getSession();
    
          self.originalPosition = targetEl.object3D.position.clone();
          self.el.object3D.visible = true;
    
          session.addEventListener('select', function () {
            var position = el.getAttribute('position');
            targetEl.setAttribute('position', position);
            document.getElementById('light')!.setAttribute('position', JSON.stringify({
              x: (position.x - 2),
              y: (position.y + 4),
              z: (position.z + 2)
            }));
          });
    
          session.requestReferenceSpace('viewer').then(function (space: any) {
            self.viewerSpace = space;
            session.requestHitTestSource({space: self.viewerSpace})
                .then(function (hitTestSource:any) {
                  self.xrHitTestSource = hitTestSource;
                });
          });
    
          session.requestReferenceSpace('local-floor').then(function (space: any) {
            self.refSpace = space;
          });
        });
    
        this.el.sceneEl.addEventListener('exit-vr', function () {
          if (self.originalPosition) { targetEl.object3D.position.copy(self.originalPosition); }
          self.el.object3D.visible = false;
        });
      },
    
      tick: function () {
        var frame;
        var xrViewerPose;
        var hitTestResults;
        var pose;
        var inputMat;
        var position;
    
        if (this.el.sceneEl.is('ar-mode')) {
          if (!this.viewerSpace) { return; }
          frame = this.el.sceneEl.frame;
          if (!frame) { return; }
          xrViewerPose = frame.getViewerPose(this.refSpace);
    
          if (this.xrHitTestSource && xrViewerPose) {
            hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
            if (hitTestResults.length > 0) {
              pose = hitTestResults[0].getPose(this.refSpace);
    
              inputMat = new THREE.Matrix4();
              inputMat.fromArray(pose.transform.matrix);
    
              position = new THREE.Vector3();
              position.setFromMatrixPosition(inputMat);
              this.el.setAttribute('position', position);
            }
          }
        }
      }
    });
  */
    AFRAME.registerComponent('ar-shadows', {
      // Swap an object's material to a transparent shadows-only material while
      // in AR mode. Intended for use with a ground plane. The object is also
      // set visible while in AR mode, this is useful if it's hidden in other
      // modes due to them using a 3D environment.
      schema: {
        opacity: {default: 0.3}
      },
      init: function () {
        this.el.sceneEl.addEventListener('enter-vr', (ev:any) => {
          this.wasVisible = this.el.getAttribute('visible');
          if (this.el.sceneEl.is('ar-mode')) {
            this.savedMaterial = this.el.object3D.children[0].material;
            this.el.object3D.children[0].material = new THREE.ShadowMaterial();
            this.el.object3D.children[0].material.opacity = this.data.opacity;
            this.el.setAttribute('visible', true);
          }
        });
        this.el.sceneEl.addEventListener('exit-vr', (ev:any) => {
          if (this.savedMaterial) {
            this.el.object3D.children[0].material = this.savedMaterial;
            this.savedMaterial = null;
          }
          if (!this.wasVisible) this.el.setAttribute('visible', false);
        });
      }
    });

    AFRAME.registerShader('background-gradient', {
      schema: {
        colorTop: { type: 'color', default: '#37383c', is: 'uniform' },
        colorBottom: { type: 'color', default: '#757575', is: 'uniform' }
      },
    
      vertexShader: [
        'varying vec3 vWorldPosition;',
    
        'void main() {',
    
        'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
        'vWorldPosition = worldPosition.xyz;',
    
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
    
        '}'
      ].join('\n'),
    
      fragmentShader: [
        'uniform vec3 colorTop;',
        'uniform vec3 colorBottom;',
    
        'varying vec3 vWorldPosition;',
    
        'void main()',
    
        '{',
        'vec3 pointOnSphere = normalize(vWorldPosition.xyz);',
        'float f = 1.0;',
    
        'f = sin(pointOnSphere.y * 2.2) + 0.4;',
    
        'gl_FragColor = vec4(mix(colorBottom, colorTop, f), 1.0);',
    
        '}'
      ].join('\n')
    });
    /*
    AFRAME.registerComponent('hide-on-enter-ar', {
      init: function () {
        var self = this;
        this.el.sceneEl.addEventListener('enter-vr', function () {
          if (self.el.sceneEl.is('ar-mode')) {
            self.el.object3D.visible = false;
          }
        });
        this.el.sceneEl.addEventListener('exit-vr', function () {
          self.el.object3D.visible = true;
        });
      }
    });
    */
    AFRAME.registerComponent('info-message', {
      schema: {
        htmlSrc: {type: 'selector'},
        startOpened: {default: false}
      },
      init: function () {
        var sceneEl = this.el.sceneEl;
        var messageEl = this.messageEl = document.createElement('div');
        var startOpened = this.data.startOpened;
        this.toggleInfoMessage = this.toggleInfoMessage.bind(this);
    
        messageEl.classList.add('a-info-message');
        messageEl.setAttribute('aframe-injected', '');
    
        var closeButtonEl = this.closeButtonEl = document.createElement('button');
        closeButtonEl.innerHTML = 'X';
        closeButtonEl.classList.add('a-close-button-info');
        closeButtonEl.onclick = this.toggleInfoMessage;
    
        this.createInfoButton(this.toggleInfoMessage);
    
        this.addStyles();
        sceneEl.appendChild(messageEl);
    
        this.messageEl.style.display = startOpened ? '' : 'none';
        this.infoButton.style.display = startOpened ? 'none' : '';
      },
    
      update: function () {
        var messageEl = this.messageEl;
        messageEl.innerHTML = this.data.htmlSrc.data;
        messageEl.appendChild(this.closeButtonEl);
      },
    
      addStyles: function () {
        var css =
          '.a-info-message{border-radius: 10px; position: absolute; width: 400px;' +
          'height: 320px; background-color: white; border: 3px solid rgba(0,0,0,.75);' +
          'bottom: 22px; left: 22px; color: rgb(51, 51, 51); padding: 20px 15px 0 15px;' +
          'font-size: 11pt; line-height: 20pt;}' +
    
          '.a-info-message a{border-bottom: 1px solid rgba(53,196,232,.15); color: #1497b8;' +
          'position: relative; text-decoration: none; transition: .05s ease;}' +
            
          '@media only screen and (min-width: 1200px) {' +
          '.a-info-message {font-size: 12pt}}' +
    
          '@media only screen and (max-width: 600px) {' +
          '.a-info-message {left: 20px; right: 20px; bottom: 60px; width: auto}}' +
            
          '@media only screen and (max-height: 600px) {' +
          '.a-info-message {left: 20px; bottom: 20px; height: 250px}}' +
    
          '.a-close-button-info{width: 25px; height: 25px; padding: 0;' +
          'top: 10px; right: 10px; position: absolute; color: white;' +
          'font-size: 12px; line-height: 12px; border: none; background-color: #ef2d5e;' +
          'border-radius: 5px; font-weight: medium}' +
    
          '.a-close-button-info:hover{background-color: #b32146; color: white}' +
          '.a-info-message-container {position: absolute; left: 80px; bottom: 20px;}' +
          '.a-info-message-button {background: rgba(0, 0, 0, 0.20) ' + this.infoMessageButtonDataURI + ' 50% 50% no-repeat;}' +
          '.a-info-message-button {background-size: 90% 90%; border: 0; bottom: 0; cursor: pointer; min-width: 58px; min-height: 34px; padding-right: 0; padding-top: 0; position: absolute; right: 0; transition: background-color .05s ease; -webkit-transition: background-color .05s ease; z-index: 9999; border-radius: 8px; touch-action: manipulation;}' +
          '.a-info-message-button:active, .a-info-message-button:hover {background-color: #ef2d5e;}';
        var style = document.createElement('style');
        /*
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }*/
    
        document.getElementsByTagName('head')[0].appendChild(style);
      },
    
      toggleInfoMessage: function () {
        var display = this.messageEl.style.display;
        this.infoButton.style.display = display;
        display = display === 'none' ? '' : 'none';
        this.messageEl.style.display = display;
      },
    
      createInfoButton: function (onClick: any) {
        var infoButton;
        var wrapper;
    
        // Create elements.
        wrapper = document.createElement('div');
        wrapper.classList.add('a-info-message-container');
        this.infoButton = infoButton = document.createElement('button');
        infoButton.className = 'a-info-message-button';
        infoButton.setAttribute('title', 'Information about this experience');
        // Insert elements.
        wrapper.appendChild(infoButton);
        infoButton.addEventListener('click', function (evt) {
          onClick();
          evt.stopPropagation();
        });
        this.el.sceneEl.appendChild(wrapper);
      },
    
      infoMessageButtonDataURI: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAABvCAYAAAC3iL97AAAACXBIWXMAAAsTAAALEwEAmpwYAAAGTGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTExLTE5VDEyOjMyOjQwLTA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTExLTE5VDEyOjMyOjQwLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMS0xOVQxMjozMjo0MC0wODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjNGVjZjVjYy05Mzc0LTE0NGMtYTE3MS1lYTgwYTM1ODViZTIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkYWRlNDQxZC03YmZhLTdkNDEtYjZkNC0zZmQyNmJmNDRmNmMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3Nzc5NWUxYi03MjAwLTRmNDYtYTM3Yi0xMDQ3M2FkMTlkZTMiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3Nzc5NWUxYi03MjAwLTRmNDYtYTM3Yi0xMDQ3M2FkMTlkZTMiIHN0RXZ0OndoZW49IjIwMjAtMTEtMTlUMTI6MzI6NDAtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4yIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzRlY2Y1Y2MtOTM3NC0xNDRjLWExNzEtZWE4MGEzNTg1YmUyIiBzdEV2dDp3aGVuPSIyMDIwLTExLTE5VDEyOjMyOjQwLTA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iSU5GTyIgcGhvdG9zaG9wOkxheWVyVGV4dD0iSU5GTyIvPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOlRleHRMYXllcnM+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+vO3K4AAABtVJREFUeJzt3cFrHGUcxvFvUpG9SLqCQcSDbP0DLPHQmwcjggfBQwRv0tIExJOXxIsIgmxvXjy0pSIIig0IIgiSQI9ekkM924Be1AS6tgU92fHwzmRnd9/szrwz77yz+z4f2CZpNrNvNvPs7zcz78wuJUlCDa4C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)'
    
    });

    AFRAME.registerComponent('model-viewer', {
      schema: {
        gltfModel: {default: ''},
        title: {default: ''},
        uploadUIEnabled: {default: true}
      },
      init: function () {
        var el = this.el;
    
        el.setAttribute('renderer', {colorManagement: true});
        el.setAttribute('cursor', {rayOrigin: 'mouse', fuse: false});
        el.setAttribute('webxr', {optionalFeatures: 'hit-test, local-floor'});
        el.setAttribute('raycaster', {objects: '.raycastable'});
    
        this.onModelLoaded = this.onModelLoaded.bind(this);
    
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseWheel = this.onMouseWheel.bind(this);
    
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    
        this.submitURLButtonClicked = this.submitURLButtonClicked.bind(this);
    
        this.onThumbstickMoved = this.onThumbstickMoved.bind(this);
    
        this.onEnterVR = this.onEnterVR.bind(this);
        this.onExitVR = this.onExitVR.bind(this);
    
        this.onMouseDownLaserHitPanel = this.onMouseDownLaserHitPanel.bind(this);
        this.onMouseUpLaserHitPanel = this.onMouseUpLaserHitPanel.bind(this);
    
        this.onOrientationChange = this.onOrientationChange.bind(this);
    
        this.initCameraRig();
        this.initEntities();
        this.initBackground();
    
        if (this.data.uploadUIEnabled) { this.initUploadInput(); }
    
        // Disable context menu on canvas when pressing mouse right button;
        this.el.sceneEl.canvas.oncontextmenu = function (evt:any) { evt.preventDefault(); };
    
        window.addEventListener('orientationchange', this.onOrientationChange);
    
        // VR controls.
        this.laserHitPanelEl.addEventListener('mousedown', this.onMouseDownLaserHitPanel);
        this.laserHitPanelEl.addEventListener('mouseup', this.onMouseUpLaserHitPanel);
    
        this.leftHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);
        this.rightHandEl.addEventListener('thumbstickmoved', this.onThumbstickMoved);
    
        // Mouse 2D controls.
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('wheel', this.onMouseWheel);
    
        // Mobile 2D controls.
        document.addEventListener('touchend', this.onTouchEnd);
        document.addEventListener('touchmove', this.onTouchMove);
    
        this.el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
        this.el.sceneEl.addEventListener('exit-vr', this.onExitVR);
    
        this.modelEl.addEventListener('model-loaded', this.onModelLoaded);
      },
    
      initUploadInput: function () {
        var uploadContainerEl = this.uploadContainerEl = document.createElement('div');
        var inputEl = this.inputEl = document.createElement('input');
        var submitButtonEl = this.submitButtonEl = document.createElement('button');
        var style = document.createElement('style');
        var css =
          '.a-upload-model  {box-sizing: border-box; display: inline-block; height: 34px; padding: 0; width: 70%;' +
          'bottom: 20px; left: 15%; right: 15%; position: absolute; color: white;' +
          'font-size: 12px; line-height: 12px; border: none;' +
          'border-radius: 5px}' +
          '.a-upload-model.hidden {display: none}' +
          '.a-upload-model-button {cursor: pointer; padding: 0px 2px 0 2px; font-weight: bold; color: #666; border: 3px solid #666; box-sizing: border-box; vertical-align: middle; width: 25%; max-width: 110px; border-radius: 10px; height: 34px; background-color: white; margin: 0;}' +
          '.a-upload-model-button:hover {border-color: #ef2d5e; color: #ef2d5e}' +
          '.a-upload-model-input {color: #666; vertical-align: middle; padding: 0px 10px 0 10px; text-transform: uppercase; border: 0; width: 75%; height: 100%; border-radius: 10px; margin-right: 10px}' +
          '@media only screen and (max-width: 800px) {' +
          '.a-upload-model {margin: auto;}' +
          '.a-upload-model-input {width: 70%;}}' +
          '@media only screen and (max-width: 700px) {' +
          '.a-upload-model {display: none}}';
        var inputDefaultValue = this.inputDefaultValue = 'Copy URL to glTF or glb model';
    
        if (AFRAME.utils.device.checkARSupport()) {
          css += '@media only screen and (max-width: 800px) {' +
          '.a-upload-model-input {width: 60%;}}';
        }
    
        uploadContainerEl.classList.add('a-upload-model');
        /*if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }*/
        document.getElementsByTagName('head')[0].appendChild(style);
    
        submitButtonEl.classList.add('a-upload-model-button');
        submitButtonEl.innerHTML = 'OPEN MODEL';
        submitButtonEl.addEventListener('click', this.submitURLButtonClicked);
    
        inputEl.classList.add('a-upload-model-input');
        inputEl.onfocus = function () {
          //if (this.value !== inputDefaultValue) { return; }
          //this.value = '';
        };
        inputEl.onblur = function () {
          //if (this.value) { return; }
          //this.value = inputDefaultValue;
        };
    
        this.el.sceneEl.addEventListener('infomessageopened', function () {
          uploadContainerEl.classList.add('hidden');
        });
        this.el.sceneEl.addEventListener('infomessageclosed', function () {
          uploadContainerEl.classList.remove('hidden');
        });
    
        inputEl.value = inputDefaultValue;
    
        uploadContainerEl.appendChild(inputEl);
        uploadContainerEl.appendChild(submitButtonEl);
    
        this.el.sceneEl.appendChild(uploadContainerEl);
      },
    
      update: function () {
        if (!this.data.gltfModel) { return; }
        this.modelEl.setAttribute('gltf-model', this.data.gltfModel);
      },
    
      submitURLButtonClicked: function (evt:any) {
        var modelURL = this.inputEl.value;
        if (modelURL === this.inputDefaultValue) { return; }
        this.el.setAttribute('model-viewer', 'gltfModel', modelURL);
      },
    
      initCameraRig: function () {
        var cameraRigEl = this.cameraRigEl = document.createElement('a-entity');
        var cameraEl = this.cameraEl = document.createElement('a-entity');
        var rightHandEl = this.rightHandEl = document.createElement('a-entity');
        var leftHandEl = this.leftHandEl = document.createElement('a-entity');
    
        cameraEl.setAttribute('camera', JSON.stringify({fov: 60}));
        cameraEl.setAttribute('look-controls', JSON.stringify({
          magicWindowTrackingEnabled: false,
          mouseEnabled: false,
          touchEnabled: false
        }));
    
        rightHandEl.setAttribute('rotation', '0 90 0');
        rightHandEl.setAttribute('laser-controls', JSON.stringify({hand: 'right'}));
        rightHandEl.setAttribute('raycaster', JSON.stringify({objects: '.raycastable'}));
        rightHandEl.setAttribute('line', JSON.stringify({color: '#118A7E'}));
    
        leftHandEl.setAttribute('rotation', '0 90 0');
        leftHandEl.setAttribute('laser-controls', JSON.stringify({hand: 'right'}));
        leftHandEl.setAttribute('raycaster', JSON.stringify({objects: '.raycastable'}));
        leftHandEl.setAttribute('line', JSON.stringify({color: '#118A7E'}));
    
        cameraRigEl.appendChild(cameraEl);
        cameraRigEl.appendChild(rightHandEl);
        cameraRigEl.appendChild(leftHandEl);
    
        this.el.appendChild(cameraRigEl);
      },
    
      initBackground: function () {
        var backgroundEl = this.backgroundEl = document.querySelector('a-entity');
        backgroundEl.setAttribute('geometry', {primitive: 'sphere', radius: 65});
        backgroundEl.setAttribute('material', {
          shader: 'background-gradient',
          colorTop: '#37383c',
          colorBottom: '#757575',
          side: 'back'
        });
        backgroundEl.setAttribute('hide-on-enter-ar', '');
      },
    
      initEntities: function () {
        // Container for our entities to keep the scene clean and tidy.
        var containerEl = this.containerEl = document.createElement('a-entity');
        // Plane used as a hit target for laser controls when in VR mode
        var laserHitPanelEl = this.laserHitPanelEl = document.createElement('a-entity');
        // Models are often not centered on the 0,0,0.
        // We will center the model and rotate a pivot.
        var modelPivotEl = this.modelPivotEl = document.createElement('a-entity');
        // This is our glTF model entity.
        var modelEl = this.modelEl = document.createElement('a-entity');
        // Shadow blurb for 2D and VR modes. Scaled to match the size of the model.
        var shadowEl = this.shadowEl = document.createElement('a-entity');
        // Real time shadow only used in AR mode.
        var arShadowEl = this.arShadowEl = document.createElement('a-entity');
        // The title / legend displayed above the model.
        var titleEl = this.titleEl = document.createElement('a-entity');
        // Reticle model used to position the model in AR mode.
        var reticleEl = this.reticleEl = document.createElement('a-entity');
        // Scene ligthing.
        var lightEl = this.lightEl = document.createElement('a-entity');
        var sceneLightEl = this.sceneLightEl = document.createElement('a-entity');
    
        sceneLightEl.setAttribute('light', JSON.stringify({
          type: 'hemisphere',
          intensity: 1
        }));
    
        modelPivotEl.id = 'modelPivot';
    
        this.el.appendChild(sceneLightEl);
    
        reticleEl.setAttribute('gltf-model', '#reticle');
        reticleEl.setAttribute('scale', '0.8 0.8 0.8');
        reticleEl.setAttribute('ar-hit-test', JSON.stringify({targetEl: '#modelPivot'}));
        reticleEl.setAttribute('visible', 'false');
    
        modelEl.id = 'model';
    
        laserHitPanelEl.id = 'laserHitPanel';
        laserHitPanelEl.setAttribute('position', '0 0 -10');
        laserHitPanelEl.setAttribute('geometry', 'primitive: plane; width: 30; height: 20');
        laserHitPanelEl.setAttribute('material', 'color: red');
        laserHitPanelEl.setAttribute('visible', 'false');
        laserHitPanelEl.classList.add('raycastable');
    
        this.containerEl.appendChild(laserHitPanelEl);
    
        modelEl.setAttribute('rotation', '0 -30 0');
        modelEl.setAttribute('animation-mixer', '');
        modelEl.setAttribute('shadow', 'cast: true; receive: false');
    
        modelPivotEl.appendChild(modelEl);
    
        shadowEl.setAttribute('rotation', '-90 -30 0');
        shadowEl.setAttribute('geometry', 'primitive: plane; width: 1.0; height: 1.0');
        shadowEl.setAttribute('material', 'src: #shadow; transparent: true; opacity: 0.40');
        shadowEl.setAttribute('hide-on-enter-ar', '');
    
        modelPivotEl.appendChild(shadowEl);
    
        arShadowEl.setAttribute('rotation', '-90 0 0');
        arShadowEl.setAttribute('geometry', 'primitive: plane; width: 30.0; height: 30.0');
        arShadowEl.setAttribute('shadow', 'recieve: true');
        arShadowEl.setAttribute('ar-shadows', 'opacity: 0.2');
        arShadowEl.setAttribute('visible', 'false');
    
        modelPivotEl.appendChild(arShadowEl);
    
        titleEl.id = 'title';
        titleEl.setAttribute('text', 'value: ' + this.data.title + '; width: 6');
        titleEl.setAttribute('hide-on-enter-ar', '');
        titleEl.setAttribute('visible', 'false');
    
        this.containerEl.appendChild(titleEl);
    
        lightEl.id = 'light';
        lightEl.setAttribute('position', '-2 4 2');
        lightEl.setAttribute('light', JSON.stringify({
          type: 'directional',
          castShadow: true,
          shadowMapHeight: 1024,
          shadowMapWidth: 1024,
          shadowCameraLeft: -7,
          shadowCameraRight: 5,
          shadowCameraBottom: -5,
          shadowCameraTop: 5,
          intensity: 0.5,
          target: 'modelPivot'
        }));
    
        this.containerEl.appendChild(lightEl);
        this.containerEl.appendChild(modelPivotEl);
    
        this.el.appendChild(containerEl);
        this.el.appendChild(reticleEl);
      },
    
      onThumbstickMoved: function (evt:any) {
        var modelPivotEl = this.modelPivotEl;
        var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
        modelScale -= evt.detail.y / 20;
        modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
        modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
        this.modelScale = modelScale;
      },
    
      onMouseWheel: function (evt:any) {
        var modelPivotEl = this.modelPivotEl;
        var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
        modelScale -= evt.deltaY / 100;
        modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
        // Clamp scale.
        modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
        this.modelScale = modelScale;
      },
    
      onMouseDownLaserHitPanel: function (evt:any) {
        var cursorEl = evt.detail.cursorEl;
        var intersection = cursorEl.components.raycaster.getIntersection(this.laserHitPanelEl);
        if (!intersection) { return; }
        cursorEl.setAttribute('raycaster', 'lineColor', 'white');
        this.activeHandEl = cursorEl;
        this.oldHandX = undefined;
        this.oldHandY = undefined;
      },
    
      onMouseUpLaserHitPanel: function (evt:any) {
        var cursorEl = evt.detail.cursorEl;
        if (cursorEl === this.leftHandEl) { this.leftHandPressed = false; }
        if (cursorEl === this.rightHandEl) { this.rightHandPressed = false; }
        cursorEl.setAttribute('raycaster', 'lineColor', 'white');
        if (this.activeHandEl === cursorEl) { this.activeHandEl = undefined; }
      },
    
      onOrientationChange: function () {
        if (AFRAME.utils.device.isLandscape()) {
          this.cameraRigEl.object3D.position.z -= 1;
        } else {
          this.cameraRigEl.object3D.position.z += 1;
        }
      },
    
      tick: function () {
        var modelPivotEl = this.modelPivotEl;
        var intersection;
        var intersectionPosition;
        var laserHitPanelEl = this.laserHitPanelEl;
        var activeHandEl = this.activeHandEl;
        if (!this.el.sceneEl.is('vr-mode')) { return; }
        if (!activeHandEl) { return; }
        intersection = activeHandEl.components.raycaster.getIntersection(laserHitPanelEl);
        if (!intersection) {
          activeHandEl.setAttribute('raycaster', 'lineColor', 'white');
          return;
        }
        activeHandEl.setAttribute('raycaster', 'lineColor', '#007AFF');
        intersectionPosition = intersection.point;
        this.oldHandX = this.oldHandX || intersectionPosition.x;
        this.oldHandY = this.oldHandY || intersectionPosition.y;
    
        modelPivotEl.object3D.rotation.y -= (this.oldHandX - intersectionPosition.x) / 4;
        modelPivotEl.object3D.rotation.x += (this.oldHandY - intersectionPosition.y) / 4;
    
        this.oldHandX = intersectionPosition.x;
        this.oldHandY = intersectionPosition.y;
      },
    
      onEnterVR: function () {
        var cameraRigEl = this.cameraRigEl;
    
        this.cameraRigPosition = cameraRigEl.object3D.position.clone();
        this.cameraRigRotation = cameraRigEl.object3D.rotation.clone();
    
        debugger;
        if (!this.el.sceneEl.is('ar-mode')) {
          cameraRigEl.object3D.position.set(0, 0, 2);
        } else {
          cameraRigEl.object3D.position.set(0, 0, 0);
        }
      },
    
      onExitVR: function () {
        var cameraRigEl = this.cameraRigEl;
    
        cameraRigEl.object3D.position.copy(this.cameraRigPosition);
        cameraRigEl.object3D.rotation.copy(this.cameraRigRotation);
    
        cameraRigEl.object3D.rotation.set(0, 0, 0);
      },
    
      onTouchMove: function (evt:any) {
        if (evt.touches.length === 1) { this.onSingleTouchMove(evt); }
        if (evt.touches.length === 2) { this.onPinchMove(evt); }
      },
    
      onSingleTouchMove: function (evt:any) {
        var dX;
        var dY;
        var modelPivotEl = this.modelPivotEl;
        this.oldClientX = this.oldClientX || evt.touches[0].clientX;
        this.oldClientY = this.oldClientY || evt.touches[0].clientY;
    
        dX = this.oldClientX - evt.touches[0].clientX;
        dY = this.oldClientY - evt.touches[0].clientY;
    
        modelPivotEl.object3D.rotation.y -= dX / 200;
        this.oldClientX = evt.touches[0].clientX;
    
        modelPivotEl.object3D.rotation.x -= dY / 100;
    
        // Clamp x rotation to [-90,90]
        modelPivotEl.object3D.rotation.x = Math.min(Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2);
        this.oldClientY = evt.touches[0].clientY;
      },
    
      onPinchMove: function (evt:any) {
        var dX = evt.touches[0].clientX - evt.touches[1].clientX;
        var dY = evt.touches[0].clientY - evt.touches[1].clientY;
        var modelPivotEl = this.modelPivotEl;
        var distance = Math.sqrt(dX * dX + dY * dY);
        var oldDistance = this.oldDistance || distance;
        var distanceDifference = oldDistance - distance;
        var modelScale = this.modelScale || modelPivotEl.object3D.scale.x;
    
        modelScale -= distanceDifference / 500;
        modelScale = Math.min(Math.max(0.8, modelScale), 2.0);
        // Clamp scale.
        modelPivotEl.object3D.scale.set(modelScale, modelScale, modelScale);
    
        this.modelScale = modelScale;
        this.oldDistance = distance;
      },
    
      onTouchEnd: function (evt:any) {
        this.oldClientX = undefined;
        this.oldClientY = undefined;
        if (evt.touches.length < 2) { this.oldDistance = undefined; }
      },
    
      onMouseUp: function (evt:any) {
        this.leftRightButtonPressed = false;
        if (evt.buttons === undefined || evt.buttons !== 0) { return; }
        this.oldClientX = undefined;
        this.oldClientY = undefined;
      },
    
      onMouseMove: function (evt:any) {
        if (this.leftRightButtonPressed) {
          this.dragModel(evt);
        } else {
          this.rotateModel(evt);
        }
      },
    
      dragModel: function (evt: any) {
        var dX;
        var dY;
        var modelPivotEl = this.modelPivotEl;
        if (!this.oldClientX) { return; }
        dX = this.oldClientX - evt.clientX;
        dY = this.oldClientY - evt.clientY;
        modelPivotEl.object3D.position.y += dY / 200;
        modelPivotEl.object3D.position.x -= dX / 200;
        this.oldClientX = evt.clientX;
        this.oldClientY = evt.clientY;
      },
    
      rotateModel: function (evt: any) {
        var dX;
        var dY;
        var modelPivotEl = this.modelPivotEl;
        if (!this.oldClientX) { return; }
        dX = this.oldClientX - evt.clientX;
        dY = this.oldClientY - evt.clientY;
        modelPivotEl.object3D.rotation.y -= dX / 100;
        modelPivotEl.object3D.rotation.x -= dY / 200;
    
        // Clamp x rotation to [-90,90]
        modelPivotEl.object3D.rotation.x = Math.min(Math.max(-Math.PI / 2, modelPivotEl.object3D.rotation.x), Math.PI / 2);
    
        this.oldClientX = evt.clientX;
        this.oldClientY = evt.clientY;
      },
    
      onModelLoaded: function () {
        this.centerAndScaleModel();
      },
    
      centerAndScaleModel: function () {
        var box;
        var size;
        var center;
        var scale;
        var modelEl = this.modelEl;
        var shadowEl = this.shadowEl;
        var titleEl = this.titleEl;
        var gltfObject = modelEl.getObject3D('mesh');
    
        // Reset position and scales.
        modelEl.object3D.position.set(0, 0, 0);
        modelEl.object3D.scale.set(1.0, 1.0, 1.0);
        this.cameraRigEl.object3D.position.z = 3.0;
    
        // Calculate model size.
        modelEl.object3D.updateMatrixWorld();
        box = new THREE.Box3().setFromObject(gltfObject);
        size = box.getSize(new THREE.Vector3());
    
        // Calculate scale factor to resize model to human scale.
        scale = 1.6 / size.y;
        scale = 2.0 / size.x < scale ? 2.0 / size.x : scale;
        scale = 2.0 / size.z < scale ? 2.0 / size.z : scale;
    
        modelEl.object3D.scale.set(scale, scale, scale);
    
        // Center model at (0, 0, 0).
        modelEl.object3D.updateMatrixWorld();
        box = new THREE.Box3().setFromObject(gltfObject);
        center = box.getCenter(new THREE.Vector3());
        size = box.getSize(new THREE.Vector3());
    
        shadowEl.object3D.scale.y = size.x;
        shadowEl.object3D.scale.x = size.y;
        shadowEl.object3D.position.y = -size.y / 2;
        shadowEl.object3D.position.z = -center.z;
        shadowEl.object3D.position.x = -center.x;
    
        titleEl.object3D.position.x = 2.2 - center.x;
        titleEl.object3D.position.y = size.y + 0.5;
        titleEl.object3D.position.z = -2;
        titleEl.object3D.visible = true;
    
        modelEl.object3D.position.x = -center.x;
        modelEl.object3D.position.y = -center.y;
        modelEl.object3D.position.z = -center.z;
    
        // When in mobile landscape we want to bring the model a bit closer.
        if (AFRAME.utils.device.isLandscape()) { this.cameraRigEl.object3D.position.z -= 1; }
      },
    
      onMouseDown: function (evt: any) {
        if (evt.buttons) { this.leftRightButtonPressed = evt.buttons === 3; }
        this.oldClientX = evt.clientX;
        this.oldClientY = evt.clientY;
      }
    });
  
  
  }
}
