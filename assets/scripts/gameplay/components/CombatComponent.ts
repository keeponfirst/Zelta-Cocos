/**
 * CombatComponent - 戰鬥元件
 */

import { Component } from '../../core/Component';
import { EventBus } from '../../core/EventBus';

export class CombatComponent extends Component {
    public attackPower: number = 1;
    public attackRange: number = 40;
    public attackCooldown: number = 0.3;

    private _cooldownTimer: number = 0;
    private _isAttacking: boolean = false;
    private _attackDuration: number = 0.2;
    private _attackTimer: number = 0;

    public get isAttacking(): boolean {
        return this._isAttacking;
    }

    public update(dt: number): void {
        // 冷卻計時
        if (this._cooldownTimer > 0) {
            this._cooldownTimer -= dt;
        }

        // 攻擊動作計時
        if (this._isAttacking) {
            this._attackTimer -= dt;
            if (this._attackTimer <= 0) {
                this._isAttacking = false;
            }
        }
    }

    /**
     * 是否可以攻擊
     */
    public canAttack(): boolean {
        return this._cooldownTimer <= 0 && !this._isAttacking;
    }

    /**
     * 執行攻擊
     */
    public attack(): boolean {
        if (!this.canAttack()) return false;

        this._isAttacking = true;
        this._attackTimer = this._attackDuration;
        this._cooldownTimer = this.attackCooldown;

        // TODO: 產生攻擊碰撞區域
        // TODO: 播放攻擊動畫

        return true;
    }

    /**
     * 對目標造成傷害
     */
    public dealDamage(target: Component): void {
        // TODO: 取得目標的 HealthComponent 並造成傷害
        console.log(`Dealing ${this.attackPower} damage`);
    }

    /**
     * 取得攻擊方向 (基於 MovementComponent)
     */
    public getAttackDirection(): { x: number; y: number } {
        // TODO: 從 MovementComponent 取得朝向
        return { x: 0, y: -1 };
    }
}
