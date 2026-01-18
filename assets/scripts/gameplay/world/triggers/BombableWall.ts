/**
 * BombableWall - 可炸牆
 * 
 * 被炸彈破壞後開啟通道
 */

import { _decorator, Collider2D, Node } from 'cc';
import { TriggerBase } from './TriggerBase';
import { EventBus, GameEvents } from '../../../core/EventBus';

const { ccclass, property } = _decorator;

@ccclass('BombableWall')
export class BombableWall extends TriggerBase {
    @property(Node)
    private wallSprite: Node | null = null;

    @property(Node)
    private destroyedSprite: Node | null = null;

    @property
    private isDestroyed: boolean = false;

    protected start(): void {
        super.start();
        this.oneTime = true; // 可炸牆只能炸一次
        this.updateVisual();
    }

    /**
     * 被炸彈擊中
     */
    public onBombHit(): void {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.activate();

        // TODO: 播放爆炸特效
        // TODO: 播放爆炸音效
    }

    protected onEnter(other: Collider2D): void {
        // 檢查是否是炸彈爆炸碰撞
        // TODO: 炸彈組件檢測
    }

    protected onExit(other: Collider2D): void {
        // 不需要處理
    }

    protected onActivate(): void {
        this.updateVisual();

        // 禁用碰撞
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.enabled = false;
        }
    }

    protected onDeactivate(): void {
        // 可炸牆不會恢復
    }

    private updateVisual(): void {
        if (this.wallSprite) {
            this.wallSprite.active = !this.isDestroyed;
        }
        if (this.destroyedSprite) {
            this.destroyedSprite.active = this.isDestroyed;
        }
    }

    /**
     * 從存檔載入
     */
    public loadFromSave(isDestroyed: boolean): void {
        this.isDestroyed = isDestroyed;
        if (isDestroyed) {
            this.activate();
        }
        this.updateVisual();
    }
}
