/**
 * CombatComponent - 戰鬥元件
 */

import { find } from 'cc';
import { Component } from '../../core/Component';
import { Entity } from '../../core/Entity';
import { EventBus } from '../../core/EventBus';
import { Player } from '../entity/Player';
import { HealthComponent } from './HealthComponent';

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
    public attack(target: Entity): boolean {
        if (!this.canAttack() || !this.entity) return false;

        this._isAttacking = true;
        this._attackTimer = this._attackDuration;
        this._cooldownTimer = this.attackCooldown;

        // Check distance and deal damage if close enough
        const selfPos = this.entity.node.position;
        const targetPos = target.node.position;
        const distSqr = selfPos.subtract(targetPos).lengthSqr();

        if (distSqr < this.attackRange * this.attackRange) {
            this.dealDamage(target);
        }

        // TODO: 播放攻擊動畫

        return true;
    }

    /**
     * 對目標造成傷害
     */
    public dealDamage(target: Entity): void {
        const health = target.getGameComponent(HealthComponent);
        if (health) {
            health.takeDamage(this.attackPower);
        }
    }

    /**
     * 取得攻擊方向 (基於 MovementComponent)
     */
    public getAttackDirection(): { x: number; y: number } {
        // TODO: 從 MovementComponent 取得朝向
        return { x: 0, y: -1 };
    }
}
