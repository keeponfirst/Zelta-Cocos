/**
 * AIComponent - AI 行為元件
 */

import { find, Vec3 } from 'cc';
import { Component } from '../../core/Component';
import { Player } from '../entity/Player';
import { CombatComponent } from './CombatComponent';
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
    private _combat: CombatComponent | null = null;
    private _player: Player | null = null;

    public onAdd(): void {
        this._movement = this.getComponent(MovementComponent);
        this._combat = this.getComponent(CombatComponent);
        if (this.entity) {
            this._patrolOrigin = this.entity.node.position.clone();
        }
        const playerNode = find('player');
        if (playerNode) {
            this._player = playerNode.getComponent(Player);
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
        // Check for player first
        const playerPos = this.getPlayerPosition();
        if (playerPos && this.entity) {
            const distSqr = this.entity.node.position.clone().subtract(playerPos).lengthSqr();
            if (distSqr < this.detectRange * this.detectRange) {
                this.behavior = 'chase';
                return;
            }
        }
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

        // Check if we reached the target
        if (this.entity &&
            this.entity.node.position.clone().subtract(this._target).lengthSqr() < 100) { // 10*10
            this._isWaiting = true;
            this._patrolTimer = this.patrolWaitTime;
            this._movement?.stop();
            this._target = null;
            return;
        }

        // Move to target
        this.moveToTarget();
    }

    private updateChase(dt: number): void {
        const playerPos = this.getPlayerPosition();
        if (!playerPos || !this.entity || !this._combat) {
            this.behavior = 'patrol';
            this.clearTarget();
            return;
        }

        const distSqr = this.entity.node.position.clone().subtract(playerPos).lengthSqr();

        if (distSqr > this.detectRange * this.detectRange) {
            this.behavior = 'patrol';
            this.clearTarget();
            return;
        }

        const attackRangeSqr = this._combat.attackRange * this._combat.attackRange;
        if (distSqr <= attackRangeSqr) {
            this._movement?.stop();
            this._combat.attack();
        } else {
            this._target = playerPos;
            this.moveToTarget();
        }
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
        if (this._player && this._player.isValid) {
            return this._player.node.position;
        }

        const playerNode = find('player');
        if (playerNode) {
            this._player = playerNode.getComponent(Player);
            if (this._player) {
                return this._player.node.position;
            }
        }
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
