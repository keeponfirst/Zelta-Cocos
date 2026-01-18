/**
 * Switch - 開關觸發器
 * 
 * 攻擊或迴力鏢觸發切換狀態
 */

import { _decorator, Collider2D, Node } from 'cc';
import { TriggerBase } from './TriggerBase';
import { Projectile } from '../../entity/Projectile';

const { ccclass, property } = _decorator;

@ccclass('Switch')
export class Switch extends TriggerBase {
    @property(Node)
    private onSprite: Node | null = null;

    @property(Node)
    private offSprite: Node | null = null;

    /**
     * 被攻擊時觸發
     */
    public onHit(): void {
        this.toggle();
    }

    protected onEnter(other: Collider2D): void {
        // 檢查是否被投射物擊中
        const projectile = other.node.getComponent(Projectile);
        if (projectile) {
            this.toggle();
        }
    }

    protected onExit(other: Collider2D): void {
        // 開關不需要處理離開
    }

    protected onActivate(): void {
        this.updateVisual(true);
        // TODO: 播放開關音效
    }

    protected onDeactivate(): void {
        this.updateVisual(false);
        // TODO: 播放開關音效
    }

    private updateVisual(on: boolean): void {
        if (this.onSprite) {
            this.onSprite.active = on;
        }
        if (this.offSprite) {
            this.offSprite.active = !on;
        }
    }
}
