/**
 * Door - 門
 * 
 * 房間之間的通道
 */

import { _decorator, Component, Node, Collider2D, Contact2DType } from 'cc';
import { EventBus, GameEvents } from '../../core/EventBus';
import { RoomManager } from './RoomManager';
import { Player } from '../entity/Player';
import { InventoryComponent } from '../components/InventoryComponent';

const { ccclass, property } = _decorator;

export type DoorType = 'normal' | 'locked' | 'boss' | 'combat';
export type DoorDirection = 'north' | 'south' | 'east' | 'west';

@ccclass('Door')
export class Door extends Component {
    @property
    public doorId: string = '';

    @property
    public doorType: DoorType = 'normal';

    @property
    public direction: DoorDirection = 'north';

    @property
    public targetRoomId: string = '';

    @property
    public isOpen: boolean = true;

    @property(Node)
    private openSprite: Node | null = null;

    @property(Node)
    private closedSprite: Node | null = null;

    protected start(): void {
        this.setupCollision();
        this.setupEvents();
        this.updateVisual();

        // 戰鬥門初始關閉
        if (this.doorType === 'combat') {
            this.isOpen = false;
        }
    }

    private setupCollision(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }

    private setupEvents(): void {
        EventBus.getInstance().on(GameEvents.ENEMY_CLEARED, this.onEnemyCleared.bind(this));
    }

    private onContact(other: Collider2D): void {
        const player = other.node.getComponent(Player);
        if (!player) return;

        this.tryEnter(player);
    }

    /**
     * 嘗試進入門
     */
    public tryEnter(player: Player): boolean {
        if (!this.canEnter(player)) return false;

        // 消耗鑰匙
        if (this.doorType === 'locked') {
            const inventory = player.getGameComponent(InventoryComponent);
            if (inventory) {
                inventory.removeItem('key', 1);
            }
            this.unlock();
        }

        // 切換房間
        RoomManager.getInstance()?.loadRoom(this.targetRoomId);
        return true;
    }

    /**
     * 檢查是否可以進入
     */
    public canEnter(player: Player): boolean {
        if (!this.isOpen) return false;

        switch (this.doorType) {
            case 'normal':
                return true;

            case 'locked': {
                const inventory = player.getGameComponent(InventoryComponent);
                return inventory?.hasItem('key') || false;
            }

            case 'boss': {
                const inventory = player.getGameComponent(InventoryComponent);
                return inventory?.hasItem('boss_key') || false;
            }

            case 'combat':
                return this.isOpen;

            default:
                return true;
        }
    }

    private onEnemyCleared(data: { roomId: string }): void {
        if (this.doorType === 'combat') {
            this.unlock();
        }
    }

    /**
     * 解鎖門
     */
    public unlock(): void {
        this.isOpen = true;
        this.updateVisual();

        EventBus.getInstance().emit(GameEvents.DOOR_OPEN, {
            doorId: this.doorId,
            doorType: this.doorType,
        });
    }

    /**
     * 鎖定門
     */
    public lock(): void {
        this.isOpen = false;
        this.updateVisual();

        EventBus.getInstance().emit(GameEvents.DOOR_CLOSE, {
            doorId: this.doorId,
        });
    }

    private updateVisual(): void {
        if (this.openSprite) {
            this.openSprite.active = this.isOpen;
        }
        if (this.closedSprite) {
            this.closedSprite.active = !this.isOpen;
        }
    }

    protected onDestroy(): void {
        EventBus.getInstance().off(GameEvents.ENEMY_CLEARED, this.onEnemyCleared.bind(this));
    }
}
