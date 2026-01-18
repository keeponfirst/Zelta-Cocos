/**
 * Enemy - 敵人實體
 * 
 * 敵人的基類，由 enemies.json 定義屬性
 */

import { _decorator } from 'cc';
import { Entity } from '../../core/Entity';
import { DataManager, EnemyData } from '../../core/DataManager';
import { EventBus, GameEvents } from '../../core/EventBus';
import { HealthComponent } from '../components/HealthComponent';
import { MovementComponent } from '../components/MovementComponent';
import { CombatComponent } from '../components/CombatComponent';
import { AIComponent } from '../components/AIComponent';

const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Entity {
    @property
    public enemyType: string = 'slime';

    @property
    public groupId: string = '';

    private _data: EnemyData | null = null;
    private _health: HealthComponent | null = null;
    private _movement: MovementComponent | null = null;
    private _combat: CombatComponent | null = null;
    private _ai: AIComponent | null = null;

    protected start(): void {
        this.loadData();
        this.initComponents();
    }

    private loadData(): void {
        this._data = DataManager.getInstance().getEnemy(this.enemyType);
        if (!this._data) {
            console.error(`Enemy type not found: ${this.enemyType}`);
        }
    }

    private initComponents(): void {
        if (!this._data) return;

        this._health = this.addGameComponent(HealthComponent);
        this._movement = this.addGameComponent(MovementComponent);
        this._combat = this.addGameComponent(CombatComponent);
        this._ai = this.addGameComponent(AIComponent);

        if (this._health) {
            this._health.maxHp = this._data.hp;
            this._health.hp = this._data.hp;
            this._health.onDeath = () => this.onDeath();
        }

        if (this._movement) {
            this._movement.speed = this._data.speed;
        }

        if (this._combat) {
            this._combat.attackPower = this._data.attack;
        }

        if (this._ai) {
            this._ai.behavior = this._data.behavior;
            this._ai.detectRange = this._data.detectRange || 150;
        }
    }

    /**
     * 敵人死亡
     */
    private onDeath(): void {
        // 發送死亡事件
        EventBus.getInstance().emit(GameEvents.ENEMY_DEATH, {
            enemyId: this.entityId,
            enemyType: this.enemyType,
            groupId: this.groupId,
        });

        // 掉落道具
        this.dropItems();

        // 銷毀
        this.node.destroy();
    }

    /**
     * 掉落道具
     */
    private dropItems(): void {
        if (!this._data?.drops) return;

        for (const drop of this._data.drops) {
            if (Math.random() < drop.chance) {
                // TODO: 生成掉落物
                console.log(`Dropped: ${drop.itemId}`);
                EventBus.getInstance().emit(GameEvents.ITEM_PICKUP, {
                    itemId: drop.itemId,
                    position: this.node.position.clone(),
                });
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

    public get hp(): number {
        return this._health?.hp || 0;
    }

    public get isDead(): boolean {
        return this._health?.isDead || false;
    }
}
