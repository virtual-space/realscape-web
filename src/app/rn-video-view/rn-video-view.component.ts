import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { RnViewComponent } from '../rn-view/rn-view.component';

@Component({
  selector: 'app-rn-video-view',
  templateUrl: './rn-video-view.component.html',
  styleUrls: ['./rn-video-view.component.sass']
})
export class RnVideoViewComponent extends RnViewComponent implements OnInit {
  videoSource: SafeUrl | null = null;

  protected override initialize(): void {
    this.securePipe2.transform(this.getDataLink()).subscribe((data) => {
      this.videoSource = data;
    });
  }
}
