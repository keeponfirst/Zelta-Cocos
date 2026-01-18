/**
 * Component - 元件基類
 * 
 * 所有遊戲元件的基類，由 Entity 管理
 */

import { Entity } from './Entity';

export abstract class Component {
    public entity: Entity | null = null;
    public enabled: boolean = true;

    /**
     * 元件被新增時呼叫
     */
    public onAdd(): void {
        // TODO: 子類覆寫
    }

    /**
     * 元件被移除時呼叫
     */
    public onRemove(): void {
        // TODO: 子類覆寫
    }

    /**
     * 每幀更新
     */
    public update(dt: number): void {
        // TODO: 子類覆寫
    }

    /**
     * 取得同 Entity 的其他元件
     */
    protected getComponent<T extends Component>(ComponentClass: new () => T): T | null {
        return this.entity?.getGameComponent(ComponentClass) || null;
    }
}
