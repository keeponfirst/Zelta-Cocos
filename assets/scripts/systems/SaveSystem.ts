/**
 * SaveSystem - 存檔系統
 * 
 * 管理遊戲存檔的讀寫和版本遷移
 */

import { _decorator, Component, sys, find } from 'cc';
import { EventBus, GameEvents } from '../core/EventBus';
import { SaveMigrator } from './SaveMigrator';
import { Player } from '../gameplay/entity/Player';
import { InventoryComponent } from '../gameplay/components/InventoryComponent';
import { RoomManager } from '../gameplay/world/RoomManager';

const { ccclass, property } = _decorator;

export interface PlayerSaveData {
    hp: number;
    maxHp: number;
    position: { x: number; y: number };
}

export interface InventorySaveData {
    items: { itemId: string; count: number }[];
    equippedIndex: number;
    rupees: number;
}

export interface WorldSaveData {
    currentRoomId: string;
    clearedRooms: string[];
}

export interface SaveData {
    version: string;
    timestamp: number;
    player: PlayerSaveData;
    inventory: InventorySaveData;
    world: WorldSaveData;
}

const CURRENT_VERSION = '1.0.0';
const SAVE_KEY = 'zelta_save';

@ccclass('SaveSystem')
export class SaveSystem extends Component {
    private static _instance: SaveSystem | null = null;
    private readonly handleSave = (slotId: number = 0): void => {
        this.save(slotId);
    };
    private readonly handleLoad = (slotId: number = 0): void => {
        this.load(slotId);
    };

    public static getInstance(): SaveSystem | null {
        return SaveSystem._instance;
    }

    protected onLoad(): void {
        if (SaveSystem._instance && SaveSystem._instance !== this) {
            console.warn('SaveSystem instance already exists. Keeping the first instance and disabling this duplicate.');
            this.enabled = false;
            return;
        }
        SaveSystem._instance = this;

        EventBus.getInstance().on(GameEvents.SAVE_GAME, this.handleSave);
        EventBus.getInstance().on(GameEvents.LOAD_GAME, this.handleLoad);
    }

    protected onDestroy(): void {
        if (SaveSystem._instance === this) {
            SaveSystem._instance = null;
        }
        EventBus.getInstance().off(GameEvents.SAVE_GAME, this.handleSave);
        EventBus.getInstance().off(GameEvents.LOAD_GAME, this.handleLoad);
    }

    /**
     * 儲存遊戲
     */
    public save(slotId: number = 0): boolean {
        // TODO: 實作存檔
        try {
            const data = this.collectGameState();
            data.version = CURRENT_VERSION;
            data.timestamp = Date.now();
            if (!this.validateSaveData(data)) {
                console.error('Save data validation failed. Update schema/migrations before saving.');
                return false;
            }

            const key = `${SAVE_KEY}_${slotId}`;
            sys.localStorage.setItem(key, JSON.stringify(data));

            console.log(`Game saved to slot ${slotId}`);
            return true;
        } catch (error) {
            console.error('Save failed:', error);
            return false;
        }
    }

    /**
     * 讀取遊戲
     */
    public load(slotId: number = 0): SaveData | null {
        // TODO: 實作讀檔
        try {
            const key = `${SAVE_KEY}_${slotId}`;
            const raw = sys.localStorage.getItem(key);

            if (!raw) {
                console.log('No save data found');
                return null;
            }

            let data = JSON.parse(raw) as SaveData;

            // 版本遷移
            if (data.version !== CURRENT_VERSION) {
                data = SaveMigrator.migrate(data, CURRENT_VERSION);
                if (data.version !== CURRENT_VERSION) {
                    console.error(`Save data version ${data.version} is not supported. Add migration before loading.`);
                    return null;
                }
            }

            data = this.normalizeSaveData(data);
            if (!this.validateSaveData(data)) {
                console.error('Save data validation failed after migration. Check schema compatibility.');
                return null;
            }

            this.applyGameState(data);
            console.log(`Game loaded from slot ${slotId}`);
            return data;
        } catch (error) {
            console.error('Load failed:', error);
            return null;
        }
    }

    /**
     * 檢查是否有存檔
     */
    public hasSave(slotId: number = 0): boolean {
        const key = `${SAVE_KEY}_${slotId}`;
        return sys.localStorage.getItem(key) !== null;
    }

    /**
     * 刪除存檔
     */
    public deleteSave(slotId: number = 0): void {
        const key = `${SAVE_KEY}_${slotId}`;
        sys.localStorage.removeItem(key);
    }

    /**
     * 收集當前遊戲狀態
     */
    private collectGameState(): SaveData {
        const player = find('Player')?.getComponent(Player);
        const inventory = player?.getComponent(InventoryComponent);
        const roomManager = RoomManager.getInstance();

        return {
            version: CURRENT_VERSION,
            timestamp: Date.now(),
            player: player?.toSaveData(),
            inventory: inventory?.toSaveData(),
            world: roomManager?.toSaveData(),
        };
    }

    /**
     * 套用遊戲狀態
     */
    private applyGameState(data: SaveData): void {
        const player = find('Player')?.getComponent(Player);
        const inventory = player?.getComponent(InventoryComponent);
        const roomManager = RoomManager.getInstance();

        const hasPlayerData = !!data.player
            && typeof data.player.hp === 'number'
            && typeof data.player.maxHp === 'number'
            && !!data.player.position
            && typeof data.player.position.x === 'number'
            && typeof data.player.position.y === 'number';
        if (hasPlayerData) {
            player?.loadData(data.player);
        }

        if (data.inventory) {
            inventory?.loadData(data.inventory);
        }

        const hasWorldData = !!data.world
            && typeof data.world.currentRoomId === 'string'
            && Array.isArray(data.world.clearedRooms);
        if (hasWorldData) {
            roomManager?.loadData(data.world);
        }
    }

    private normalizeSaveData(data: SaveData): SaveData {
        const normalized: SaveData = { ...data };
        normalized.inventory = {
            items: [],
            equippedIndex: -1,
            rupees: 0,
            ...(normalized.inventory ?? {}),
        };
        if (!Array.isArray(normalized.inventory.items)) {
            normalized.inventory.items = [];
        }
        normalized.world = {
            currentRoomId: '',
            clearedRooms: [],
            ...(normalized.world ?? {}),
        };
        normalized.world.clearedRooms = Array.isArray(normalized.world.clearedRooms)
            ? normalized.world.clearedRooms
            : [];
        return normalized;
    }

    private validateSaveData(data: SaveData): boolean {
        const hasPlayer = !!data.player
            && typeof data.player.hp === 'number'
            && typeof data.player.maxHp === 'number'
            && !!data.player.position
            && typeof data.player.position.x === 'number'
            && typeof data.player.position.y === 'number';
        const hasInventory = !!data.inventory
            && Array.isArray(data.inventory.items)
            && typeof data.inventory.equippedIndex === 'number'
            && typeof data.inventory.rupees === 'number';
        const hasWorld = !!data.world
            && typeof data.world.currentRoomId === 'string'
            && Array.isArray(data.world.clearedRooms);

        return !!data
            && typeof data.version === 'string'
            && typeof data.timestamp === 'number'
            && hasPlayer
            && hasInventory
            && hasWorld;
    }

    /**
     * 建立新遊戲存檔
     */
    public createNewGame(): SaveData {
        return this.collectGameState();
    }
}
