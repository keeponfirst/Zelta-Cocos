/**
 * Player - 玩家實體
 * 
 * 玩家角色的主要控制類
 */

import { _decorator, Vec3 } from 'cc';
import { Entity } from '../../core/Entity';
import { InputSystem } from '../../systems/InputSystem';
import { HealthComponent } from '../components/HealthComponent';
import { MovementComponent } from '../components/MovementComponent';
import { CombatComponent } from '../components/CombatComponent';
import { InventoryComponent } from '../components/InventoryComponent';

const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Entity {
    @property
    public moveSpeed: number = 200;

    private _health: HealthComponent | null = null;
    private _movement: MovementComponent | null = null;
    private _combat: CombatComponent | null = null;
    private _inventory: InventoryComponent | null = null;

    protected start(): void {
        this.entityId = 'player';
        this.initComponents();
    }

    private initComponents(): void {
        // TODO: 初始化元件
        this._health = this.addGameComponent(HealthComponent);
        this._movement = this.addGameComponent(MovementComponent);
        this._combat = this.addGameComponent(CombatComponent);
        this._inventory = this.addGameComponent(InventoryComponent);

        if (this._health) {
            this._health.maxHp = 6;
            this._health.hp = 6;
        }

        if (this._movement) {
            this._movement.speed = this.moveSpeed;
        }
    }

    protected update(dt: number): void {
        super.update(dt);
        this.handleInput();
        this.updateAnimation();
    }

    private updateAnimation(): void {
        if (!this._movement) return;

        // TODO: Implement actual animation state changes
        const animState = this._movement.isMoving ? 'Run' : 'Idle';
        // console.log(`Player animation state: ${animState}`);
    }

    private handleInput(): void {
        const input = InputSystem.getInstance();
        if (!input) return;

        // 移動
        const dir = input.getDirection();
        if (this._movement) {
            this._movement.move(new Vec3(dir.x, dir.y, 0));
        }

        // 攻擊
        if (input.isButtonPressed('attack')) {
            this.attack();
        }

        // 使用道具
        if (input.isButtonPressed('useItem')) {
            this.useEquippedItem();
        }
    }

    /**
     * 攻擊
     */
    public attack(): void {
        if (this._combat?.canAttack()) {
            this._combat.attack();
        }
    }

    /**
     * 使用當前裝備道具
     */
    public useEquippedItem(): void {
        // TODO: 取得當前裝備並使用
        if (this._inventory) {
            const equipped = this._inventory.getEquippedItem();
            if (equipped) {
                this._inventory.useItem(equipped);
            }
        }
    }

    /**
     * 受到傷害
     */
    public takeDamage(amount: number): void {
        if (this._health) {
            this._health.takeDamage(amount);
        }
    }

    /**
     * 回復生命
     */
    public heal(amount: number): void {
        if (this._health) {
            this._health.heal(amount);
        }
    }

    public get hp(): number {
        return this._health?.hp || 0;
    }

    public get maxHp(): number {
        return this._health?.maxHp || 0;
    }

    public get isInvincible(): boolean {
        return this._health?.isInvincible || false;
    }
}
