/**
 * Room - 房間類
 * 
 * 管理單一房間的狀態、敵人、觸發器
 */

import { _decorator, Component, Node, Prefab, instantiate, Vec3, resources } from 'cc';
import { EventBus, GameEvents } from '../../core/EventBus';
import { RoomData } from '../../core/DataManager';
import { Enemy } from '../entity/Enemy';

const { ccclass, property } = _decorator;

export enum RoomState {
    INACTIVE = 'inactive',
    LOADING = 'loading',
    ACTIVE = 'active',
    COMBAT = 'combat',
    CLEARED = 'cleared',
}

@ccclass('Room')
export class Room extends Component {
    @property(Node)
    private enemyContainer: Node | null = null;

    @property(Node)
    private triggerContainer: Node | null = null;

    @property(Node)
    private doorContainer: Node | null = null;

    private _data: RoomData | null = null;
    private _state: RoomState = RoomState.INACTIVE;
    private _enemies: Map<string, Enemy> = new Map();
    private _enemyGroups: Map<string, string[]> = new Map();

    public get state(): RoomState {
        return this._state;
    }

    public get data(): RoomData | null {
        return this._data;
    }

    /**
     * 初始化房間
     */
    public async init(data: RoomData): Promise<void> {
        this._data = data;
        this._state = RoomState.LOADING;

        this.setupTriggers();
        this.setupDoors();
        await this.spawnEnemies();

        this._state = this._enemies.size > 0 ? RoomState.COMBAT : RoomState.ACTIVE;

        // 如果有敵人，鎖門
        if (this._state === RoomState.COMBAT) {
            this.lockCombatDoors();
        }
    }

    private setupTriggers(): void {
        if (!this._data?.triggers) return;

        for (const trigger of this._data.triggers) {
            // TODO: 實例化觸發器
            console.log(`Setup trigger: ${trigger.triggerId}`);
        }
    }

    private setupDoors(): void {
        if (!this._data?.connections) return;

        for (const [direction, connection] of Object.entries(this._data.connections)) {
            // TODO: 實例化門
            console.log(`Setup door: ${direction} -> ${connection.roomId}`);
        }
    }

    private async spawnEnemies(): Promise<void> {
        if (!this._data?.spawns?.enemies || !this.enemyContainer) return;

        for (const spawn of this._data.spawns.enemies) {
            const prefab = await this.loadEnemyPrefab(spawn.enemyId);
            if (!prefab) continue;

            const enemyNode = instantiate(prefab);
            enemyNode.position = new Vec3(spawn.x, spawn.y, 0);
            this.enemyContainer.addChild(enemyNode);

            const enemy = enemyNode.getComponent(Enemy);
            if (enemy) {
                this._enemies.set(enemy.entityId, enemy);

                // 記錄群組
                const group = spawn.group || 'default';
                if (!this._enemyGroups.has(group)) {
                    this._enemyGroups.set(group, []);
                }
                this._enemyGroups.get(group)!.push(enemy.entityId);
            }
        }

        // 監聽敵人死亡
        EventBus.getInstance().on(GameEvents.ENEMY_DEATH, this.onEnemyDeath.bind(this));
    }

    private loadEnemyPrefab(enemyId: string): Promise<Prefab | null> {
        return new Promise((resolve) => {
            resources.load(`prefabs/enemies/${enemyId}`, Prefab, (err, prefab) => {
                if (err) {
                    console.error(`Failed to load enemy prefab: ${enemyId}`, err);
                    resolve(null);
                } else {
                    resolve(prefab);
                }
            });
        });
    }

    private onEnemyDeath(data: { enemyId: string }): void {
        this._enemies.delete(data.enemyId);

        if (this._enemies.size === 0 && this._state === RoomState.COMBAT) {
            this.onAllEnemiesCleared();
        }
    }

    private onAllEnemiesCleared(): void {
        this._state = RoomState.CLEARED;

        EventBus.getInstance().emit(GameEvents.ENEMY_CLEARED, {
            roomId: this._data?.id,
        });

        // 解鎖戰鬥門
        this.unlockCombatDoors();
    }

    private lockCombatDoors(): void {
        // TODO: 鎖定所有戰鬥門
        console.log('Locking combat doors');
    }

    private unlockCombatDoors(): void {
        // TODO: 解鎖所有戰鬥門
        console.log('Unlocking combat doors');

        EventBus.getInstance().emit(GameEvents.DOOR_OPEN, {
            roomId: this._data?.id,
            doorType: 'combat',
        });
    }

    /**
     * 標記為已清除 (從存檔載入時)
     */
    public markAsCleared(): void {
        this._state = RoomState.CLEARED;
        this._enemies.clear();
    }

    /**
     * 檢查房間是否已清除
     */
    public isCleared(): boolean {
        return this._state === RoomState.CLEARED;
    }

    protected onDestroy(): void {
        EventBus.getInstance().off(GameEvents.ENEMY_DEATH, this.onEnemyDeath.bind(this));
    }
}
