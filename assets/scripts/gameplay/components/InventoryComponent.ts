import { _decorator, Component } from 'cc';
import { DataManager } from '../../core/DataManager';
import { EventBus, GameEvents } from '../../core/EventBus';
import { ItemSystem } from '../../systems/ItemSystem';
import { InventorySaveData } from '../../systems/SaveSystem';

const { ccclass, property } = _decorator;

interface InventoryItem {
    itemId: string;
    count: number;
}

@ccclass('InventoryComponent')
export class InventoryComponent extends Component {
    @property
    public equippedItemIndex: number = -1;

    public rupees: number = 0;

    private _items: InventoryItem[] = [];

    public get items(): InventoryItem[] {
        return this._items;
    }

    public addRupees(amount: number): void {
        this.rupees += amount;
        EventBus.getInstance().emit(GameEvents.ITEM_PICKUP, { rupees: this.rupees });
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



    // ... (existing code)

    public useCurrentItem(): void {
        if (this.equippedItemIndex !== -1) {
            const item = this._items[this.equippedItemIndex];
            if (item && item.count > 0) {
                const itemSystem = ItemSystem.getInstance();
                if (!itemSystem) {
                    console.warn('ItemSystem not found. Unable to use item.');
                    return;
                }
                itemSystem.useItem(item.itemId, this.node);
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

    /**
     * Converts inventory data to a saveable format.
     */
    public toSaveData(): any {
        return {
            items: this._items,
            equippedIndex: this.equippedItemIndex,
            rupees: this.rupees,
        };
    }

    /**
     * Loads inventory data from a save file.
     * @param data The data to load.
     */
    public loadData(data: InventorySaveData): void {
        if (!data) {
            this._items = [];
            this.equippedItemIndex = -1;
            this.rupees = 0;
            return;
        }

        this._items = data.items || [];
        this.equippedItemIndex = data.equippedIndex ?? -1;
        this.rupees = data.rupees ?? 0;
    }
}
