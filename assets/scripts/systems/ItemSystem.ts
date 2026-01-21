import { _decorator, Component, Node, Prefab, resources, instantiate } from 'cc';
import { Player } from '../gameplay/entity/Player';

const { ccclass, property } = _decorator;

@ccclass('ItemSystem')
export class ItemSystem extends Component {
    private static _instance: ItemSystem | null = null;

    public static getInstance(): ItemSystem | null {
        return ItemSystem._instance;
    }

    protected onLoad(): void {
        if (ItemSystem._instance && ItemSystem._instance !== this) {
            console.warn('ItemSystem instance already exists. Replacing with the newest instance.');
        }
        ItemSystem._instance = this;
    }

    protected onDestroy(): void {
        if (ItemSystem._instance === this) {
            ItemSystem._instance = null;
        }
    }

    public useItem(itemId: string, user: Node): void {
        switch (itemId) {
            case 'bomb':
                this.useBomb(user as Player);
                break;
            case 'boomerang':
                this.useBoomerang(user as Player);
                break;
        }
    }

    private useBomb(user: Player): void {
        resources.load('prefabs/items/bomb', Prefab, (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            const bomb = instantiate(prefab);
            bomb.setWorldPosition(user.node.worldPosition);
            user.node.parent.addChild(bomb);
        });
    }

    private useBoomerang(user: Player): void {
        resources.load('prefabs/items/boomerang', Prefab, (err, prefab) => {
            if (err) {
                console.error(err);
                return;
            }
            const boomerang = instantiate(prefab);
            boomerang.setWorldPosition(user.node.worldPosition);
            user.node.parent.addChild(boomerang);
            boomerang.getComponent('Boomerang').init(user);
        });
    }
}
