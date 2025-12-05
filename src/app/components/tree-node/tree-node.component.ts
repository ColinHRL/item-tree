import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemTree } from '../../models/item.model';

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  template: `
    <li>
      <strong>{{ node.item }}</strong>
      @if (node.children.length > 0) {
      <ul>@for (child of node.children; track child.itemID) {
        <app-tree-node [node]="child"></app-tree-node>
      }
      </ul>
      }
    </li>
  `,
  styles: []
})
export class TreeNodeComponent {
  @Input() node!: ItemTree;
}
