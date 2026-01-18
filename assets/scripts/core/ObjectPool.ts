/**
 * ObjectPool - 泛型物件池
 * 
 * 用於管理頻繁創建/銷毀的物件，避免 GC spike
 * 
 * @example
 * const bulletPool = new ObjectPool(bulletPrefab, gameNode, 20);
 * const bullet = bulletPool.get();
 * // 使用後...
 * bulletPool.release(bullet);
 */

import { _decorator, Node, Prefab, instantiate } from 'cc';

export class ObjectPool<T extends Node = Node> {
    private _pool: T[] = [];
    private _prefab: Prefab;
    private _parent: Node;
    private _active: T[] = [];

    constructor(prefab: Prefab, parent: Node, initialSize: number = 10) {
        this._prefab = prefab;
        this._parent = parent;
        this.prewarm(initialSize);
    }

    /**
     * 預熱物件池
     */
    public prewarm(count: number): void {
        // TODO: 實作預熱
        for (let i = 0; i < count; i++) {
            const obj = instantiate(this._prefab) as T;
            obj.active = false;
            obj.parent = this._parent;
            this._pool.push(obj);
        }
    }

    /**
     * 從池中取得物件
     */
    public get(): T | null {
        // TODO: 實作取得
        let obj: T;
        if (this._pool.length > 0) {
            obj = this._pool.pop()!;
        } else {
            obj = instantiate(this._prefab) as T;
            obj.parent = this._parent;
        }
        obj.active = true;
        this._active.push(obj);
        return obj;
    }

    /**
     * 回收物件到池中
     */
    public release(obj: T): void {
        // TODO: 實作回收
        const index = this._active.indexOf(obj);
        if (index !== -1) {
            this._active.splice(index, 1);
        }
        obj.active = false;
        this._pool.push(obj);
    }

    /**
     * 回收所有活躍物件
     */
    public releaseAll(): void {
        while (this._active.length > 0) {
            this.release(this._active[0]);
        }
    }

    /**
     * 清空物件池
     */
    public clear(): void {
        this.releaseAll();
        this._pool.forEach(obj => obj.destroy());
        this._pool = [];
    }

    /**
     * 取得當前池中物件數量
     */
    public get poolSize(): number {
        return this._pool.length;
    }

    /**
     * 取得當前活躍物件數量
     */
    public get activeCount(): number {
        return this._active.length;
    }
}
