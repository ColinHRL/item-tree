import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Item, ItemTree, exampleData } from './models/item.model';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from './components/tree-node/tree-node.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TreeNodeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Item Tree');
  protected readonly roots = signal(ItemTree.generateTreeFromItemList(exampleData));
  protected readonly items = signal<Item[]>(exampleData);

  generateRandomTree() {
    const newItems: Item[] = [];
    const itemCount = 15;
    // Create 15 items with random parents (or 0 for roots)
    // We pick parents only from already-created IDs to guarantee acyclicity
    const createdIDs: number[] = [];
    for (let i = 1; i <= itemCount; i++) {
      const isRoot = Math.random() < 0.2;
      let subItemOfID = 0;

      if (!isRoot && createdIDs.length > 0) {
        // pick a random parent from previously created IDs
        const parentIndex = Math.floor(Math.random() * createdIDs.length);
        subItemOfID = createdIDs[parentIndex];
      }

      newItems.push(new Item({ itemID: i, item: `Item ${i}`, subItemOfID }));
      createdIDs.push(i);
    }
    
    // Update items and regenerate tree
    this.items.set(newItems);
    this.roots.set(ItemTree.generateTreeFromItemList(newItems));
  }

  onCSVFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.trim().split('\n');
        const newItems: Item[] = [];
        
        // Skip header row if present
        const startIdx = lines[0].toLowerCase().includes('itemid') ? 1 : 0;
        
        for (let i = startIdx; i < lines.length; i++) {
          const parts = lines[i].split(',').map(s => s.trim());
          if (parts.length >= 3) {
            const itemID = parseInt(parts[0], 10);
            const item = parts[1];
            const subItemOfID = parseInt(parts[2], 10);
            
            if (!isNaN(itemID) && !isNaN(subItemOfID)) {
              newItems.push(new Item({ itemID, item, subItemOfID }));
            }
          }
        }
        
        if (newItems.length > 0) {
          this.items.set(newItems);
          this.roots.set(ItemTree.generateTreeFromItemList(newItems));
        } else {
          alert('No valid items found in CSV');
        }
      } catch (error) {
        alert(`Error parsing CSV: ${error}`);
      }
    };
    reader.readAsText(file);
  }
}
