import { Component, Input, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, map, Observable, of} from 'rxjs';

import { Item, Type, ItemService } from '../services/item.service'

export class ItemNode {
  constructor(public item: Item,
              public hasChildren: boolean,
              protected itemService: ItemService,
              public parentItem?: Item) {}
  get children(): Observable<ItemNode[]> {
    if (this.item.items) {
      return of(this.item.items.map(i => new ItemNode(i, this.getNumberOfChildren(i.type) > 0, this.itemService, this.item)));
    }
    return this.itemService.children(this.item.id!).pipe(
      map(items => items.map(i => new ItemNode(i, this.getNumberOfChildren(i.type) > 0, this.itemService, this.item)))
    );
  }

  getNumberOfChildren(type?: Type) {
      if(type && type.instances) {
        return type.instances.length;
      }
      return 0;
  }
}

export class ItemFlatNode {
  constructor(public item: Item, 
              public level = 1,
              public expandable = false,
              public parentItem?: Item ){}
}

@Component({
  selector: 'app-rn-tree-view',
  templateUrl: './rn-tree-view.component.html',
  styleUrls: ['./rn-tree-view.component.sass']
})
export class RnTreeViewComponent implements OnInit {

  @Input() items: Item[] = [];
  @Input() selectedItem?: Item;

  treeControl = new FlatTreeControl<ItemFlatNode>(
    node => node.level,
    node => node.expandable
  );
  private _transformer = (node: ItemNode, level: number) => {
    return new ItemFlatNode(
      node.item,
      level,
      node.hasChildren,
      node.parentItem
    );
  };
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.dataSource.data = this.items.map(i => new ItemNode(i, this.getNumberOfChildren(i.type) > 0, this.itemService));
  }

  hasChild(node: ItemFlatNode) {
    return node.expandable;
  }

  getNumberOfChildren(type?: Type) {
    if(type && type.instances) {
      return type.instances.length;
    }
    return 0;
  }

  onSelectItem(item: Item) {
    this.selectedItem = item;
  }

}
