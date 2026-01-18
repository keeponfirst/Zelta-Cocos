/**
 * MovementComponent - 移動元件
 */

import { Vec3 } from 'cc';
import { Component } from '../../core/Component';

export class MovementComponent extends Component {
    public speed: number = 200;
    public velocity: Vec3 = new Vec3();
    public friction: number = 0.9;

    private _direction: Vec3 = new Vec3();

    public update(dt: number): void {
        if (!this.entity) return;

        // 套用移動
        if (this._direction.lengthSqr() > 0) {
            const move = this._direction.clone()
                .normalize()
                .multiplyScalar(this.speed * dt);

            this.entity.node.position = this.entity.node.position.add(move);
        }

        // 套用慣性/摩擦
        this.velocity.multiplyScalar(this.friction);
        if (this.velocity.lengthSqr() > 0.01) {
            this.entity.node.position = this.entity.node.position.add(
                this.velocity.clone().multiplyScalar(dt)
            );
        }
    }

    /**
     * 設定移動方向
     */
    public move(direction: Vec3): void {
        this._direction.set(direction);
    }

    /**
     * 停止移動
     */
    public stop(): void {
        this._direction.set(0, 0, 0);
    }

    /**
     * 施加力 (用於擊退等)
     */
    public applyForce(force: Vec3): void {
        this.velocity.add(force);
    }

    /**
     * 擊退
     */
    public knockback(fromPosition: Vec3, force: number): void {
        if (!this.entity) return;

        const dir = this.entity.node.position.clone()
            .subtract(fromPosition)
            .normalize();

        this.applyForce(dir.multiplyScalar(force));
    }

    /**
     * 取得朝向 (基於最後移動方向)
     */
    public getFacing(): Vec3 {
        if (this._direction.lengthSqr() > 0) {
            return this._direction.clone().normalize();
        }
        return new Vec3(0, -1, 0); // 預設朝下
    }
}
