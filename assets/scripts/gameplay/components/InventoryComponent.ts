/**
 * InventoryComponent - 背包元件
 */

import { Component } from '../../core/Component';
import { DataManager, ItemData } from '../../core/DataManager';
import { EventBus, GameEvents } from '../../core/EventBus';

export class InventoryComponent extends Component {
    private _items: Map<string, number> = new Map();
    private _equipment: string[] = [];
    private _currentEquipIndex: number = 0;

    /**
     * 新增道具
     */
    public addItem(itemId: string, count: number = 1): boolean {
        const itemData = DataManager.getInstance().getItem(itemId);
        if (!itemData) {
            console.warn(`Item not found: ${itemId}`);
            return false;
        }

        const currentCount = this._items.get(itemId) || 0;
        const maxStack = itemData.maxStack || 99;

        if (itemData.stackable) {
            const newCount = Math.min(currentCount + count, maxStack);
            this._items.set(itemId, newCount);
        } else {
            // 非堆疊道具
            if (currentCount > 0) return false;
            this._items.set(itemId, 1);
        }

        EventBus.getInstance().emit(GameEvents.ITEM_PICKUP, {
            itemId,
            count,
        });

        return true;
    }

    /**
     * 移除道具
     */
    public removeItem(itemId: string, count: number = 1): boolean {
        const currentCount = this._items.get(itemId) || 0;
        if (currentCount < count) return false;

        const newCount = currentCount - count;
        if (newCount <= 0) {
            this._items.delete(itemId);
        } else {
            this._items.set(itemId, newCount);
        }

        return true;
    }

    /**
     * 使用道具
     */
    public useItem(itemId: string): boolean {
        if (!this.hasItem(itemId)) return false;

        const itemData = DataManager.getInstance().getItem(itemId);
        if (!itemData) return false;

        // 消耗品使用後移除
        if (itemData.type === 'consumable') {
            this.removeItem(itemId, 1);
        }

        EventBus.getInstance().emit(GameEvents.ITEM_USE, {
            itemId,
            itemData,
        });

        return true;
    }

    /**
     * 檢查是否有道具
     */
    public hasItem(itemId: string, count: number = 1): boolean {
        return (this._items.get(itemId) || 0) >= count;
    }

    /**
     * 取得道具數量
     */
    public getItemCount(itemId: string): number {
        return this._items.get(itemId) || 0;
    }

    /**
     * 裝備道具
     */
    public equip(itemId: string): boolean {
        const itemData = DataManager.getInstance().getItem(itemId);
        if (!itemData || itemData.type !== 'equipment') return false;

        if (!this._equipment.includes(itemId)) {
            this._equipment.push(itemId);
        }
        return true;
    }

    /**
     * 取得當前裝備的道具
     */
    public getEquippedItem(): string | null {
        return this._equipment[this._currentEquipIndex] || null;
    }

    /**
     * 切換裝備
     */
    public cycleEquipment(): void {
        if (this._equipment.length === 0) return;
        this._currentEquipIndex = (this._currentEquipIndex + 1) % this._equipment.length;
    }

    /**
     * 取得所有道具
     */
    public getAllItems(): Map<string, number> {
        return new Map(this._items);
    }

    /**
     * 取得所有裝備
     */
    public getEquipment(): string[] {
        return [...this._equipment];
    }

    /**
     * 從存檔還原
     */
    public loadFromSave(items: Record<string, number>, equipment: string[]): void {
        this._items = new Map(Object.entries(items));
        this._equipment = [...equipment];
    }

    /**
     * 轉換為存檔格式
     */
    public toSaveFormat(): { items: Record<string, number>; equipment: string[] } {
        return {
            items: Object.fromEntries(this._items),
            equipment: this._equipment,
        };
    }
}
