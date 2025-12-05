import { expect, test} from 'vitest';
import { Item, ItemTree, exampleData } from '../models/item.model';

test('Item class should correctly assign properties from ItemType object', () => {
    const itemData = {
        itemID: 1,
        item: 'Test Item',
        subItemOfID: 0
    };
    const item = new Item(itemData);
    expect(item.itemID).toBe(itemData.itemID);
    expect(item.item).toBe(itemData.item);
    expect(item.subItemOfID).toBe(itemData.subItemOfID);
});

// Happy path tests for generateTreeFromItemList
test('generateTreeFromItemList: single root item', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(1);
    expect(roots[0].itemID).toBe(1);
    expect(roots[0].item).toBe('Root');
    expect(roots[0].children).toHaveLength(0);
});

test('generateTreeFromItemList: single root with one child', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Child', subItemOfID: 1 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(1);
    expect(roots[0].itemID).toBe(1);
    expect(roots[0].children).toHaveLength(1);
    expect(roots[0].children[0].itemID).toBe(2);
});

test('generateTreeFromItemList: single root with multiple children', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Child1', subItemOfID: 1 }),
        new Item({ itemID: 3, item: 'Child2', subItemOfID: 1 }),
        new Item({ itemID: 4, item: 'Child3', subItemOfID: 1 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(1);
    expect(roots[0].children).toHaveLength(3);
    expect(roots[0].children.map(c => c.itemID)).toEqual([2, 3, 4]);
});

test('generateTreeFromItemList: multiple roots', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root1', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Root2', subItemOfID: 0 }),
        new Item({ itemID: 3, item: 'Root3', subItemOfID: 0 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(3);
    expect(roots.map(r => r.itemID)).toEqual([1, 2, 3]);
});

test('generateTreeFromItemList: multiple roots with children', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root1', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Root2', subItemOfID: 0 }),
        new Item({ itemID: 3, item: 'Child1.1', subItemOfID: 1 }),
        new Item({ itemID: 4, item: 'Child1.2', subItemOfID: 1 }),
        new Item({ itemID: 5, item: 'Child2.1', subItemOfID: 2 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(2);
    expect(roots[0].children).toHaveLength(2);
    expect(roots[1].children).toHaveLength(1);
    expect(roots[0].children.map(c => c.itemID)).toEqual([3, 4]);
    expect(roots[1].children.map(c => c.itemID)).toEqual([5]);
});

test('generateTreeFromItemList: three-level hierarchy', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Child1', subItemOfID: 1 }),
        new Item({ itemID: 3, item: 'Child2', subItemOfID: 1 }),
        new Item({ itemID: 4, item: 'Grandchild1', subItemOfID: 2 }),
        new Item({ itemID: 5, item: 'Grandchild2', subItemOfID: 2 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(1);
    expect(roots[0].children).toHaveLength(2);
    expect(roots[0].children[0].children).toHaveLength(2);
    expect(roots[0].children[0].children.map(gc => gc.itemID)).toEqual([4, 5]);
});

test('generateTreeFromItemList: deep hierarchy', () => {
    const items = [
        new Item({ itemID: 1, item: 'Level1', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Level2', subItemOfID: 1 }),
        new Item({ itemID: 3, item: 'Level3', subItemOfID: 2 }),
        new Item({ itemID: 4, item: 'Level4', subItemOfID: 3 }),
        new Item({ itemID: 5, item: 'Level5', subItemOfID: 4 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(1);
    expect(roots[0].children[0].children[0].children[0].children[0].itemID).toBe(5);
});

test('generateTreeFromItemList: orphaned items treated as roots', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root1', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Orphan', subItemOfID: 999 }),
        new Item({ itemID: 3, item: 'Child1', subItemOfID: 1 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(2);
    expect(roots.map(r => r.itemID)).toContain(1);
    expect(roots.map(r => r.itemID)).toContain(2);
});

test('generateTreeFromItemList: complex tree with multiple branches', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Branch1', subItemOfID: 1 }),
        new Item({ itemID: 3, item: 'Branch2', subItemOfID: 1 }),
        new Item({ itemID: 4, item: 'Leaf1.1', subItemOfID: 2 }),
        new Item({ itemID: 5, item: 'Leaf1.2', subItemOfID: 2 }),
        new Item({ itemID: 6, item: 'Leaf2.1', subItemOfID: 3 }),
        new Item({ itemID: 7, item: 'DeepLeaf1.1', subItemOfID: 4 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(1);
    expect(roots[0].children).toHaveLength(2);
    expect(roots[0].children[0].children).toHaveLength(2);
    expect(roots[0].children[1].children).toHaveLength(1);
    expect(roots[0].children[0].children[0].children).toHaveLength(1);
});

test('generateTreeFromItemList: items in non-sequential order', () => {
    const items = [
        new Item({ itemID: 5, item: 'Grandchild', subItemOfID: 3 }),
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 3, item: 'Child', subItemOfID: 1 }),
        new Item({ itemID: 2, item: 'AnotherChild', subItemOfID: 1 })
    ];
    const roots = ItemTree.generateTreeFromItemList(items);
    
    expect(roots).toHaveLength(1);
    expect(roots[0].itemID).toBe(1);
    expect(roots[0].children).toHaveLength(2);
    expect(roots[0].children.map(c => c.itemID).sort()).toEqual([2, 3]);
    expect(roots[0].children.find(c => c.itemID === 3)?.children[0].itemID).toBe(5);
});

// Error case tests for generateTreeFromItemList
test('generateTreeFromItemList: should throw on duplicate itemID', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 1, item: 'Duplicate', subItemOfID: 0 })
    ];
    
    expect(() => ItemTree.generateTreeFromItemList(items)).toThrow('Duplicate itemID found: 1');
});

test('generateTreeFromItemList: should throw on self-reference', () => {
    const items = [
        new Item({ itemID: 1, item: 'SelfRef', subItemOfID: 1 })
    ];
    
    expect(() => ItemTree.generateTreeFromItemList(items)).toThrow('Item 1 cannot be a sub-item of itself');
});

test('generateTreeFromItemList: should throw on simple cycle', () => {
    const items = [
        new Item({ itemID: 1, item: 'Item1', subItemOfID: 2 }),
        new Item({ itemID: 2, item: 'Item2', subItemOfID: 1 })
    ];
    
    expect(() => ItemTree.generateTreeFromItemList(items)).toThrow(/Cyclical reference detected/);
});

test('generateTreeFromItemList: should throw on three-way cycle', () => {
    const items = [
        new Item({ itemID: 1, item: 'Item1', subItemOfID: 2 }),
        new Item({ itemID: 2, item: 'Item2', subItemOfID: 3 }),
        new Item({ itemID: 3, item: 'Item3', subItemOfID: 1 })
    ];
    
    expect(() => ItemTree.generateTreeFromItemList(items)).toThrow(/Cyclical reference detected/);
});

test('generateTreeFromItemList: should throw on cycle in deeper hierarchy', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        // Make item 2 point to 4 so we get a cycle: 2 -> 4 -> 3 -> 2
        new Item({ itemID: 2, item: 'Child', subItemOfID: 4 }),
        new Item({ itemID: 3, item: 'Grandchild', subItemOfID: 2 }),
        new Item({ itemID: 4, item: 'GreatGrandchild', subItemOfID: 3 }),
        new Item({ itemID: 5, item: 'CycleBack', subItemOfID: 2 })
    ];
    
    expect(() => ItemTree.generateTreeFromItemList(items)).toThrow(/Cyclical reference detected/);
});

test('generateTreeFromItemList: should throw on multiple duplicate itemIDs', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Child1', subItemOfID: 1 }),
        new Item({ itemID: 2, item: 'Child2', subItemOfID: 1 })
    ];
    
    expect(() => ItemTree.generateTreeFromItemList(items)).toThrow('Duplicate itemID found: 2');
});

test('generateTreeFromItemList: should throw on self-reference in child', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'SelfRef', subItemOfID: 2 })
    ];
    
    expect(() => ItemTree.generateTreeFromItemList(items)).toThrow('Item 2 cannot be a sub-item of itself');
});

test('generateTreeFromItemList: should throw on long chain cycle', () => {
    const items = [
        new Item({ itemID: 1, item: 'Item1', subItemOfID: 2 }),
        new Item({ itemID: 2, item: 'Item2', subItemOfID: 3 }),
        new Item({ itemID: 3, item: 'Item3', subItemOfID: 4 }),
        new Item({ itemID: 4, item: 'Item4', subItemOfID: 5 }),
        new Item({ itemID: 5, item: 'Item5', subItemOfID: 1 })
    ];
    
    expect(() => ItemTree.generateTreeFromItemList(items)).toThrow(/Cyclical reference detected/);
});

// Additional edge-case / happy-path tests
test('generateTreeFromItemList: empty input returns empty roots', () => {
    const items: Item[] = [];
    const roots = ItemTree.generateTreeFromItemList(items);
    expect(roots).toHaveLength(0);
});

test('generateTreeFromItemList: preserves children insertion order', () => {
    // Children provided in non-sequential order; expect the same relative order under parent
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 3, item: 'C1', subItemOfID: 1 }),
        new Item({ itemID: 2, item: 'C0', subItemOfID: 1 }),
        new Item({ itemID: 4, item: 'C2', subItemOfID: 1 })
    ];

    const roots = ItemTree.generateTreeFromItemList(items);
    expect(roots).toHaveLength(1);
    expect(roots[0].children.map(c => c.itemID)).toEqual([3, 2, 4]);
});

test('generateTreeFromItemList: does not mutate original input items', () => {
    const items = [
        new Item({ itemID: 1, item: 'Root', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'Child', subItemOfID: 1 })
    ];

    const copy = items.map(i => ({ ...i }));
    ItemTree.generateTreeFromItemList(items);

    // Ensure original instances still have the same properties
    expect(items).toEqual(copy);
});

test('generateTreeFromItemList: all nodes are present in resulting forest', () => {
    const items = [
        new Item({ itemID: 1, item: 'A', subItemOfID: 0 }),
        new Item({ itemID: 2, item: 'B', subItemOfID: 1 }),
        new Item({ itemID: 3, item: 'C', subItemOfID: 1 }),
        new Item({ itemID: 4, item: 'D', subItemOfID: 2 })
    ];

    const roots = ItemTree.generateTreeFromItemList(items);
    // Count nodes by traversing
    const seen: number[] = [];
    const walk = (n: ItemTree) => { seen.push(n.itemID); n.children.forEach(walk); };
    roots.forEach(walk);
    expect(seen.sort()).toEqual([1, 2, 3, 4]);
});

test('generateTreeFromItemList: exampleData builds expected roots and branches', () => {
    // exampleData is exported from the model and should build a sensible forest
    // Expect roots for itemIDs 1,2,3 (based on exampleData in model)
    const roots = ItemTree.generateTreeFromItemList(exampleData as Item[]);
    expect(roots.map(r => r.itemID).sort()).toEqual([1, 2, 3]);
    // root 1 should have children 4,5,6
    const root1 = roots.find(r => r.itemID === 1)!;
    expect(root1.children.map(c => c.itemID).sort()).toEqual([4, 5, 6]);
});

