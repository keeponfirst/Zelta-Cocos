/**
 * InputSystem - 輸入系統
 * 
 * 統一處理 PC 鍵盤和 Mobile 虛擬搖桿輸入
 */

import { _decorator, Component, Vec2, input, Input, EventKeyboard, KeyCode } from 'cc';

const { ccclass, property } = _decorator;

export interface InputState {
    movement: Vec2;
    attack: boolean;
    useItem: boolean;
    menu: boolean;
}

@ccclass('InputSystem')
export class InputSystem extends Component {
    private static _instance: InputSystem | null = null;

    private _state: InputState = {
        movement: new Vec2(0, 0),
        attack: false,
        useItem: false,
        menu: false,
    };

    private _keys: Set<KeyCode> = new Set();

    public static getInstance(): InputSystem | null {
        return InputSystem._instance;
    }

    protected onLoad(): void {
        InputSystem._instance = this;
        this.setupKeyboardInput();
    }

    protected onDestroy(): void {
        InputSystem._instance = null;
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private setupKeyboardInput(): void {
        // TODO: 實作鍵盤輸入
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(event: EventKeyboard): void {
        this._keys.add(event.keyCode);
        this.updateInputState();
    }

    private onKeyUp(event: EventKeyboard): void {
        this._keys.delete(event.keyCode);
        this.updateInputState();
    }

    private updateInputState(): void {
        // Movement
        let x = 0, y = 0;
        if (this._keys.has(KeyCode.KEY_W) || this._keys.has(KeyCode.ARROW_UP)) y = 1;
        if (this._keys.has(KeyCode.KEY_S) || this._keys.has(KeyCode.ARROW_DOWN)) y = -1;
        if (this._keys.has(KeyCode.KEY_A) || this._keys.has(KeyCode.ARROW_LEFT)) x = -1;
        if (this._keys.has(KeyCode.KEY_D) || this._keys.has(KeyCode.ARROW_RIGHT)) x = 1;
        this._state.movement.set(x, y);

        // Actions
        this._state.attack = this._keys.has(KeyCode.KEY_J) || this._keys.has(KeyCode.SPACE);
        this._state.useItem = this._keys.has(KeyCode.KEY_K);
        this._state.menu = this._keys.has(KeyCode.KEY_I) || this._keys.has(KeyCode.ESCAPE);
    }

    /**
     * 設定虛擬搖桿輸入 (由 VirtualJoystick 呼叫)
     */
    public setJoystickInput(direction: Vec2): void {
        this._state.movement.set(direction.x, direction.y);
    }

    /**
     * 設定攻擊輸入 (由 UI 按鈕呼叫)
     */
    public setAttackInput(pressed: boolean): void {
        this._state.attack = pressed;
    }

    /**
     * 設定道具輸入 (由 UI 按鈕呼叫)
     */
    public setItemInput(pressed: boolean): void {
        this._state.useItem = pressed;
    }

    public getState(): InputState {
        return this._state;
    }

    public getDirection(): Vec2 {
        return this._state.movement;
    }

    public isButtonPressed(button: 'attack' | 'useItem' | 'menu'): boolean {
        return this._state[button];
    }

    public isItemUsePressed(): boolean {
        return this._state.useItem;
    }

    public isMenuPressed(): boolean {
        return this._state.menu;
    }
}
