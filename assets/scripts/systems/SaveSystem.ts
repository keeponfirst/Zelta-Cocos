/**
 * SaveSystem - 存檔系統
 * 
 * 管理遊戲存檔的讀寫和版本遷移
 */

import { _decorator, Component, sys } from 'cc';
import { EventBus, GameEvents } from '../core/EventBus';
import { SaveMigrator } from './SaveMigrator';

const { ccclass, property } = _decorator;

export interface SaveData {
    version: string;
    timestamp: number;
    player: {
        hp: number;
        maxHp: number;
        position: { x: number; y: number };
        currentRoom: string;
    };
    inventory: {
        items: Record<string, number>;
        equipment: string[];
    };
    world: {
        chestsOpened: string[];
        doorsUnlocked: string[];
        triggersActivated: string[];
    };
    dungeon: {
        currentDungeon: string | null;
        roomsCleared: string[];
        bossDefeated: boolean;
    };
}

const CURRENT_VERSION = '1.0.0';
const SAVE_KEY = 'zelta_save';

@ccclass('SaveSystem')
export class SaveSystem extends Component {
    private static _instance: SaveSystem | null = null;

    public static getInstance(): SaveSystem | null {
        return SaveSystem._instance;
    }

    protected onLoad(): void {
        SaveSystem._instance = this;

        EventBus.getInstance().on(GameEvents.SAVE_GAME, this.save.bind(this));
        EventBus.getInstance().on(GameEvents.LOAD_GAME, this.load.bind(this));
    }

    protected onDestroy(): void {
        SaveSystem._instance = null;
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
        // TODO: 從各系統收集狀態
        return {
            version: CURRENT_VERSION,
            timestamp: Date.now(),
            player: {
                hp: 6,
                maxHp: 6,
                position: { x: 0, y: 0 },
                currentRoom: 'overworld_start',
            },
            inventory: {
                items: {},
                equipment: ['sword_wood'],
            },
            world: {
                chestsOpened: [],
                doorsUnlocked: [],
                triggersActivated: [],
            },
            dungeon: {
                currentDungeon: null,
                roomsCleared: [],
                bossDefeated: false,
            },
        };
    }

    /**
     * 套用遊戲狀態
     */
    private applyGameState(data: SaveData): void {
        // TODO: 將狀態套用到各系統
        console.log('Applying game state:', data);
    }

    /**
     * 建立新遊戲存檔
     */
    public createNewGame(): SaveData {
        return this.collectGameState();
    }
}
