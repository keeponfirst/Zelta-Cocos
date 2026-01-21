/**
 * Entity - 實體基類
 * 
 * 所有遊戲物件的基類，管理 Component 的生命週期
 */

import { _decorator, Component as CCComponent, Node, Vec3 } from 'cc';
import { Component } from './Component';

const { ccclass, property } = _decorator;

@ccclass('Entity')
export class Entity extends CCComponent {
    @property
    public entityId: string = '';

    private _components: Map<string, Component> = new Map();
    private _active: boolean = true;

    public get isActive(): boolean {
        return this._active;
    }

    public set isActive(value: boolean) {
        this._active = value;
    }

    /**
     * 新增元件
     */
    public addGameComponent<T extends Component>(ComponentClass: new () => T): T {
        // TODO: 實作元件新增
        if (ComponentClass.prototype instanceof CCComponent) {
            throw new Error(
                `Use node.addComponent() for Cocos Components. ` +
                `Entity.addGameComponent() is for game logic components only: ${ComponentClass.name}`
            );
        }
        const comp = new ComponentClass();
        comp.entity = this;
        this._components.set(ComponentClass.name, comp);
        comp.onAdd();
        return comp;
    }

    /**
     * 取得元件
     */
    public getGameComponent<T extends Component>(ComponentClass: new () => T): T | null {
        // TODO: 實作元件取得
        return this._components.get(ComponentClass.name) as T || null;
    }

    /**
     * 移除元件
     */
    public removeGameComponent<T extends Component>(ComponentClass: new () => T): void {
        // TODO: 實作元件移除
        const comp = this._components.get(ComponentClass.name);
        if (comp) {
            comp.onRemove();
            this._components.delete(ComponentClass.name);
        }
    }

    /**
     * 檢查是否有元件
     */
    public hasGameComponent<T extends Component>(ComponentClass: new () => T): boolean {
        return this._components.has(ComponentClass.name);
    }

    protected update(dt: number): void {
        if (!this._active) return;

        // 更新所有元件
        this._components.forEach(comp => {
            if (comp.enabled) {
                comp.update(dt);
            }
        });
    }

    protected onDestroy(): void {
        // 清理所有元件
        this._components.forEach(comp => comp.onRemove());
        this._components.clear();
    }
}
