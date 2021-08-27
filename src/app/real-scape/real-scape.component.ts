import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-real-scape',
  templateUrl: './real-scape.component.html',
  styleUrls: ['./real-scape.component.scss']
})
export class RealScapeComponent implements OnInit {

  @Input() public src: string;

  constructor() { }

  ngOnInit() {
  }

}
