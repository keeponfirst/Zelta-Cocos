import { _decorator, Component } from 'cc';
import { DataManager } from '../../core/DataManager';
import { ItemSystem } from '../../systems/ItemSystem';

const { ccclass, property } = _decorator;

interface InventoryItem {
    itemId: string;
    count: number;
}

@ccclass('InventoryComponent')
export class InventoryComponent extends Component {
    @property
    public equippedItemIndex: number = -1;

    private _items: InventoryItem[] = [];

    public get items(): InventoryItem[] {
        return this._items;
    }

    public addItem(itemId: string, count: number = 1): boolean {
        const itemData = DataManager.getInstance().getItem(itemId);
        if (!itemData) {
            return false;
        }

        const maxStack = itemData.maxStack || 1;

        for (let i = 0; i < this._items.length; i++) {
            const item = this._items[i];
            if (item.itemId === itemId && item.count < maxStack) {
                const canAdd = maxStack - item.count;
                const toAdd = Math.min(count, canAdd);
                item.count += toAdd;
                count -= toAdd;
                if (count === 0) {
                    return true;
                }
            }
        }

        while (count > 0) {
            const toAdd = Math.min(count, maxStack);
            this._items.push({ itemId, count: toAdd });
            count -= toAdd;
        }

        return true;
    }

    public equipItem(index: number): void {
        if (index >= 0 && index < this._items.length) {
            this.equippedItemIndex = index;
        }
    }

import { ItemSystem } from '../../systems/ItemSystem';

// ... (existing code)

    public useCurrentItem(): void {
        if (this.equippedItemIndex !== -1) {
            const item = this._items[this.equippedItemIndex];
            if (item && item.count > 0) {
                ItemSystem.getInstance().useItem(item.itemId, this.node);
                const itemData = DataManager.getInstance().getItem(item.itemId);
                if (itemData && itemData.type === 'consumable') {
                    item.count--;
                    if (item.count === 0) {
                        this._items.splice(this.equippedItemIndex, 1);
                        this.equippedItemIndex = -1;
                    }
                }
            }
        }
    }
}
