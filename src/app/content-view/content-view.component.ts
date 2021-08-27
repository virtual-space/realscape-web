import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Item, ItemService} from "../services/item.service";
import {ApplicationService} from "../services/application.service";
import {ActivatedRoute} from "@angular/router";


declare var iframely: any

@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent implements OnInit {

  item: Item = null;

  @ViewChild('link', { static: true })
  public link: ElementRef<any>;

  constructor(private itemService: ItemService,
              private appService: ApplicationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.paramMap.subscribe(params => {
      //console.log(params.get('id'));
      const id = params.get('id');
      if (id) {
        //this.loadItem(id);
        this.getItem(id);
      }
    });
  }

  getItem(id) {
    this.itemService.getItem(id).subscribe(item => {
      if (!('ok' in item)) {
        console.log(item);
        this.item = item;
        this.appService.setTitle(item.name);
        /*
        this.appService.setItem(item);
        this.itemService.items(this.appService.getQuery()).subscribe(items => {
          this.appService.setItems(items);
        });
         */
      }
    });
  }

}
