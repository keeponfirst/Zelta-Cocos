/**
 * UISystem - UI 系統
 * 
 * 管理 UI 面板的顯示/隱藏
 */

import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('UISystem')
export class UISystem extends Component {
    private static _instance: UISystem | null = null;

    @property(Node)
    private hudNode: Node | null = null;

    @property(Node)
    private inventoryPanel: Node | null = null;

    @property(Node)
    private pauseMenu: Node | null = null;

    @property(Node)
    private debugPanel: Node | null = null;

    private _panelStack: Node[] = [];

    public static getInstance(): UISystem | null {
        return UISystem._instance;
    }

    protected onLoad(): void {
        UISystem._instance = this;
        this.hideAllPanels();
    }

    protected onDestroy(): void {
        UISystem._instance = null;
    }

    /**
     * 顯示 HUD
     */
    public showHUD(): void {
        if (this.hudNode) {
            this.hudNode.active = true;
        }
    }

    /**
     * 隱藏 HUD
     */
    public hideHUD(): void {
        if (this.hudNode) {
            this.hudNode.active = false;
        }
    }

    /**
     * 開啟背包
     */
    public openInventory(): void {
        this.pushPanel(this.inventoryPanel);
    }

    /**
     * 開啟暫停選單
     */
    public openPauseMenu(): void {
        this.pushPanel(this.pauseMenu);
    }

    /**
     * 開啟除錯面板
     */
    public openDebugPanel(): void {
        this.pushPanel(this.debugPanel);
    }

    /**
     * 關閉當前面板
     */
    public closeCurrentPanel(): void {
        this.popPanel();
    }

    /**
     * 隱藏所有面板
     */
    public hideAllPanels(): void {
        if (this.inventoryPanel) this.inventoryPanel.active = false;
        if (this.pauseMenu) this.pauseMenu.active = false;
        if (this.debugPanel) this.debugPanel.active = false;
        this._panelStack = [];
    }

    private pushPanel(panel: Node | null): void {
        if (!panel) return;

        // 隱藏當前面板
        if (this._panelStack.length > 0) {
            this._panelStack[this._panelStack.length - 1].active = false;
        }

        panel.active = true;
        this._panelStack.push(panel);
    }

    private popPanel(): void {
        if (this._panelStack.length === 0) return;

        const panel = this._panelStack.pop()!;
        panel.active = false;

        // 顯示前一個面板
        if (this._panelStack.length > 0) {
            this._panelStack[this._panelStack.length - 1].active = true;
        }
    }

    public get hasOpenPanel(): boolean {
        return this._panelStack.length > 0;
    }
}
