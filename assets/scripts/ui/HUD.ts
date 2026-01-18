/**
 * HUD - 遊戲 HUD
 * 
 * 顯示血量、當前道具、鑰匙/炸彈數量
 */

import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { EventBus, GameEvents } from '../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('HUD')
export class HUD extends Component {
    @property([Node])
    private hearts: Node[] = [];

    @property(Label)
    private keyCountLabel: Label | null = null;

    @property(Label)
    private bombCountLabel: Label | null = null;

    @property(Sprite)
    private equippedItemSprite: Sprite | null = null;

    @property(Node)
    private equippedItemNode: Node | null = null;

    private _maxHearts: number = 3;
    private _currentHp: number = 6;

    protected start(): void {
        this.setupEvents();
        this.updateHearts(6, 6);
    }

    private setupEvents(): void {
        const bus = EventBus.getInstance();
        bus.on(GameEvents.PLAYER_HURT, this.onPlayerHurt.bind(this));
        bus.on(GameEvents.PLAYER_HEAL, this.onPlayerHeal.bind(this));
        bus.on(GameEvents.ITEM_PICKUP, this.onItemPickup.bind(this));
    }

    private onPlayerHurt(data: { damage: number; currentHp: number }): void {
        this.updateHearts(data.currentHp, this._maxHearts * 2);
    }

    private onPlayerHeal(data: { amount: number; currentHp: number }): void {
        this.updateHearts(data.currentHp, this._maxHearts * 2);
    }

    private onItemPickup(data: { itemId: string; count: number }): void {
        if (data.itemId === 'key') {
            this.updateKeyCount();
        } else if (data.itemId === 'bomb') {
            this.updateBombCount();
        }
    }

    /**
     * 更新血量顯示
     */
    public updateHearts(hp: number, maxHp: number): void {
        this._currentHp = hp;
        this._maxHearts = Math.ceil(maxHp / 2);

        for (let i = 0; i < this.hearts.length; i++) {
            const heart = this.hearts[i];
            if (!heart) continue;

            if (i >= this._maxHearts) {
                heart.active = false;
            } else {
                heart.active = true;
                const hpForThisHeart = Math.max(0, Math.min(2, hp - i * 2));
                // TODO: 設定心的狀態 (滿/半/空)
                this.setHeartState(heart, hpForThisHeart);
            }
        }
    }

    private setHeartState(heart: Node, state: number): void {
        // TODO: 根據 state (0=空, 1=半, 2=滿) 設定心的顯示
        // state 0 = 空心
        // state 1 = 半心
        // state 2 = 滿心
    }

    /**
     * 更新鑰匙數量
     */
    public updateKeyCount(count?: number): void {
        if (this.keyCountLabel) {
            this.keyCountLabel.string = `x${count ?? 0}`;
        }
    }

    /**
     * 更新炸彈數量
     */
    public updateBombCount(count?: number): void {
        if (this.bombCountLabel) {
            this.bombCountLabel.string = `x${count ?? 0}`;
        }
    }

    /**
     * 更新當前裝備道具
     */
    public updateEquippedItem(itemId: string | null): void {
        if (this.equippedItemNode) {
            this.equippedItemNode.active = itemId !== null;
        }
        // TODO: 載入道具 Sprite
    }

    protected onDestroy(): void {
        const bus = EventBus.getInstance();
        bus.off(GameEvents.PLAYER_HURT, this.onPlayerHurt.bind(this));
        bus.off(GameEvents.PLAYER_HEAL, this.onPlayerHeal.bind(this));
        bus.off(GameEvents.ITEM_PICKUP, this.onItemPickup.bind(this));
    }
}
