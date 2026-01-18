/**
 * HealthComponent - 生命值元件
 */

import { Component } from '../../core/Component';
import { EventBus, GameEvents } from '../../core/EventBus';

export class HealthComponent extends Component {
    public hp: number = 6;
    public maxHp: number = 6;
    public invincibleTime: number = 1.0;
    public onDeath: (() => void) | null = null;

    private _invincibleTimer: number = 0;
    private _isInvincible: boolean = false;

    public get isInvincible(): boolean {
        return this._isInvincible;
    }

    public get isDead(): boolean {
        return this.hp <= 0;
    }

    public update(dt: number): void {
        if (this._isInvincible) {
            this._invincibleTimer -= dt;
            if (this._invincibleTimer <= 0) {
                this._isInvincible = false;
            }
        }
    }

    /**
     * 受到傷害
     */
    public takeDamage(amount: number): boolean {
        if (this._isInvincible || this.isDead) return false;

        this.hp = Math.max(0, this.hp - amount);
        this._isInvincible = true;
        this._invincibleTimer = this.invincibleTime;

        EventBus.getInstance().emit(GameEvents.PLAYER_HURT, {
            damage: amount,
            currentHp: this.hp,
        });

        if (this.isDead && this.onDeath) {
            this.onDeath();
        }

        return true;
    }

    /**
     * 回復生命
     */
    public heal(amount: number): void {
        if (this.isDead) return;

        const oldHp = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + amount);

        if (this.hp > oldHp) {
            EventBus.getInstance().emit(GameEvents.PLAYER_HEAL, {
                amount: this.hp - oldHp,
                currentHp: this.hp,
            });
        }
    }

    /**
     * 增加最大生命
     */
    public increaseMaxHp(amount: number): void {
        this.maxHp += amount;
        this.hp += amount;
    }

    /**
     * 完全回復
     */
    public fullHeal(): void {
        this.hp = this.maxHp;
    }
}
