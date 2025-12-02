export interface ItemType {
    itemID: number;
    item: string;
    subItemOfID: number;
}

export interface ItemTreeType {
    itemID: number;
    item: string;
    children: ItemTreeType[];
}

export class Item implements ItemType {
    itemID: number;
    item: string;
    subItemOfID: number;

    constructor(item: ItemType) {
        this.itemID = item.itemID;
        this.item = item.item;
        this.subItemOfID = item.subItemOfID;
    }
}

export class ItemTree implements ItemTreeType {
    itemID: number;
    item: string;
    children: ItemTree[] = [];

    constructor(itemTree: ItemTreeType) {
        this.itemID = itemTree.itemID;
        this.item = itemTree.item;
        this.children = itemTree.children;
    }

    static generateTreeFromItemList(items: Item[]) {

    }
}

export const exampleData = [
    { itemID: 1, item: 'Item1', subItemOfID: 0 } as Item,
    { itemID: 2, item: 'Item2', subItemOfID: 0 } as Item,
    { itemID: 3, item: 'Item3', subItemOfID: 0 } as Item,
    { itemID: 4, item: 'Item10', subItemOfID: 1 } as Item,
    { itemID: 5, item: 'Item11', subItemOfID: 1 } as Item,
    { itemID: 6, item: 'Item12', subItemOfID: 1 } as Item,
    { itemID: 7, item: 'Item100', subItemOfID: 4 } as Item,
    { itemID: 8, item: 'Item101', subItemOfID: 4 } as Item,
    { itemID: 9, item: 'Item102', subItemOfID: 4 } as Item,
    { itemID: 10, item: 'Item30', subItemOfID: 3 } as Item,
    { itemID: 11, item: 'Item31', subItemOfID: 3 } as Item,
    { itemID: 12, item: 'Item32', subItemOfID: 3 } as Item
]