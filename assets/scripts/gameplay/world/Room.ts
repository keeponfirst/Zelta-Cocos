/**
 * Room - 房間類
 * 
 * 管理單一房間的狀態、敵人、觸發器
 */

import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
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
    public init(data: RoomData): void {
        this._data = data;
        this._state = RoomState.LOADING;

        this.setupTriggers();
        this.setupDoors();
        this.spawnEnemies();

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

    private spawnEnemies(): void {
        if (!this._data?.spawns?.enemies) return;

        for (const spawn of this._data.spawns.enemies) {
            // TODO: 實例化敵人
            console.log(`Spawn enemy: ${spawn.enemyId} at (${spawn.x}, ${spawn.y})`);

            // 記錄群組
            const group = spawn.group || 'default';
            if (!this._enemyGroups.has(group)) {
                this._enemyGroups.set(group, []);
            }
            this._enemyGroups.get(group)!.push(spawn.enemyId);
        }

        // 監聽敵人死亡
        EventBus.getInstance().on(GameEvents.ENEMY_DEATH, this.onEnemyDeath.bind(this));
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
