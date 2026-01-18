/**
 * ItemDrop - 掉落道具
 * 
 * 敵人死亡掉落的可拾取道具
 */

import { _decorator, Collider2D, Contact2DType } from 'cc';
import { Entity } from '../../core/Entity';
import { EventBus, GameEvents } from '../../core/EventBus';
import { Player } from './Player';

const { ccclass, property } = _decorator;

@ccclass('ItemDrop')
export class ItemDrop extends Entity {
    @property
    public itemId: string = 'heart';

    @property
    public count: number = 1;

    @property
    public autoPickup: boolean = true;

    @property
    public lifetime: number = 30; // 秒

    private _elapsed: number = 0;
    private _collected: boolean = false;

    protected start(): void {
        this.entityId = `drop_${this.itemId}_${Date.now()}`;
        this.setupCollision();
    }

    private setupCollision(): void {
        // TODO: 設定碰撞
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }

    protected update(dt: number): void {
        super.update(dt);

        this._elapsed += dt;

        // 超時消失
        if (this._elapsed > this.lifetime) {
            this.node.destroy();
        }

        // 閃爍效果 (剩餘 5 秒時)
        if (this.lifetime - this._elapsed < 5) {
            // TODO: 閃爍動畫
        }
    }

    private onContact(other: Collider2D): void {
        if (this._collected) return;

        const player = other.node.getComponent(Player);
        if (player && this.autoPickup) {
            this.collect();
        }
    }

    /**
     * 收集道具
     */
    public collect(): void {
        if (this._collected) return;
        this._collected = true;

        EventBus.getInstance().emit(GameEvents.ITEM_PICKUP, {
            itemId: this.itemId,
            count: this.count,
        });

        // TODO: 播放收集動畫/音效
        this.node.destroy();
    }

    /**
     * 設定掉落資訊
     */
    public setDrop(itemId: string, count: number = 1): void {
        this.itemId = itemId;
        this.count = count;
    }
}
