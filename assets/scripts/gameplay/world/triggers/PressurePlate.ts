/**
 * PressurePlate - 壓力板觸發器
 * 
 * 站上時觸發，離開時解除
 */

import { _decorator, Collider2D, Node } from 'cc';
import { TriggerBase } from './TriggerBase';
import { Player } from '../../entity/Player';

const { ccclass, property } = _decorator;

@ccclass('PressurePlate')
export class PressurePlate extends TriggerBase {
    @property(Node)
    private pressedSprite: Node | null = null;

    @property(Node)
    private releasedSprite: Node | null = null;

    private _entitiesOnPlate: number = 0;

    protected onEnter(other: Collider2D): void {
        // 檢查是玩家或可推動的物體
        const player = other.node.getComponent(Player);
        const isPushable = other.node.getComponent('PushBlock'); // TODO: PushBlock 類

        if (player || isPushable) {
            this._entitiesOnPlate++;
            if (this._entitiesOnPlate === 1) {
                this.activate();
            }
        }
    }

    protected onExit(other: Collider2D): void {
        const player = other.node.getComponent(Player);
        const isPushable = other.node.getComponent('PushBlock');

        if (player || isPushable) {
            this._entitiesOnPlate = Math.max(0, this._entitiesOnPlate - 1);
            if (this._entitiesOnPlate === 0 && !this.oneTime) {
                this.deactivate();
            }
        }
    }

    protected onActivate(): void {
        this.updateVisual(true);
        // TODO: 播放按下音效
    }

    protected onDeactivate(): void {
        this.updateVisual(false);
        // TODO: 播放釋放音效
    }

    private updateVisual(pressed: boolean): void {
        if (this.pressedSprite) {
            this.pressedSprite.active = pressed;
        }
        if (this.releasedSprite) {
            this.releasedSprite.active = !pressed;
        }
    }
}
