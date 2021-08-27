import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map, switchMap} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit, OnChanges {
  // This code block just creates an rxjs stream from the src
  // this makes sure that we can handle source changes
  // or even when the component gets destroyed
  // So basically turn src into src$
  @Input() private src: string;
  private src$ = new BehaviorSubject(this.src);

  // this stream will contain the actual url that our img tag will load
  // everytime the src changes, the previous call would be canceled and the
  // new resource would be loaded
  dataUrl$ = this.src$.pipe(switchMap(url => this.loadImage(url)));

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.src$.next(this.src);
  }

  // we need HttpClient to load the image
  constructor(private httpClient: HttpClient,
              private domSanitizer: DomSanitizer) {
  }

  private loadImage(url: string): Observable<any> {
    return this.httpClient
      // load the image as a blob
      .get(url, {responseType: 'blob'})
      // create an object url of that blob that we can use in the src attribute
      .pipe(map(e =>  this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e))));
  }
}
