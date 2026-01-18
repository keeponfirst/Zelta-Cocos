/**
 * VirtualJoystick - 虛擬搖桿
 */

import { _decorator, Component, Node, Vec2, Vec3, UITransform, EventTouch, input, Input } from 'cc';
import { InputSystem } from '../systems/InputSystem';

const { ccclass, property } = _decorator;

@ccclass('VirtualJoystick')
export class VirtualJoystick extends Component {
    @property(Node)
    private background: Node | null = null;

    @property(Node)
    private handle: Node | null = null;

    @property
    private maxRadius: number = 50;

    @property
    private deadZone: number = 0.1;

    private _touchId: number = -1;
    private _startPos: Vec3 = new Vec3();
    private _direction: Vec2 = new Vec2();

    protected start(): void {
        this.setupTouch();
        this._startPos = this.node.position.clone();
    }

    private setupTouch(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch): void {
        if (this._touchId !== -1) return;

        this._touchId = event.getID();
        this.updateHandlePosition(event);
    }

    private onTouchMove(event: EventTouch): void {
        if (event.getID() !== this._touchId) return;

        this.updateHandlePosition(event);
    }

    private onTouchEnd(event: EventTouch): void {
        if (event.getID() !== this._touchId) return;

        this._touchId = -1;
        this.resetHandle();
    }

    private updateHandlePosition(event: EventTouch): void {
        if (!this.handle || !this.background) return;

        const uiTransform = this.background.getComponent(UITransform);
        if (!uiTransform) return;

        // 計算相對位置
        const location = event.getUILocation();
        const localPos = new Vec3();
        uiTransform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0), localPos);

        // 限制在半徑內
        const dist = Math.sqrt(localPos.x * localPos.x + localPos.y * localPos.y);
        if (dist > this.maxRadius) {
            localPos.multiplyScalar(this.maxRadius / dist);
        }

        this.handle.setPosition(localPos);

        // 計算方向
        this._direction.set(localPos.x / this.maxRadius, localPos.y / this.maxRadius);

        // 死區處理
        if (this._direction.length() < this.deadZone) {
            this._direction.set(0, 0);
        }

        // 發送到 InputSystem
        InputSystem.getInstance()?.setJoystickInput(this._direction);
    }

    private resetHandle(): void {
        if (this.handle) {
            this.handle.setPosition(Vec3.ZERO);
        }
        this._direction.set(0, 0);
        InputSystem.getInstance()?.setJoystickInput(this._direction);
    }

    public getDirection(): Vec2 {
        return this._direction.clone();
    }

    protected onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}
