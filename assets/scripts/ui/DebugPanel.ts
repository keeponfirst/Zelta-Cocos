/**
 * DebugPanel - 除錯面板
 */

import { _decorator, Component, Node, Label, EditBox, Toggle, director } from 'cc';
import { RoomManager } from '../gameplay/world/RoomManager';
import { InventoryComponent } from '../gameplay/components/InventoryComponent';
import { HealthComponent } from '../gameplay/components/HealthComponent';

const { ccclass, property } = _decorator;

@ccclass('DebugPanel')
export class DebugPanel extends Component {
    @property(Toggle)
    private godModeToggle: Toggle | null = null;

    @property(Toggle)
    private showCollidersToggle: Toggle | null = null;

    @property(EditBox)
    private itemIdInput: EditBox | null = null;

    @property(EditBox)
    private roomIdInput: EditBox | null = null;

    @property(Label)
    private fpsLabel: Label | null = null;

    private _godMode: boolean = false;
    private _showColliders: boolean = false;
    private _player: Node | null = null;

    protected start(): void {
        this.setupControls();
    }

    protected update(dt: number): void {
        this.updateFPS(dt);
    }

    private setupControls(): void {
        this.godModeToggle?.node.on('toggle', this.onGodModeToggle, this);
        this.showCollidersToggle?.node.on('toggle', this.onShowCollidersToggle, this);
    }

    private updateFPS(dt: number): void {
        if (this.fpsLabel) {
            const fps = Math.round(1 / dt);
            this.fpsLabel.string = `FPS: ${fps}`;
        }
    }

    /**
     * 設定玩家參考
     */
    public setPlayer(player: Node): void {
        this._player = player;
    }

    /**
     * 切換無敵模式
     */
    private onGodModeToggle(toggle: Toggle): void {
        this._godMode = toggle.isChecked;

        if (this._player) {
            const health = this._player.getComponent(HealthComponent);
            if (health) {
                // TODO: 設定無敵
            }
        }

        console.log(`God Mode: ${this._godMode}`);
    }

    /**
     * 切換碰撞框顯示
     */
    private onShowCollidersToggle(toggle: Toggle): void {
        this._showColliders = toggle.isChecked;
        // TODO: 實作碰撞框顯示
        console.log(`Show Colliders: ${this._showColliders}`);
    }

    /**
     * 新增道具
     */
    public addItem(): void {
        if (!this._player || !this.itemIdInput) return;

        const itemId = this.itemIdInput.string;
        if (!itemId) return;

        const inventory = this._player.getComponent(InventoryComponent);
        if (inventory) {
            inventory.addItem(itemId, 1);
            console.log(`Added item: ${itemId}`);
        }
    }

    /**
     * 跳轉房間
     */
    public jumpToRoom(): void {
        if (!this.roomIdInput) return;

        const roomId = this.roomIdInput.string;
        if (!roomId) return;

        RoomManager.getInstance()?.loadRoom(roomId);
        console.log(`Jumped to room: ${roomId}`);
    }

    /**
     * 清除當前房間敵人
     */
    public killAllEnemies(): void {
        // TODO: 取得當前房間所有敵人並殺死
        console.log('Kill all enemies');
    }

    /**
     * 完全回復血量
     */
    public fullHeal(): void {
        if (!this._player) return;

        const health = this._player.getComponent(HealthComponent);
        if (health) {
            health.fullHeal();
            console.log('Full heal');
        }
    }

    /**
     * 調整時間流速
     */
    public setTimeScale(scale: number): void {
        director.getScheduler().setTimeScale(scale);
        console.log(`Time scale: ${scale}`);
    }

    /**
     * 關閉面板
     */
    public close(): void {
        this.node.active = false;
    }
}
