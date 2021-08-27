import {Component, ElementRef, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
import {EngineService} from "../services/engine.service";

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss']
})
export class EngineComponent implements OnInit {

  @Input() private src: string;

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('engineWrapper', { static: true})
  public engineWrapper: ElementRef<HTMLElement>;
  
  constructor(private engServ: EngineService) { }

  ngOnDestroy() {
    this.engServ.ngOnDestroy();
  }

  ngOnInit() {
    this.engServ.createScene(this.rendererCanvas, this.engineWrapper, this.src);
  }

}
