/**
 * Projectile - 投射物
 * 
 * 如迴力鏢、箭矢等飛行物體
 */

import { _decorator, Vec3 } from 'cc';
import { Entity } from '../../core/Entity';
import { MovementComponent } from '../components/MovementComponent';

const { ccclass, property } = _decorator;

export type ProjectileType = 'boomerang' | 'arrow' | 'bomb';

@ccclass('Projectile')
export class Projectile extends Entity {
    @property
    public projectileType: ProjectileType = 'arrow';

    @property
    public damage: number = 1;

    @property
    public speed: number = 300;

    @property
    public lifeTime: number = 3;

    private _direction: Vec3 = new Vec3(1, 0, 0);
    private _elapsed: number = 0;
    private _owner: Entity | null = null;
    private _returning: boolean = false;

    /**
     * 發射投射物
     */
    public launch(direction: Vec3, owner: Entity): void {
        this._direction = direction.normalize();
        this._owner = owner;
        this._elapsed = 0;
        this._returning = false;
    }

    protected update(dt: number): void {
        super.update(dt);

        this._elapsed += dt;

        if (this.projectileType === 'boomerang') {
            this.updateBoomerang(dt);
        } else {
            this.updateLinear(dt);
        }

        // 生命週期結束
        if (this._elapsed > this.lifeTime) {
            this.destroySelf();
        }
    }

    private updateLinear(dt: number): void {
        const move = this._direction.clone().multiplyScalar(this.speed * dt);
        this.node.position = this.node.position.add(move);
    }

    private updateBoomerang(dt: number): void {
        // TODO: 實作迴力鏢返回邏輯
        if (!this._returning && this._elapsed > this.lifeTime / 2) {
            this._returning = true;
        }

        if (this._returning && this._owner) {
            // 朝向擁有者
            const toOwner = this._owner.node.position.clone().subtract(this.node.position);
            this._direction = toOwner.normalize();
        }

        const move = this._direction.clone().multiplyScalar(this.speed * dt);
        this.node.position = this.node.position.add(move);
    }

    /**
     * 碰撞處理
     */
    public onHit(target: Entity): void {
        // TODO: 處理碰撞邏輯
        console.log(`Projectile hit: ${target.entityId}`);

        // 非迴力鏢立即銷毀
        if (this.projectileType !== 'boomerang') {
            this.destroySelf();
        }
    }

    private destroySelf(): void {
        this.node.destroy();
    }
}
