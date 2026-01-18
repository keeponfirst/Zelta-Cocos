/**
 * DebugPanel - 除錯面板
 */

import { _decorator, Component, Node, input, Input, KeyCode, director } from 'cc';
import { RoomManager } from '../gameplay/world/RoomManager';
import { InventoryComponent } from '../gameplay/components/InventoryComponent';
import { HealthComponent } from '../gameplay/components/HealthComponent';
import { Player } from '../gameplay/entity/Player';

const { ccclass, property } = _decorator;

@ccclass('DebugPanel')
export class DebugPanel extends Component {
    private _player: Player | null = null;
    private _health: HealthComponent | null = null;
    private _inventory: InventoryComponent | null = null;

    protected onLoad(): void {
        this.node.active = false;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected start(): void {
        // We need to find the player in the scene
        const playerNode = director.getScene()?.getChildByName('Player');
        if (playerNode) {
            this._player = playerNode.getComponent(Player);
            if (this._player) {
                this._health = this._player.getComponent(HealthComponent);
                this._inventory = this._player.getComponent(InventoryComponent);
            }
        }
    }

    private onKeyDown(event: any): void {
        if (event.keyCode === KeyCode.BACKQUOTE) {
            this.node.active = !this.node.active;
        }
    }

    public onBtnHeal(): void {
        if (this._health) {
            this._health.heal(99);
        }
    }

    public onBtnGodMode(): void {
        if (this._health) {
            this._health.isInvincible = !this._health.isInvincible;
        }
    }

    public onBtnAddRupee(): void {
        if (this._inventory) {
            this._inventory.addRupees(100);
        }
    }

    /**
     * 關閉面板
     */
    public close(): void {
        this.node.active = false;
    }
}
