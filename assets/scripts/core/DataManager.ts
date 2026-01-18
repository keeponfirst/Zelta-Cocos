/**
 * DataManager - 資料管理器
 * 
 * 負責載入和管理 JSON 資料表
 * 
 * @example
 * const item = DataManager.getInstance().getItem('sword_wood');
 * const enemy = DataManager.getInstance().getEnemy('slime');
 */

import { _decorator, resources, JsonAsset } from 'cc';

// 資料型別定義
export interface ItemData {
    id: string;
    name: string;
    description?: string;
    type: 'consumable' | 'equipment' | 'key';
    stackable: boolean;
    maxStack?: number;
    effect?: {
        type: string;
        value: number;
        duration?: number;
    };
    sprite?: string;
    rarity?: string;
    icon?: number;
}

export interface EnemyData {
    id: string;
    name: string;
    hp: number;
    attack: number;
    speed: number;
    behavior: 'idle' | 'patrol' | 'chase' | 'fly';
    detectRange?: number;
    drops?: Array<{ itemId: string; chance: number }>;
    sprite?: string;
    hitbox?: { width: number; height: number };
}

export interface RoomData {
    id: string;
    name: string;
    size: { width: number; height: number };
    tilemap: string;
    connections?: Record<string, { roomId: string; doorId: string }>;
    doors?: Array<{ doorId: string; doorType: string }>;
    chests?: Array<{ chestId: string; itemId: string; itemCount: number; x: number; y: number; requiresTrigger?: boolean }>;
    spawns?: {
        enemies?: Array<{ enemyId: string; x: number; y: number; group?: string }>;
        items?: Array<{ itemId: string; x: number; y: number }>;
    };
    triggers?: Array<{ triggerId: string; type: string; x: number; y: number; params?: any }>;
    unlockCondition?: { type: string; params?: any };
}

export class DataManager {
    private static _instance: DataManager | null = null;

    private _items: Map<string, ItemData> = new Map();
    private _enemies: Map<string, EnemyData> = new Map();
    private _rooms: Map<string, RoomData> = new Map();
    private _loaded: boolean = false;

    private constructor() { }

    public static getInstance(): DataManager {
        if (!DataManager._instance) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }

    /**
     * 載入所有資料表
     */
    public async loadAll(): Promise<void> {
        // TODO: 實作資料載入
        if (this._loaded) return;

        await Promise.all([
            this.loadTable('data/tables/items', this._items, 'items'),
            this.loadTable('data/tables/enemies', this._enemies, 'enemies'),
            this.loadTable('data/tables/rooms', this._rooms, 'rooms'),
        ]);

        this._loaded = true;
    }

    private loadTable<T extends { id: string }>(
        path: string,
        map: Map<string, T>,
        key: string
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            resources.load(path, JsonAsset, (err, asset) => {
                if (err) {
                    console.error(`Failed to load ${path}:`, err);
                    reject(err);
                    return;
                }
                const data = asset.json as Record<string, T[]>;
                const items = data[key] || [];
                items.forEach(item => map.set(item.id, item));
                resolve();
            });
        });
    }

    /**
     * 取得道具資料
     */
    public getItem(id: string): ItemData | null {
        return this._items.get(id) || null;
    }

    /**
     * 取得敵人資料
     */
    public getEnemy(id: string): EnemyData | null {
        return this._enemies.get(id) || null;
    }

    /**
     * 取得房間資料
     */
    public getRoom(id: string): RoomData | null {
        return this._rooms.get(id) || null;
    }

    /**
     * 取得所有道具
     */
    public getAllItems(): ItemData[] {
        return Array.from(this._items.values());
    }

    /**
     * 取得所有敵人
     */
    public getAllEnemies(): EnemyData[] {
        return Array.from(this._enemies.values());
    }

    /**
     * 取得所有房間
     */
    public getAllRooms(): RoomData[] {
        return Array.from(this._rooms.values());
    }

    public get isLoaded(): boolean {
        return this._loaded;
    }
}
