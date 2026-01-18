/**
 * Room - 房間類
 * 
 * 管理單一房間的狀態、敵人、觸發器
 */

import { _decorator, Component, Node, Prefab, instantiate, Vec3, resources } from 'cc';
import { EventBus, GameEvents } from '../../core/EventBus';
import { RoomData } from '../../core/DataManager';
import { Enemy } from '../entity/Enemy';
import { Door } from './Door';
import { Chest } from './Chest';
import { TriggerBase } from './triggers/TriggerBase';

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

    @property(Node)
    private itemContainer: Node | null = null;

    private _data: RoomData | null = null;
    private _state: RoomState = RoomState.INACTIVE;
    private _enemies: Map<string, Enemy> = new Map();
    private _doors: Map<string, Door> = new Map();
    private _chests: Map<string, Chest> = new Map();
    private _triggers: Map<string, TriggerBase> = new Map();
    private _enemyGroups: Map<string, string[]> = new Map();

    public get state(): RoomState {
        return this._state;
    }

    public get data(): RoomData | null {
        return this._data;
    }

    public getDoor(doorId: string): Door | undefined {
        return this._doors.get(doorId);
    }

    public getChest(chestId: string): Chest | undefined {
        return this._chests.get(chestId);
    }

    public getTrigger(triggerId: string): TriggerBase | undefined {
        return this._triggers.get(triggerId);
    }

    /**
     * 初始化房間
     */
    public async init(data: RoomData): Promise<void> {
        this._data = data;
        this._state = RoomState.LOADING;

        await this.setupDoors();
        await this.setupChests();
        await this.setupTriggers();
        await this.spawnEnemies();

        this._state = this._enemies.size > 0 ? RoomState.COMBAT : RoomState.ACTIVE;

        // 如果有敵人，鎖門
        if (this._state === RoomState.COMBAT) {
            this.lockCombatDoors();
        }
    }

    private async setupDoors(): Promise<void> {
        if (!this._data?.doors || !this.doorContainer) return;

        for (const doorData of this._data.doors) {
            const prefab = await this.loadPrefab(`prefabs/world/door`);
            if (!prefab) continue;

            const doorNode = instantiate(prefab);
            doorNode.parent = this.doorContainer;

            const door = doorNode.getComponent(Door);
            if (door) {
                const connection = Object.values(this._data.connections || {}).find(c => c.doorId === doorData.doorId);
                const fullDoorData = {
                    ...doorData,
                    targetRoomId: connection?.roomId,
                };
                door.init(fullDoorData);
                this._doors.set(door.doorId, door);
            }
        }
    }

    private async setupChests(): Promise<void> {
        if (!this._data?.chests || !this.triggerContainer) return;

        for (const chestData of this._data.chests) {
            const prefab = await this.loadPrefab(`prefabs/world/chest`);
            if (!prefab) continue;

            const chestNode = instantiate(prefab);
            // @ts-ignore
            chestNode.parent = this.itemContainer;

            const chest = chestNode.getComponent(Chest);
            if (chest) {
                // @ts-ignore
                chest.init(chestData);
                this._chests.set(chest.chestId, chest);
            }
        }
    }

    private async setupTriggers(): Promise<void> {
        if (!this._data?.triggers || !this.triggerContainer) return;

        for (const triggerData of this._data.triggers) {
            const prefab = await this.loadPrefab(`prefabs/triggers/${triggerData.triggerId}`);
            if (!prefab) continue;

            const triggerNode = instantiate(prefab);
            triggerNode.parent = this.triggerContainer;

            const trigger = triggerNode.getComponent(TriggerBase);
            if (trigger) {
                // @ts-ignore
                trigger.init(triggerData);
                this._triggers.set(trigger.triggerId, trigger);
            }
        }
    }

    private async spawnEnemies(): Promise<void> {
        if (!this._data?.spawns?.enemies || !this.enemyContainer) return;

        for (const spawn of this._data.spawns.enemies) {
            const prefab = await this.loadPrefab(`prefabs/enemies/${spawn.enemyId}`);
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

    private loadPrefab(path: string): Promise<Prefab | null> {
        return new Promise((resolve) => {
            resources.load(path, Prefab, (err, prefab) => {
                if (err) {
                    console.error(`Failed to load prefab: ${path}`, err);
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
