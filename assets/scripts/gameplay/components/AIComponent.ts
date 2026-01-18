/**
 * AIComponent - AI 行為元件
 */

import { Vec3 } from 'cc';
import { Component } from '../../core/Component';
import { MovementComponent } from './MovementComponent';

export type AIBehavior = 'idle' | 'patrol' | 'chase' | 'fly';

export class AIComponent extends Component {
    public behavior: AIBehavior = 'patrol';
    public detectRange: number = 150;
    public patrolRadius: number = 100;
    public patrolWaitTime: number = 2;

    private _target: Vec3 | null = null;
    private _patrolOrigin: Vec3 = new Vec3();
    private _patrolTimer: number = 0;
    private _isWaiting: boolean = false;
    private _movement: MovementComponent | null = null;

    public onAdd(): void {
        this._movement = this.getComponent(MovementComponent);
        if (this.entity) {
            this._patrolOrigin = this.entity.node.position.clone();
        }
    }

    public update(dt: number): void {
        switch (this.behavior) {
            case 'idle':
                this.updateIdle(dt);
                break;
            case 'patrol':
                this.updatePatrol(dt);
                break;
            case 'chase':
                this.updateChase(dt);
                break;
            case 'fly':
                this.updateFly(dt);
                break;
        }
    }

    private updateIdle(dt: number): void {
        this._movement?.stop();
    }

    private updatePatrol(dt: number): void {
        // TODO: 實作巡邏行為
        if (this._isWaiting) {
            this._patrolTimer -= dt;
            if (this._patrolTimer <= 0) {
                this._isWaiting = false;
                this.pickNewPatrolTarget();
            }
            return;
        }

        if (!this._target) {
            this.pickNewPatrolTarget();
            return;
        }

        // 檢查是否到達目標
        if (this.entity &&
            this.entity.node.position.clone().subtract(this._target).lengthSqr() < 100) {
            this._isWaiting = true;
            this._patrolTimer = this.patrolWaitTime;
            this._movement?.stop();
            return;
        }

        // 移動到目標
        this.moveToTarget();
    }

    private updateChase(dt: number): void {
        // TODO: 實作追擊行為
        // 需要取得玩家位置
        const playerPos = this.getPlayerPosition();
        if (!playerPos || !this.entity) {
            this.updatePatrol(dt);
            return;
        }

        const dist = this.entity.node.position.clone().subtract(playerPos).length();

        if (dist > this.detectRange) {
            // 超出偵測範圍，回到巡邏
            this.updatePatrol(dt);
            return;
        }

        // 追擊玩家
        this._target = playerPos;
        this.moveToTarget();
    }

    private updateFly(dt: number): void {
        // TODO: 飛行敵人行為，類似 chase 但可穿越障礙
        this.updateChase(dt);
    }

    private pickNewPatrolTarget(): void {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * this.patrolRadius;

        this._target = new Vec3(
            this._patrolOrigin.x + Math.cos(angle) * dist,
            this._patrolOrigin.y + Math.sin(angle) * dist,
            0
        );
    }

    private moveToTarget(): void {
        if (!this._target || !this.entity || !this._movement) return;

        const dir = this._target.clone().subtract(this.entity.node.position).normalize();
        this._movement.move(dir);
    }

    private getPlayerPosition(): Vec3 | null {
        // TODO: 取得玩家位置
        return null;
    }

    /**
     * 設定追擊目標
     */
    public setTarget(position: Vec3): void {
        this._target = position.clone();
    }

    /**
     * 清除目標
     */
    public clearTarget(): void {
        this._target = null;
    }
}
