/**
 * InventoryPanel - 背包面板
 */

import { _decorator, Component, Node, Prefab, instantiate, ScrollView } from 'cc';
import { InventoryComponent } from '../gameplay/components/InventoryComponent';
import { DataManager } from '../core/DataManager';

const { ccclass, property } = _decorator;

@ccclass('InventoryPanel')
export class InventoryPanel extends Component {
    @property(Node)
    private itemContainer: Node | null = null;

    @property(Prefab)
    private itemSlotPrefab: Prefab | null = null;

    @property(Node)
    private detailPanel: Node | null = null;

    private _inventory: InventoryComponent | null = null;
    private _selectedItemId: string | null = null;

    /**
     * 設定要顯示的背包
     */
    public setInventory(inventory: InventoryComponent): void {
        this._inventory = inventory;
        this.refresh();
    }

    /**
     * 刷新顯示
     */
    public refresh(): void {
        if (!this._inventory || !this.itemContainer || !this.itemSlotPrefab) return;

        // 清空現有項目
        this.itemContainer.removeAllChildren();

        // 取得所有道具
        const items = this._inventory.getAllItems();

        items.forEach((count, itemId) => {
            const slot = instantiate(this.itemSlotPrefab!);
            slot.parent = this.itemContainer;

            // TODO: 設定 slot 顯示
            this.setupSlot(slot, itemId, count);
        });
    }

    private setupSlot(slot: Node, itemId: string, count: number): void {
        // TODO: 設定道具圖示、數量
        const itemData = DataManager.getInstance().getItem(itemId);
        if (!itemData) return;

        // 點擊事件
        slot.on(Node.EventType.TOUCH_END, () => {
            this.selectItem(itemId);
        });
    }

    /**
     * 選擇道具
     */
    public selectItem(itemId: string): void {
        this._selectedItemId = itemId;
        this.updateDetailPanel();
    }

    private updateDetailPanel(): void {
        if (!this.detailPanel || !this._selectedItemId) return;

        const itemData = DataManager.getInstance().getItem(this._selectedItemId);
        if (!itemData) return;

        // TODO: 更新詳細面板顯示
        console.log(`Selected: ${itemData.name}`);
    }

    /**
     * 使用選中的道具
     */
    public useSelectedItem(): void {
        if (this._selectedItemId && this._inventory) {
            this._inventory.useItem(this._selectedItemId);
            this.refresh();
        }
    }

    /**
     * 裝備選中的道具
     */
    public equipSelectedItem(): void {
        if (this._selectedItemId && this._inventory) {
            this._inventory.equip(this._selectedItemId);
            this.refresh();
        }
    }

    /**
     * 關閉面板
     */
    public close(): void {
        this.node.active = false;
    }
}
