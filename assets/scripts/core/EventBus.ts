/**
 * EventBus - 全局事件匯流排
 * 
 * 用於解耦遊戲系統之間的通訊
 * 
 * @example
 * EventBus.getInstance().on('ENEMY_DEATH', (data) => console.log(data));
 * EventBus.getInstance().emit('ENEMY_DEATH', { enemyId: 'slime_01' });
 */

type EventCallback = (...args: any[]) => void;

export class EventBus {
    private static _instance: EventBus | null = null;
    private _events: Map<string, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): EventBus {
        if (!EventBus._instance) {
            EventBus._instance = new EventBus();
        }
        return EventBus._instance;
    }

    /**
     * 註冊事件監聽
     */
    public on(event: string, callback: EventCallback): void {
        // TODO: 實作事件註冊
        if (!this._events.has(event)) {
            this._events.set(event, []);
        }
        this._events.get(event)!.push(callback);
    }

    /**
     * 移除事件監聽
     */
    public off(event: string, callback: EventCallback): void {
        // TODO: 實作事件移除
        const callbacks = this._events.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * 觸發事件
     */
    public emit(event: string, ...args: any[]): void {
        // TODO: 實作事件觸發
        const callbacks = this._events.get(event);
        if (callbacks) {
            callbacks.forEach(cb => cb(...args));
        }
    }

    /**
     * 一次性事件監聽
     */
    public once(event: string, callback: EventCallback): void {
        // TODO: 實作一次性事件
        const wrapper = (...args: any[]) => {
            this.off(event, wrapper);
            callback(...args);
        };
        this.on(event, wrapper);
    }

    /**
     * 清除所有事件
     */
    public clear(): void {
        this._events.clear();
    }
}

// 事件名稱常數
export const GameEvents = {
    // 房間事件
    ROOM_ENTER: 'ROOM_ENTER',
    ROOM_EXIT: 'ROOM_EXIT',
    
    // 敵人事件
    ENEMY_SPAWN: 'ENEMY_SPAWN',
    ENEMY_DEATH: 'ENEMY_DEATH',
    ENEMY_CLEARED: 'ENEMY_CLEARED',
    
    // 玩家事件
    PLAYER_HURT: 'PLAYER_HURT',
    PLAYER_DEATH: 'PLAYER_DEATH',
    PLAYER_HEAL: 'PLAYER_HEAL',
    
    // 道具事件
    ITEM_PICKUP: 'ITEM_PICKUP',
    ITEM_USE: 'ITEM_USE',
    
    // 觸發器事件
    SWITCH_ON: 'SWITCH_ON',
    SWITCH_OFF: 'SWITCH_OFF',
    DOOR_OPEN: 'DOOR_OPEN',
    DOOR_CLOSE: 'DOOR_CLOSE',
    CHEST_OPENED: 'CHEST_OPENED',
    
    // 系統事件
    SAVE_GAME: 'SAVE_GAME',
    LOAD_GAME: 'LOAD_GAME',
    PAUSE_GAME: 'PAUSE_GAME',
    RESUME_GAME: 'RESUME_GAME',
} as const;
