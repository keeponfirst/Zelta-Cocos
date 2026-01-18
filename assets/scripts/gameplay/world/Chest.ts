/**
 * Chest - 寶箱
 */

import { _decorator, Component, Node, Collider2D, Contact2DType } from 'cc';
import { EventBus, GameEvents } from '../../core/EventBus';
import { Player } from '../entity/Player';
import { InventoryComponent } from '../components/InventoryComponent';

const { ccclass, property } = _decorator;

@ccclass('Chest')
export class Chest extends Component {
    @property
    public chestId: string = '';

    @property
    public itemId: string = 'heart';

    @property
    public itemCount: number = 1;

    @property
    public isOpen: boolean = false;

    @property
    public requiresTrigger: boolean = false;

    @property(Node)
    private openSprite: Node | null = null;

    @property(Node)
    private closedSprite: Node | null = null;

    protected start(): void {
        this.setupCollision();
        this.updateVisual();
    }

    private setupCollision(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onContact, this);
        }
    }

    private onContact(other: Collider2D): void {
        if (this.isOpen) return;
        if (this.requiresTrigger) return;

        const player = other.node.getComponent(Player);
        if (player) {
            this.open(player);
        }
    }

    /**
     * 開啟寶箱
     */
    public open(player?: Player): void {
        if (this.isOpen) return;

        this.isOpen = true;
        this.updateVisual();

        // 給予道具
        if (player) {
            const inventory = player.getGameComponent(InventoryComponent);
            if (inventory) {
                inventory.addItem(this.itemId, this.itemCount);
            }
        }

        // 發送事件
        EventBus.getInstance().emit(GameEvents.CHEST_OPENED, {
            chestId: this.chestId,
            itemId: this.itemId,
            itemCount: this.itemCount,
        });

        // TODO: 播放開啟動畫/音效
    }

    /**
     * 由觸發器觸發開啟
     */
    public triggerOpen(): void {
        if (this.requiresTrigger) {
            this.requiresTrigger = false;
            // 下一次玩家碰觸時可開啟
        }
    }

    private updateVisual(): void {
        if (this.openSprite) {
            this.openSprite.active = this.isOpen;
        }
        if (this.closedSprite) {
            this.closedSprite.active = !this.isOpen;
        }
    }

    /**
     * 從存檔載入
     */
    public loadFromSave(isOpen: boolean): void {
        this.isOpen = isOpen;
        this.updateVisual();
    }
}
