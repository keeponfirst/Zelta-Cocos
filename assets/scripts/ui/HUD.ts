/**
 * HUD - 遊戲 HUD
 * 
 * 顯示血量、盧比、當前道具
 */

import { _decorator, Component, Node, Label, Sprite, Prefab, instantiate } from 'cc';
import { EventBus, GameEvents } from '../core/EventBus';
import { HealthComponent } from '../gameplay/components/HealthComponent';
import { InventoryComponent } from '../gameplay/components/InventoryComponent';

const { ccclass, property } = _decorator;

@ccclass('HUD')
export class HUD extends Component {
    @property(Node)
    public heartsContainer: Node | null = null;

    @property(Label)
    public rupeeLabel: Label | null = null;

    @property(Sprite)
    public itemIcon: Sprite | null = null;

    @property(Prefab)
    public heartFullPrefab: Prefab | null = null;

    @property(Prefab)
    public heartHalfPrefab: Prefab | null = null;

    @property(Prefab)
    public heartEmptyPrefab: Prefab | null = null;

    protected start(): void {
        this.setupEvents();
    }

    protected onDestroy(): void {
        this.teardownEvents();
    }

    private setupEvents(): void {
        const bus = EventBus.getInstance();
        bus.on(GameEvents.PLAYER_HURT, this.onPlayerHpChange, this);
        bus.on(GameEvents.PLAYER_HEAL, this.onPlayerHpChange, this);
        // INVENTORY_CHANGE is not a real event, so we will listen for ITEM_PICKUP
        bus.on(GameEvents.ITEM_PICKUP, this.onInventoryChange, this);
    }

    private teardownEvents(): void {
        const bus = EventBus.getInstance();
        bus.off(GameEvents.PLAYER_HURT, this.onPlayerHpChange, this);
        bus.off(GameEvents.PLAYER_HEAL, this.onPlayerHpChange, this);
        bus.off(GameEvents.ITEM_PICKUP, this.onInventoryChange, this);
    }

    private onPlayerHpChange(data: { currentHp: number, maxHp: number }): void {
        this.updateHearts(data.currentHp, data.maxHp);
    }

    private onInventoryChange(data: { rupees?: number }): void {
        if (data.rupees !== undefined) {
            this.updateRupees(data.rupees);
        }
    }

    public updateHearts(current: number, max: number): void {
        if (!this.heartsContainer || !this.heartFullPrefab || !this.heartHalfPrefab || !this.heartEmptyPrefab) {
            return;
        }

        this.heartsContainer.removeAllChildren();
        const maxHearts = Math.ceil(max / 2);

        for (let i = 0; i < maxHearts; i++) {
            const heartValue = current - (i * 2);
            let heartPrefab: Prefab | null = null;

            if (heartValue >= 2) {
                heartPrefab = this.heartFullPrefab;
            } else if (heartValue >= 1) {
                heartPrefab = this.heartHalfPrefab;
            } else {
                heartPrefab = this.heartEmptyPrefab;
            }

            if (heartPrefab) {
                const heartNode = instantiate(heartPrefab);
                this.heartsContainer.addChild(heartNode);
            }
        }
    }

    public updateRupees(count: number): void {
        if (this.rupeeLabel) {
            this.rupeeLabel.string = `${count}`;
        }
    }

    public updateItemIcon(spriteFrameName: string): void {
        // This will be implemented later when item system is more complete
    }
}
