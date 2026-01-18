/**
 * RoomManager - 房間管理
 * 
 * 管理房間載入、切換、敵人清除追蹤
 */

import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { EventBus, GameEvents } from '../../core/EventBus';
import { DataManager, RoomData } from '../../core/DataManager';
import { Room, RoomState } from './Room';

const { ccclass, property } = _decorator;

@ccclass('RoomManager')
export class RoomManager extends Component {
    private static _instance: RoomManager | null = null;

    @property(Node)
    private roomContainer: Node | null = null;

    @property(Prefab)
    private roomPrefab: Prefab | null = null;

    private _currentRoom: Room | null = null;
    private _currentRoomId: string = '';
    private _roomsCleared: Set<string> = new Set();

    public static getInstance(): RoomManager | null {
        return RoomManager._instance;
    }

    protected onLoad(): void {
        RoomManager._instance = this;
        this.setupEvents();
    }

    protected onDestroy(): void {
        RoomManager._instance = null;
    }

    private setupEvents(): void {
        EventBus.getInstance().on(GameEvents.ENEMY_CLEARED, this.onEnemyCleared.bind(this));
    }

    /**
     * 載入房間
     */
    public async loadRoom(roomId: string, spawnPosition?: Vec3): Promise<boolean> {
        const roomData = DataManager.getInstance().getRoom(roomId);
        if (!roomData) {
            console.error(`Room not found: ${roomId}`);
            return false;
        }

        // 卸載當前房間
        if (this._currentRoom) {
            await this.unloadCurrentRoom();
        }

        // 發送離開事件
        if (this._currentRoomId) {
            EventBus.getInstance().emit(GameEvents.ROOM_EXIT, {
                roomId: this._currentRoomId,
            });
        }

        // 創建新房間
        await this.createRoom(roomData);
        this._currentRoomId = roomId;

        // 發送進入事件
        EventBus.getInstance().emit(GameEvents.ROOM_ENTER, {
            roomId: roomId,
            isCleared: this._roomsCleared.has(roomId),
        });

        return true;
    }

    private async createRoom(roomData: RoomData): Promise<void> {
        if (!this.roomPrefab || !this.roomContainer) return;

        const roomNode = instantiate(this.roomPrefab);
        roomNode.parent = this.roomContainer;

        const room = roomNode.getComponent(Room);
        if (room) {
            await room.init(roomData);
            this._currentRoom = room;

            // 如果已清除，標記為已清除狀態
            if (this._roomsCleared.has(roomData.id)) {
                room.markAsCleared();
            }
        }
    }

    private async unloadCurrentRoom(): Promise<void> {
        if (this._currentRoom) {
            this._currentRoom.node.destroy();
            this._currentRoom = null;
        }
    }

    private onEnemyCleared(data: { roomId: string }): void {
        this._roomsCleared.add(data.roomId);
    }

    /**
     * 取得當前房間
     */
    public getCurrentRoom(): Room | null {
        return this._currentRoom;
    }

    /**
     * 取得當前房間 ID
     */
    public getCurrentRoomId(): string {
        return this._currentRoomId;
    }

    /**
     * 檢查房間是否已清除
     */
    public isRoomCleared(roomId: string): boolean {
        return this._roomsCleared.has(roomId);
    }

    /**
     * 房間轉換
     */
    public transition(doorId: string): void {
        if (!this._currentRoom) return;

        const door = this._currentRoom.getDoor(doorId);
        if (!door) {
            console.error(`Door not found: ${doorId}`);
            return;
        }

        const targetRoomId = door.targetRoomId;
        // TODO: Get spawn position from door
        this.loadRoom(targetRoomId);
    }

    /**
     * 從存檔還原
     */
    public loadFromSave(roomsCleared: string[]): void {
        this._roomsCleared = new Set(roomsCleared);
    }

    /**
     * 轉換為存檔格式
     */
    public toSaveFormat(): string[] {
        return Array.from(this._roomsCleared);
    }
}
