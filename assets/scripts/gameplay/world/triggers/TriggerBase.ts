/**
 * TriggerBase - 觸發器基類
 */

import { _decorator, Component, Collider2D, Contact2DType } from 'cc';
import { EventBus, GameEvents } from '../../../core/EventBus';
import { Player } from '../../entity/Player';

const { ccclass, property } = _decorator;

@ccclass('TriggerBase')
export abstract class TriggerBase extends Component {
    @property
    public triggerId: string = '';

    @property
    public linkedTargets: string[] = [];

    @property
    public isActivated: boolean = false;

    @property
    public oneTime: boolean = false;

    protected start(): void {
        this.setupCollision();
    }

    private setupCollision(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onEnter, this);
            collider.on(Contact2DType.END_CONTACT, this.onExit, this);
        }
    }

    protected onEnter(other: Collider2D): void {
        // 子類覆寫
    }

    protected onExit(other: Collider2D): void {
        // 子類覆寫
    }

    /**
     * 啟動觸發器
     */
    public activate(): void {
        if (this.oneTime && this.isActivated) return;

        this.isActivated = true;
        this.onActivate();

        EventBus.getInstance().emit(GameEvents.SWITCH_ON, {
            triggerId: this.triggerId,
            linkedTargets: this.linkedTargets,
        });
    }

    /**
     * 關閉觸發器
     */
    public deactivate(): void {
        if (this.oneTime && this.isActivated) return;

        this.isActivated = false;
        this.onDeactivate();

        EventBus.getInstance().emit(GameEvents.SWITCH_OFF, {
            triggerId: this.triggerId,
        });
    }

    /**
     * 切換狀態
     */
    public toggle(): void {
        if (this.isActivated) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    protected abstract onActivate(): void;
    protected abstract onDeactivate(): void;
}
