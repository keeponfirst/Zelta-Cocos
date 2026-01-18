/**
 * PauseMenu - 暫停選單
 */

import { _decorator, Component, Node, director, game } from 'cc';
import { EventBus, GameEvents } from '../core/EventBus';
import { SaveSystem } from '../systems/SaveSystem';

const { ccclass, property } = _decorator;

@ccclass('PauseMenu')
export class PauseMenu extends Component {
    @property(Node)
    private resumeButton: Node | null = null;

    @property(Node)
    private saveButton: Node | null = null;

    @property(Node)
    private settingsButton: Node | null = null;

    @property(Node)
    private quitButton: Node | null = null;

    protected start(): void {
        this.setupButtons();
    }

    private setupButtons(): void {
        this.resumeButton?.on(Node.EventType.TOUCH_END, this.onResume, this);
        this.saveButton?.on(Node.EventType.TOUCH_END, this.onSave, this);
        this.settingsButton?.on(Node.EventType.TOUCH_END, this.onSettings, this);
        this.quitButton?.on(Node.EventType.TOUCH_END, this.onQuit, this);
    }

    protected onEnable(): void {
        // 暫停遊戲
        director.pause();
        EventBus.getInstance().emit(GameEvents.PAUSE_GAME, {});
    }

    protected onDisable(): void {
        // 恢復遊戲
        director.resume();
        EventBus.getInstance().emit(GameEvents.RESUME_GAME, {});
    }

    private onResume(): void {
        this.close();
    }

    private onSave(): void {
        SaveSystem.getInstance()?.save(0);
        // TODO: 顯示存檔成功提示
    }

    private onSettings(): void {
        // TODO: 開啟設定面板
    }

    private onQuit(): void {
        // 返回主選單
        director.resume();
        director.loadScene('mainMenu');
    }

    /**
     * 關閉選單
     */
    public close(): void {
        this.node.active = false;
    }
}
