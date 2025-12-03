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

    // I like to pass in an object so that the order of parameters doesn't matter and less of a breaking change in the future
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

    static generateTreeFromItemList(items: Item[]): ItemTree[] {
        const itemMap = new Map<number, ItemTree>();
        const itemParentMap = new Map<number, number>();
        const addedToTree = new Set<number>();

        // First create all ItemTree nodes and populate maps
        for (const item of items) {
            // Assuming itemIDs are unique
            if (itemMap.has(item.itemID)) {
                throw new Error(`Duplicate itemID found: ${item.itemID}`);
            }
            // Assuming subItemOfID can't be same as itemID
            if (item.itemID === item.subItemOfID) {
                throw new Error(`Item ${item.itemID} cannot be a sub-item of itself`);
            }
            const treeNode = new ItemTree({
                itemID: item.itemID,
                item: item.item,
                children: []
            });
            itemMap.set(item.itemID, treeNode);
            itemParentMap.set(item.itemID, item.subItemOfID);
        }

        // For each item, traverse up to find roots and build tree
        const roots: ItemTree[] = [];
        for (const item of items) {
            // If already added to tree, skip
            if (addedToTree.has(item.itemID)) continue;

            const visited = new Set<number>();
            let currentItemID = item.itemID;
            const chain: number[] = [];

            // Traverse up to find root and collect the chain
            while (itemMap.has(currentItemID)) {
                if (visited.has(currentItemID)) {
                    throw new Error(`Cyclical reference detected involving itemID: ${item.itemID}`);
                }
                visited.add(currentItemID);

                if (addedToTree.has(currentItemID)) {
                    // Already processed, don't traverse further
                    break;
                }

                chain.push(currentItemID);
                const parentID = itemParentMap.get(currentItemID)!;

                // If parent doesn't exist in map, current is a root
                if (!itemMap.has(parentID)) {
                    roots.push(itemMap.get(currentItemID)!);
                    break;
                }

                currentItemID = parentID;
            }

            // Mark all items in chain as added
            chain.forEach(id => addedToTree.add(id));
        }

        // Now build the actual tree structure by updating the map
        for (const item of items) {
            const parentID = itemParentMap.get(item.itemID)!;
            if (itemMap.has(parentID)) {
                const parent = itemMap.get(parentID)!;
                const child = itemMap.get(item.itemID)!;
                parent.children.push(child);
            }
        }

        return roots;
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